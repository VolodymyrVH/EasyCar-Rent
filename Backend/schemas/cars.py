from datetime import date, datetime
from enum import Enum
from pydantic import BaseModel, Field, ConfigDict


class CarStatus(str, Enum):
    AVAILABLE = "AVAILABLE"
    RENTED = "RENTED"
    SERVICE = "SERVICE"


class CarStatusUpdateSchema(BaseModel):
    status: CarStatus


class BrandCreateSchema(BaseModel):
    name: str = Field(min_length=1, max_length=100)


class BrandUpdateSchema(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)
    

class BrandResponseSchema(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class ModelCreateSchema(BaseModel):
    brand_id: int
    name: str = Field(min_length=1, max_length=100)


class ModelUpdateSchema(BaseModel):
    brand_id: int | None = Field(None)
    name: str | None = Field(None, min_length=1, max_length=100)


class ModelResponseSchema(BaseModel):
    id: int
    brand_id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class CarTypeCreateSchema(BaseModel):
    name: str = Field(min_length=1, max_length=100)


class CarTypeUpdateSchema(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)
    

class CarTypeResponseSchema(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class FuelTypeCreateSchema(BaseModel):
    name: str = Field(min_length=1, max_length=50)


class FuelTypeUpdateSchema(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=50)
    

class FuelTypeResponseSchema(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class GearboxTypeCreateSchema(BaseModel):
    name: str = Field(min_length=1, max_length=50)


class GearboxTypeUpdateSchema(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=50)
    

class GearboxTypeResponseSchema(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class CarCreateSchema(BaseModel):
    brand_id: int
    model_id: int
    car_type_id: int
    fuel_type_id: int
    gearbox_type_id: int
    plate: str = Field(min_length=1, max_length=20)
    seats: int = Field(ge=1, le=10)
    doors: int = Field(ge=1, le=10)
    color: str = Field(min_length=1, max_length=50)
    fuel_per_km: float = Field(gt=0)
    mileage: int = Field(ge=0)
    year: int = Field(ge=1900)
    price_per_day: float = Field(gt=0)


class CarUpdateSchema(BaseModel):
    brand_id: int | None = Field(None)
    model_id: int | None = Field(None)
    car_type_id: int | None = Field(None)
    fuel_type_id: int | None = Field(None)
    gearbox_type_id: int | None = Field(None)
    plate: str | None = Field(None, min_length=1, max_length=20)
    seats: int | None = Field(None, ge=1, le=10)
    doors: int | None = Field(None, ge=1, le=10)
    color: str | None = Field(None, min_length=1, max_length=50)
    fuel_per_km: float | None = Field(None, gt=0)
    mileage: int | None = Field(None, ge=0)
    year: int | None = Field(None, ge=1900)
    price_per_day: float | None = Field(None, gt=0)
    

class CarResponseSchema(BaseModel):
    id: int
    brand_id: int
    model_id: int
    status: CarStatus
    car_type_id: int
    fuel_type_id: int
    gearbox_type_id: int
    plate: str
    seats: int
    doors: int
    color: str
    fuel_per_km: float
    mileage: int
    year: int
    price_per_day: float
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

    
class CarImageCreateSchema(BaseModel):
    car_id: int
    is_primary: bool = False


class CarImageUpdateSchema(BaseModel):
    car_id: int | None = Field(None)
    image_url: str | None = Field(None, min_length=1, max_length=500)
    is_primary: bool | None = Field(None)
    

class CarImageResponseSchema(BaseModel):
    id: int
    car_id: int
    image_url: str
    is_primary: bool

    model_config = ConfigDict(from_attributes=True)


class TagCreateSchema(BaseModel):
    name: str = Field(min_length=1, max_length=50)


class TagUpdateSchema(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=50)
    

class TagResponseSchema(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class CarTagCreateSchema(BaseModel):
    car_id: int
    tag_id: int


class CarTagResponseSchema(BaseModel):
    car_id: int
    tag_id: int

    model_config = ConfigDict(from_attributes=True)


class CarServiceHistoryCreateSchema(BaseModel):
    car_id: int
    description: str = Field(min_length=1, max_length=255)
    service_date: date
    mileage: int = Field(gt=0)


class CarServiceHistoryUpdateSchema(BaseModel):
    car_id: int | None = Field(None)
    description: str | None = Field(None, min_length=1, max_length=255)
    service_date: date | None = None
    mileage: int | None = Field(None, gt=0)
    

class CarServiceHistoryResponseSchema(BaseModel):
    id: int
    car_id: int
    description: str
    service_date: date
    mileage: int

    model_config = ConfigDict(from_attributes=True)
