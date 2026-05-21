from datetime import date, datetime
from enum import Enum
from pydantic import BaseModel, Field, ConfigDict, field_validator


class RentalStatus(str, Enum):
    PENDING = "PENDING"
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class LocationCreateSchema(BaseModel):
    address: str = Field(min_length=1, max_length=255)


class LocationUpdateSchema(BaseModel):
    address: str | None = Field(None, min_length=1, max_length=255)


class LocationResponseSchema(BaseModel):
    id: int
    address: str

    model_config = ConfigDict(from_attributes=True)


class RentalCreateSchema(BaseModel):
    car_id: int
    start_date: datetime
    end_date: datetime
    pickup_address: str = Field(min_length=1, max_length=255)
    return_address: str = Field(min_length=1, max_length=255)
    
    @field_validator("end_date")
    @classmethod
    def validate_dates(cls, end_date, info):
        start_date = info.data.get("start_date")
        if start_date and end_date <= start_date:
            raise ValueError("end_date must be after start_date")
        return end_date


class RentalUpdateSchema(BaseModel):
    returned_at: datetime | None = Field(None)
    return_location_id: int | None = Field(None)
    status: RentalStatus | None = None


class RentalResponseSchema(BaseModel):
    id: int
    user_id: int
    car_id: int
    start_date: datetime
    end_date: datetime
    created_at: datetime
    returned_at: datetime | None = None
    price_per_day: float
    price_sum: float
    status: RentalStatus
    pickup_location_id: int
    return_location_id: int

    model_config = ConfigDict(from_attributes=True)
