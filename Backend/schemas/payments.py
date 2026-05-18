from datetime import date, datetime
from pydantic import BaseModel, Field, ConfigDict, field_validator
from enum import Enum



class PaymentType(str, Enum):
    PAYMENT = "PAYMENT"
    REFUND = "REFUND"


class PaymentStatus(str, Enum):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class PaymentMethodCreateSchema(BaseModel):
    name: str = Field(min_length=1, max_length=100)


class PaymentMethodUpdateSchema(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)


class PaymentMethodResponseSchema(BaseModel):
    id: int
    name: str 

    model_config = ConfigDict(from_attributes=True)


class PaymentCreateSchema(BaseModel):
    rental_id: int
    payment_type: PaymentType
    payment_method_id: int
    amount: float = Field(gt=0)


class PaymentStatusUpdateSchema(BaseModel):
    payment_status: PaymentStatus


class PaymentResponseSchema(BaseModel):
    id: int
    rental_id: int
    transaction_id: str
    payment_type: PaymentType
    amount: float
    payment_method_id: int
    payment_status: PaymentStatus
    paid_at: datetime | None = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)