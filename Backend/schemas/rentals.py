from datetime import date, datetime
from enum import Enum
from pydantic import BaseModel, Field, ConfigDict, field_validator


class RentalStatus(str, Enum):
    PENDING = "PENDING"
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class LocationCreateSchema(BaseModel):
    region: str = Field(min_length=1, max_length=100)
    city: str = Field(min_length=1, max_length=100)
    address: str = Field(min_length=1, max_length=100)


class LocationUpdateSchema(BaseModel):
    region: str | None = Field(None, min_length=1, max_length=100)
    city: str | None = Field(None, min_length=1, max_length=100)
    address: str | None = Field(None, min_length=1, max_length=100)


class LocationResponseSchema(BaseModel):
    id: int
    region: str
    city: str
    address: str

    model_config = ConfigDict(from_attributes=True)


class RentalCreateSchema(BaseModel):
    car_id: int
    start_date: date
    end_date: date
    pickup_location_id: int
    return_location_id: int


class RentalUpdateSchema(BaseModel):
    returned_at: datetime | None = Field(None)
    return_location_id: int | None = Field(None)
    status: RentalStatus | None = None


class RentalResponseSchema(BaseModel):
    id: int
    user_id: int
    car_id: int
    start_date: date
    end_date: date
    created_at: datetime
    returned_at: datetime | None = None
    price_per_day: float
    price_sum: float
    status: RentalStatus
    pickup_location_id: int
    return_location_id: int

    model_config = ConfigDict(from_attributes=True)
