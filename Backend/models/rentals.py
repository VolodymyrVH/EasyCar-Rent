from sqlalchemy import Column, Integer, DateTime, Numeric, Enum, ForeignKey, String, CheckConstraint, Index, func, UniqueConstraint
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum

from core.database import Base


class RentalStatus(PyEnum):
    PENDING = "PENDING"
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class Rental(Base):
    __tablename__ = "rentals"

    id = Column(Integer, primary_key=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    car_id = Column(Integer, ForeignKey("cars.id"), nullable=False, index=True)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    returned_at = Column(DateTime)
    price_per_day = Column(Numeric(10, 2), nullable=False)
    price_sum = Column(Numeric(10, 2), nullable=False)
    status = Column(Enum(RentalStatus), nullable=False, default=RentalStatus.PENDING)
    pickup_location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    return_location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)

    __table_args__ = (
        CheckConstraint("end_date > start_date", name="check_dates"),
        CheckConstraint("price_per_day > 0", name="check_price_per_day"),
        CheckConstraint("price_sum >= 0", name="check_price_sum"),

        Index("idx_rental_user", "user_id"),
        Index("idx_rental_car", "car_id"),
        Index("idx_rental_status", "status"),
    )

    user = relationship("User", back_populates="rentals")
    car = relationship("Car", back_populates="rentals")

    pickup_location = relationship("Location", foreign_keys=[pickup_location_id])
    return_location = relationship("Location", foreign_keys=[return_location_id])

    payments = relationship(
        "Payment",
        back_populates="rental",
        cascade="all, delete-orphan"
    )


class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True)
    address = Column(String(255), nullable=False)