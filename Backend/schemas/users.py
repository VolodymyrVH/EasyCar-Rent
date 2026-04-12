from datetime import date, datetime
from enum import Enum
from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator


class UserRole(str, Enum):
    USER = "USER"
    ADMIN = "ADMIN"


class UserCreateSchema(BaseModel):
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    email: EmailStr = Field(max_length=255)
    phone_number: str = Field(min_length=10, max_length=15)
    password: str = Field(min_length=8)
    license_series: str = Field(min_length=1, max_length=3)
    license_number: str = Field(min_length=1, max_length=6)
    dob: date

    @field_validator("dob")
    @classmethod
    def validate_dob(cls, v: date) -> date:
        today = date.today()
        if v >= today:
            raise ValueError("Date of birth must be in the past")
        
        age = today.year - v.year - ((today.month, today.day) < (v.month, v.day))
        if age < 18:
            raise ValueError("User must be at least 18 years old")
        return v


class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)


class UserUpdateSchema(BaseModel):
    first_name: str | None = Field(None, min_length=1, max_length=100)
    last_name: str | None = Field(None, min_length=1, max_length=100)
    email: EmailStr | None = Field(None, max_length=255)
    phone_number: str | None = Field(None, min_length=10, max_length=15)
    password: str | None = Field(None, min_length=8)
    license_series: str | None = Field(None, min_length=1, max_length=3)
    license_number: str | None = Field(None, min_length=1, max_length=6)
    dob: date | None = None


class UserResponseSchema(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: str
    role: UserRole
    license_series: str
    license_number: str
    dob: date
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)