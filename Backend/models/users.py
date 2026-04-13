from sqlalchemy import Column, Integer, String, Enum, Date, TIMESTAMP, func, CheckConstraint, UniqueConstraint
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum

from core.database import Base


class UserRole(PyEnum):
    USER = "USER"
    ADMIN = "ADMIN"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    phone_number = Column(String(20), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.USER)
    license_series = Column(String(50), nullable=False)
    license_number = Column(String(50), nullable=False)
    dob = Column(Date, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        UniqueConstraint("license_series", "license_number", name="uq_license"),
        CheckConstraint("length(phone_number) >= 10", name="check_phone_length")
    )

    rentals = relationship(
        "Rental",
        back_populates="user",
        cascade="all, delete-orphan"
    )