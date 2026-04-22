from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from schemas.cars import BrandResponseSchema, BrandCreateSchema, BrandUpdateSchema, ModelResponseSchema, ModelCreateSchema, ModelUpdateSchema, CarImageResponseSchema, CarImageCreateSchema, CarTagResponseSchema, CarServiceHistoryResponseSchema, CarServiceHistoryCreateSchema, CarServiceHistoryUpdateSchema
from models.cars import Brand, Model, CarImage, Car, Tag, CarTag, CarServiceHistory
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


@router.get("/models", response_model=list[ModelResponseSchema])
def get_model_all(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Model).offset(skip).limit(limit).all()


@router.get("/models/{model_id}", response_model=ModelResponseSchema)
def get_model_by_id(model_id: int, db: Session = Depends(get_db)):
    model_db = db.query(Model).filter(Model.id == model_id).first()
    if not model_db:
        raise HTTPException(status_code=404, detail="Model not found")
    
    return model_db


@router.get("/brands/{brand_id}/models", response_model=list[ModelResponseSchema])
def get_models_by_brand(brand_id: int, db: Session = Depends(get_db)):
    brand_db = db.query(Brand).filter(Brand.id == brand_id).first()
    if not brand_db:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    return db.query(Model).filter(Model.brand_id == brand_id).all()


@router.post("/models", response_model=ModelResponseSchema, status_code=201)
def create_model(model: ModelCreateSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    brand_db = db.query(Brand).filter(Brand.id == model.brand_id).first()
    if not brand_db:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    existing = db.query(Model).filter(Model.brand_id == model.brand_id, Model.name == model.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Model already exists for this brand")
    
    model_db = Model(**model.model_dump())

    db.add(model_db)
    db.commit()
    db.refresh(model_db)
    
    return model_db


@router.patch("/models/{model_id}", response_model=ModelResponseSchema)
def update_model(model_id: int, model: ModelUpdateSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    model_db = db.query(Model).filter(Model.id == model_id).first()
    if not model_db:
        raise HTTPException(status_code=404, detail="Model not found")
    
    update_data = model.model_dump(exclude_unset=True)

    if "brand_id" in update_data:
        brand_db = db.query(Brand).filter(Brand.id == update_data["brand_id"]).first()
        if not brand_db:
            raise HTTPException(status_code=404, detail="Brand not found")

    for field, value in update_data.items():
        setattr(model_db, field, value)

    db.commit()
    db.refresh(model_db)
    return model_db


@router.delete("/models/{model_id}", status_code=204)
def delete_model(model_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    model_db = db.query(Model).filter(Model.id == model_id).first()
    if not model_db:
        raise HTTPException(status_code=404, detail="Model not found")
    
    db.delete(model_db)
    db.commit()


@router.post("/cars/{car_id}/images", response_model=CarImageResponseSchema, status_code=201)
def add_car_image(car_id: int, image: CarImageCreateSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    car_db = db.query(Car).filter(Car.id == car_id).first()
    if not car_db:
        raise HTTPException(status_code=404, detail="Car not found")

    if image.is_primary:
        db.query(CarImage).filter(CarImage.car_id == car_id).update({"is_primary": False})

    image_db = CarImage(
        car_id=car_id,
        image_url=image.image_url,
        is_primary=image.is_primary
    )

    db.add(image_db)
    db.commit()
    db.refresh(image_db)

    return image_db


@router.delete("/cars/{car_id}/images/{image_id}", status_code=204)
def delete_car_image(car_id: int, image_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    car_db = db.query(Car).filter(Car.id == car_id).first()
    if not car_db:
        raise HTTPException(status_code=404, detail="Car not found")

    image_db = db.query(CarImage).filter(CarImage.id == image_id, CarImage.car_id == car_id).first()
    if not image_db:
        raise HTTPException(status_code=404, detail="Image not found")

    db.delete(image_db)
    db.commit()


@router.post("/cars/{car_id}/tags/{tag_id}", status_code=201, response_model=CarTagResponseSchema)
def add_tag_to_car(car_id: int, tag_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    car_db = db.query(Car).filter(Car.id == car_id).first()
    if not car_db:
        raise HTTPException(status_code=404, detail="Car not found")
    
    tag_db = db.query(Tag).filter(Tag.id == tag_id).first()
    if not tag_db:
        raise HTTPException(status_code=404, detail="Tag not found")
    
    existing = db.query(CarTag).filter(CarTag.car_id == car_id, CarTag.tag_id == tag_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Tag already associated with this car")
    
    car_tag_db = CarTag(car_id=car_id, tag_id=tag_id)
    db.add(car_tag_db)
    db.commit()

    return CarTagResponseSchema(car_id=car_id, tag_id=tag_id)


@router.delete("/cars/{car_id}/tags/{tag_id}", status_code=204)
def remove_tag_from_car(car_id: int, tag_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    car_db = db.query(Car).filter(Car.id == car_id).first()
    if not car_db:
        raise HTTPException(status_code=404, detail="Car not found")
    
    tag_db = db.query(Tag).filter(Tag.id == tag_id).first()
    if not tag_db:
        raise HTTPException(status_code=404, detail="Tag not found")
    
    car_tag_db = db.query(CarTag).filter(CarTag.car_id == car_id, CarTag.tag_id == tag_id).first()
    if not car_tag_db:
        raise HTTPException(status_code=404, detail="Tag not associated with this car")
    
    db.delete(car_tag_db)
    db.commit()


@router.get("/cars/{car_id}/service-history", response_model=list[CarServiceHistoryResponseSchema])
def get_car_service_history_by_id(car_id: int, db: Session = Depends(get_db)):
    service_history_db = db.query(CarServiceHistory).filter(CarServiceHistory.car_id == car_id).all()
    if not service_history_db:
        raise HTTPException(status_code=404, detail="Service history not found")
    
    return service_history_db


@router.post("/cars/{car_id}/service-history", response_model=CarServiceHistoryResponseSchema, status_code=201)
def add_car_service_history(car_id: int, service_history: CarServiceHistoryCreateSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    car_db = db.query(Car).filter(Car.id == car_id).first()
    if not car_db:
        raise HTTPException(status_code=404, detail="Car not found")
    
    service_history_db = CarServiceHistory(
        car_id=car_id,
        **service_history.model_dump(exclude={"car_id"})
    )

    db.add(service_history_db)
    db.commit()
    db.refresh(service_history_db)

    return service_history_db


@router.patch("/cars/{car_id}/service-history/{service_history_id}", response_model=CarServiceHistoryResponseSchema)
def update_car_service_history(car_id: int, service_history_id: int, service_history: CarServiceHistoryUpdateSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    car_db = db.query(Car).filter(Car.id == car_id).first()
    if not car_db:
        raise HTTPException(status_code=404, detail="Car not found")
    
    service_history_db = db.query(CarServiceHistory).filter(CarServiceHistory.id == service_history_id, CarServiceHistory.car_id == car_id).first()
    if not service_history_db:
        raise HTTPException(status_code=404, detail="Service history not found")
    
    update_data = service_history.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(service_history_db, field, value)

    db.commit()
    db.refresh(service_history_db)

    return service_history_db

