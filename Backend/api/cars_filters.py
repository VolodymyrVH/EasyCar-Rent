from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from schemas.cars import CarTypeCreateSchema, CarTypeUpdateSchema, CarTypeResponseSchema, FuelTypeCreateSchema, FuelTypeUpdateSchema, FuelTypeResponseSchema, GearboxTypeCreateSchema, GearboxTypeUpdateSchema, GearboxTypeResponseSchema, TagCreateSchema, TagUpdateSchema, TagResponseSchema
from models.cars import CarType, FuelType, GearboxType, Tag
from core.database import get_db
from api.auth import get_current_user
from models.users import User, UserRole

router = APIRouter(prefix="/cars-filters", tags=["cars-filters"])


@router.get("/cartypes", response_model=list[CarTypeResponseSchema])
def get_cartype_all(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(CarType).offset(skip).limit(limit).all()


@router.get("/cartypes/{cartype_id}", response_model=CarTypeResponseSchema)
def get_cartype_by_id(cartype_id: int, db: Session = Depends(get_db)):
    cartype_db = db.query(CarType).filter(CarType.id == cartype_id).first()
    if not cartype_db:
        raise HTTPException(status_code=404, detail="Car Type not found")
    
    return cartype_db


@router.post("/cartypes", response_model=CarTypeResponseSchema)
def create_cartype(cartype: CarTypeCreateSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    existing = db.query(CarType).filter(CarType.name == cartype.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Car Type already exists")
    
    cartype_db = CarType(**cartype.model_dump())

    db.add(cartype_db)
    db.commit()
    db.refresh(cartype_db)

    return cartype_db


@router.patch("/cartypes/{cartype_id}", response_model=CarTypeResponseSchema)
def update_cartype(cartype_id: int, cartype: CarTypeUpdateSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    cartype_db = db.query(CarType).filter(CarType.id == cartype_id).first()
    if not cartype_db:
        raise HTTPException(status_code=404, detail="Car Type not found")
    
    update_data = cartype.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(cartype_db, field, value)

    db.commit()
    db.refresh(cartype_db)

    return cartype_db


@router.delete("/cartypes/{cartype_id}", status_code=204)
def delete_cartype(cartype_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    cartype_db = db.query(CarType).filter(CarType.id == cartype_id).first()
    if not cartype_db:
        raise HTTPException(status_code=404, detail="Car Type not found")
    
    db.delete(cartype_db)
    db.commit()


@router.get("/fueltypes", response_model=list[FuelTypeResponseSchema])
def get_fueltype_all(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(FuelType).offset(skip).limit(limit).all()


@router.get("/fueltypes/{fueltype_id}", response_model=FuelTypeResponseSchema)
def get_fueltype_by_id(fueltype_id: int, db: Session = Depends(get_db)):
    fueltype_db = db.query(FuelType).filter(FuelType.id == fueltype_id).first()
    if not fueltype_db:
        raise HTTPException(status_code=404, detail="Fuel Type not found")
    
    return fueltype_db


@router.post("/fueltypes", response_model=FuelTypeResponseSchema)
def create_fueltype(fueltype: FuelTypeCreateSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    existing = db.query(FuelType).filter(FuelType.name == fueltype.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Fuel Type already exists")
    
    fueltype_db = FuelType(**fueltype.model_dump())

    db.add(fueltype_db)
    db.commit()
    db.refresh(fueltype_db)

    return fueltype_db


@router.patch("/fueltypes/{fueltype_id}", response_model=FuelTypeResponseSchema)
def update_fueltype(fueltype_id: int, fueltype: FuelTypeUpdateSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    fueltype_db = db.query(FuelType).filter(FuelType.id == fueltype_id).first()
    if not fueltype_db:
        raise HTTPException(status_code=404, detail="Fuel Type not found")
    
    update_data = fueltype.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(fueltype_db, field, value)

    db.commit()
    db.refresh(fueltype_db)

    return fueltype_db


@router.delete("/fueltypes/{fueltype_id}", status_code=204)
def delete_fueltype(fueltype_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    fueltype_db = db.query(FuelType).filter(FuelType.id == fueltype_id).first()
    if not fueltype_db:
        raise HTTPException(status_code=404, detail="Fuel Type not found")
    
    db.delete(fueltype_db)
    db.commit()


@router.get("/gearboxtypes", response_model=list[GearboxTypeResponseSchema])
def get_gearboxtype_all(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(GearboxType).offset(skip).limit(limit).all()


@router.get("/gearboxtypes/{gearboxtype_id}", response_model=GearboxTypeResponseSchema)
def get_gearboxtype_by_id(gearboxtype_id: int, db: Session = Depends(get_db)):
    gearboxtype_db = db.query(GearboxType).filter(GearboxType.id == gearboxtype_id).first()
    if not gearboxtype_db:
        raise HTTPException(status_code=404, detail="Gearbox Type not found")
    
    return gearboxtype_db


@router.post("/gearboxtypes", response_model=GearboxTypeResponseSchema)
def created_gearboxtype(gearboxtype: GearboxTypeCreateSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    existing = db.query(GearboxType).filter(GearboxType.name == gearboxtype.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Gearbox Type already exists")
    
    gearboxtype_db = GearboxType(**gearboxtype.model_dump())

    db.add(gearboxtype_db)
    db.commit()
    db.refresh(gearboxtype_db)

    return gearboxtype_db


@router.patch("/gearboxtypes/{gearboxtype_id}", response_model=GearboxTypeResponseSchema)
def update_gearboxtype(gearboxtype_id: int, gearboxtype: GearboxTypeUpdateSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    gearboxtype_db = db.query(GearboxType).filter(GearboxType.id == gearboxtype_id).first()
    if not gearboxtype_db:
        raise HTTPException(status_code=404, detail="Gearbox Type not found")
    
    update_data = gearboxtype.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(gearboxtype_db, field, value)

    db.commit()
    db.refresh(gearboxtype_db)

    return gearboxtype_db


@router.delete("/gearboxtypes/{gearboxtype_id}", status_code=204)
def delete_gearboxtype(gearboxtype_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    gearboxtype_db = db.query(GearboxType).filter(GearboxType.id == gearboxtype_id).first()
    if not gearboxtype_db:
        raise HTTPException(status_code=404, detail="Gearbox Type not found")
    
    db.delete(gearboxtype_db)
    db.commit()


@router.get("/tags", response_model=list[TagResponseSchema])
def get_tag_all(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Tag).offset(skip).limit(limit).all()


@router.get("/tags/{tag_id}", response_model=TagResponseSchema)
def get_tag_by_id(tag_id: int, db: Session = Depends(get_db)):
    tag_db = db.query(Tag).filter(Tag.id == tag_id).first()
    if not tag_db:
        raise HTTPException(status_code=404, detail="Tag not found")
    
    return tag_db


@router.post("/tags", response_model=TagResponseSchema)
def create_tag(tag: TagCreateSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    existing = db.query(Tag).filter(Tag.name == tag.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Tag already exists")
    
    tag_db = Tag(**tag.model_dump())

    db.add(tag_db)
    db.commit()
    db.refresh(tag_db)

    return tag_db


@router.patch("/tags/{tag_id}", response_model=TagResponseSchema)
def update_tag(tag_id: int, tag: TagUpdateSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    tag_db = db.query(Tag).filter(Tag.id == tag_id).first()
    if not tag_db:
        raise HTTPException(status_code=404, detail="Tag not found")
    
    update_data = tag.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(tag_db, field, value)

    db.commit()
    db.refresh(tag_db)

    return tag_db


@router.delete("/tags/{tag_id}", status_code=204)
def delete_tag(tag_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    tag_db = db.query(Tag).filter(Tag.id == tag_id).first()
    if not tag_db:
        raise HTTPException(status_code=404, detail="Tag not found")
    
    db.delete(tag_db)
    db.commit()