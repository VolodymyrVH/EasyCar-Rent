from datetime import timedelta, datetime
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from schemas.rentals import *
from models.users import User, UserRole
from models.rentals import Location, Rental
from models.cars import Car, Tag, CarStatus
from core.database import get_db
from api.auth import get_current_user
import math


router = APIRouter(prefix="/rentals", tags=["rental"])


@router.get("/locations", response_model=list[LocationResponseSchema])
def get_locations_all(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Location).offset(skip).limit(limit).all()


@router.get("/locations/{location_id}", response_model=LocationResponseSchema)
def get_location_by_id(location_id: int, db: Session = Depends(get_db)):
    location_db = db.query(Location).filter(Location.id == location_id).first()
    if not location_db:
        raise HTTPException(status_code=404, detail="Location not found")
    
    return location_db


@router.post("/locations", response_model=LocationResponseSchema)
def create_location(location: LocationCreateSchema, db: Session = Depends(get_db)):
    location_db = Location(**location.model_dump())

    db.add(location_db)
    db.commit()
    db.refresh(location_db)

    return location_db


@router.patch("/locations/{location_id}", response_model=LocationResponseSchema)
def update_location(location_id: int, location: LocationUpdateSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    location_db = db.query(Location).filter(Location.id == location_id).first()
    if not location_db:
        raise HTTPException(status_code=404, detail="Location not found")
    
    update_data = location.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(location_db, field, value)
    
    db.commit()
    db.refresh(location_db)
    
    return location_db


@router.delete("/locations/{location_id}", status_code=204)
def delete_location(location_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    location_db = db.query(Location).filter(Location.id == location_id).first()
    if not location_db:
        raise HTTPException(status_code=404, detail="Locaiton not found")
    
    db.delete(location_db)
    db.commit()


@router.get("/rentals", response_model=list[RentalResponseSchema])
def get_all_rentals(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role == UserRole.ADMIN:
        return db.query(Rental).offset(skip).limit(limit).all()
    return db.query(Rental).filter(Rental.user_id == current_user.id).offset(skip).limit(limit).all()


@router.get("/rentals/{rental_id}", response_model=RentalResponseSchema)
def get_rental_by_id(rental_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rental_db = db.query(Rental).filter(Rental.id == rental_id).first()
    if not rental_db:
        raise HTTPException(status_code=404, detail="Rental not found")
    
    if current_user.role != UserRole.ADMIN and current_user.id != rental_db.user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return rental_db


def calculate_rental_price(car: Car, start_time: datetime, end_time: datetime, prepaid: bool = False):
    duration = end_time - start_time
    days = duration.total_seconds() / 86400
    N = max(1, math.ceil(days))

    Pbase = float(car.price_per_day)

    category_coefficients = {
        "luxury": 1.20,
        "economy": 1.05,
    }

    tag_names = {tag.name.lower() for tag in car.tags}

    Kcat = 1.00

    for tag, coefficient in category_coefficients.items():
        if tag in tag_names:
            Kcat = coefficient
            break

    
    def get_kseason(month: int):
        if month in (12, 1, 2):
            return 1.40
        if month in (9, 10, 11):
            return 1.15
        if month in (3, 4, 5):
            return 1.10
        
        return 1.00
    
    start_date = start_time.date()
    end_date = end_time.date()
    season_counts = {}
    current = start_date
    while current < end_date:
        k = get_kseason(current.month)
        season_counts[k] = season_counts.get(k, 0) + 1
        current += timedelta(days=1)

    total_days = sum(season_counts.values())

    if total_days == 0:
        Kseason = 1.0
    else:
        Kseason = sum(k * d for k, d in season_counts.items()) / total_days


    if N < 3:
        Ddiscount = 0
    elif N <= 7:
        Ddiscount = 2
    elif N <= 14:
        Ddiscount = 5
    else:
        Ddiscount = 10

    Kprem = 0.95 if prepaid else 1.00

    Ptotal = N * Pbase * Kcat * Kseason * (1 - Ddiscount / 100) * Kprem

    return N, round(Ptotal, 2)


@router.post("/rentals", response_model=RentalResponseSchema, status_code=201)
def create_rental(data: RentalCreateSchema, prepaid: bool = False, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    car = db.query(Car).filter(Car.id == data.car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    if car.status != CarStatus.AVAILABLE:
        raise HTTPException(status_code=400, detail="Car is not available")

    N, price_sum = calculate_rental_price(car, data.start_date, data.end_date, prepaid)

    pickup = Location(address=data.pickup_address)
    return_loc = Location(address=data.return_address)
    db.add(pickup)
    db.add(return_loc)
    db.flush() 

    rental = Rental(
        car_id=data.car_id,
        start_date=data.start_date,
        end_date=data.end_date,
        user_id=current_user.id,
        price_per_day=float(car.price_per_day),
        price_sum=price_sum,
        status=RentalStatus.PENDING,
        pickup_location_id=pickup.id,
        return_location_id=return_loc.id,
    )

    car.status = CarStatus.RENTED

    db.add(rental)
    db.commit()
    db.refresh(rental)
    return rental


@router.patch("/rentals/{rental_id}/cancel", response_model=RentalResponseSchema)
def cancel_rental(rental_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rental_db = db.query(Rental).filter(Rental.id == rental_id).first()
    if not rental_db:
        raise HTTPException(status_code=404, detail="Rental not found")
    if current_user.role != UserRole.ADMIN and current_user.id != rental_db.user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    if rental_db.status == RentalStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Cannot cancel completed rental")
    
    rental_db.status = RentalStatus.CANCELLED
    
    car = db.query(Car).filter(Car.id == rental_db.car_id).first()
    if car:
        car.status = CarStatus.AVAILABLE
    
    db.commit()
    db.refresh(rental_db)
    return rental_db