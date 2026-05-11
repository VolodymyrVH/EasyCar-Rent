from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from schemas.cars import CarResponseSchema, CarCreateSchema, CarUpdateSchema, CarStatusUpdateSchema
from models.cars import Car, CarStatus
from core.database import get_db
from api.auth import get_current_user
from models.users import User, UserRole


router = APIRouter(prefix="/cars", tags=["cars"])

@router.get("/", response_model=list[CarResponseSchema])
def get_car_all(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Car).offset(skip).limit(limit).all()


@router.get("/brand/{brand_id}", response_model=list[CarResponseSchema])
def get_cars_by_brand(brand_id: int, db: Session = Depends(get_db)):
    car_db = db.query(Car).filter(Car.brand_id == brand_id).all()
    if not car_db:
        raise HTTPException(status_code=404, detail="Car not found")
    
    return car_db


@router.get("/status/{status}", response_model=list[CarResponseSchema])
def get_cars_by_status(status: CarStatus, db: Session = Depends(get_db)):
    car_db = db.query(Car).filter(Car.status == status).all()
    if not car_db:
        raise HTTPException(status_code=404, detail="Car not found")
    
    return car_db


@router.get("/type/{car_type_id}", response_model=list[CarResponseSchema])
def get_cars_by_type(car_type_id: int, db: Session = Depends(get_db)):
    car_db = db.query(Car).filter(Car.car_type_id == car_type_id).all()
    if not car_db:
        raise HTTPException(status_code=404, detail="Car not found")
    
    return car_db


@router.get("/{car_id}", response_model=CarResponseSchema)
def get_car_by_id(car_id: int, db: Session = Depends(get_db)):
    car_db = db.query(Car).filter(Car.id == car_id).first()
    if not car_db:
        raise HTTPException(status_code=404, detail="Car not found")
    
    return car_db


@router.post("/", response_model=CarResponseSchema)
def create_car(car: CarCreateSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    existing = db.query(Car).filter((Car.plate == car.plate)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Car Plate already registered")
    
    car_db = Car(**car.model_dump(), status=CarStatus.AVAILABLE)

    db.add(car_db)
    db.commit()
    db.refresh(car_db)

    return car_db


@router.patch("/{car_id}/status", response_model=CarResponseSchema)
def update_car_status(car_id: int, data: CarStatusUpdateSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    car_db = db.query(Car).filter(Car.id == car_id).first()
    if not car_db:
        raise HTTPException(status_code=404, detail="Car not found")
    
    car_db.status = data.status
    db.commit()
    db.refresh(car_db)
    return car_db


@router.patch("/{car_id}", response_model=CarResponseSchema)
def update_car(car_id: int, car: CarUpdateSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    car_db = db.query(Car).filter(Car.id == car_id).first()
    if not car_db:
        raise HTTPException(status_code=404, detail="Car not found")
    
    update_data = car.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(car_db, field, value)

    db.commit()
    db.refresh(car_db)

    return car_db


@router.delete("/{car_id}", status_code=204)
def delete_car(car_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    car_db = db.query(Car).filter(Car.id == car_id).first()
    if not car_db:
        raise HTTPException(status_code=404, detail="Car not found")
    
    db.delete(car_db)
    db.commit()