from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from schemas.cars import BrandResponseSchema, BrandCreateSchema, BrandUpdateSchema
from models.cars import Brand
from models.users import User, UserRole
from core.database import get_db
from api.auth import get_current_user

router = APIRouter(prefix="/cars-details", tags=["cars-details"])

@router.get("/brands", response_model=list[BrandResponseSchema])
def get_brand_all(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Brand).offset(skip).limit(limit).all()


@router.get("/brands/{brand_id}", response_model=BrandResponseSchema)
def get_brand_by_id(brand_id: int, db: Session = Depends(get_db)):
    brand_db = db.query(Brand).filter(Brand.id == brand_id).first()
    if not brand_db:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    return brand_db


@router.post("/brands", response_model=BrandResponseSchema)
def created_brand(brand: BrandCreateSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    existing = db.query(Brand).filter(Brand.name == brand.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Brand already exists")
    brand_db = Brand(**brand.model_dump())
    db.add(brand_db)
    db.commit()
    db.refresh(brand_db)

    return brand_db


@router.patch("/brands/{brand_id}", response_model=BrandResponseSchema)
def update_brand(brand_id: int, brand: BrandUpdateSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    brand_db = db.query(Brand).filter(Brand.id == brand_id).first()
    if not brand_db:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    update_data = brand.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(brand_db, field, value)

    db.commit()
    db.refresh(brand_db)

    return brand_db

@router.delete("/brands/{brand_id}", status_code=204)
def delete_brand(brand_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    brand_db = db.query(Brand).filter(Brand.id == brand_id).first()
    if not brand_db:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    db.delete(brand_db)
    db.commit()


get_model_all
get_model_by_id
created_model
update_model
delete_model

add_car_image
delete_car_image

add_tag_to_car
remove_tag_from_car

get_car_service_history
add_car_service_history
update_car_service_history

