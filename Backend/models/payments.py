from sqlalchemy import Column, Integer, DateTime, Numeric, Enum, ForeignKey, String, func
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum

from core.database import Base


class PaymentType(PyEnum):
    PAYMENT = "PAYMENT"
    REFUND = "REFUND"


class PaymentStatus(PyEnum):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True)
    rental_id = Column(Integer, ForeignKey("rentals.id"), nullable=False, index=True)
    transaction_id = Column(String(255), nullable=False, unique=True, index=True)
    payment_type = Column(Enum(PaymentType), nullable=False, default=PaymentType.PAYMENT)
    amount = Column(Numeric(10, 2), nullable=False)
    payment_method_id = Column(Integer, ForeignKey("payment_methods.id"), nullable=False, index=True)
    payment_status = Column(Enum(PaymentStatus), nullable=False, default=PaymentStatus.PENDING)
    paid_at = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())

    rental = relationship("Rental", back_populates="payments")
    payment_method = relationship("PaymentMethod", back_populates="payments")


class PaymentMethod(Base):
    __tablename__ = "payment_methods"

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False, unique=True, index=True)

    payments = relationship("Payment", back_populates="payment_method")
