from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Float,DECIMAL, TIMESTAMP, Boolean, CheckConstraint, Index, func, UniqueConstraint
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum

from core.database import Base


class CarStatus(PyEnum):
    AVAILABLE = "AVAILABLE"
    RENTED = "RENTED"
    SERVICE = "SERVICE"


class Brand(Base):
    __tablename__ = "brands"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, unique=True)

    models = relationship("Model", back_populates="brand", cascade="all, delete-orphan")
    cars = relationship("Car", back_populates="brand")


class Model(Base):
    __tablename__ = "models"

    id = Column(Integer, primary_key=True)
    brand_id = Column(Integer, ForeignKey("brands.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)

    __table_args__ = (
        UniqueConstraint("brand_id", "name", name="uq_brand_model"),
    )

    brand = relationship("Brand", back_populates="models")
    cars = relationship("Car", back_populates="model")


class CarType(Base):
    __tablename__ = "car_types"

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False, unique=True)

    cars = relationship("Car", back_populates="car_type")


class FuelType(Base):
    __tablename__ = "fuel_types"

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False, unique=True)

    cars = relationship("Car", back_populates="fuel_type")


class GearboxType(Base):
    __tablename__ = "gearbox_types"

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False, unique=True)

    cars = relationship("Car", back_populates="gearbox_type")


class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True)

    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=False)
    model_id = Column(Integer, ForeignKey("models.id"), nullable=False)
    status = Column(Enum(CarStatus), nullable=False, default=CarStatus.AVAILABLE)
    car_type_id = Column(Integer, ForeignKey("car_types.id"), nullable=False)
    fuel_type_id = Column(Integer, ForeignKey("fuel_types.id"), nullable=False)
    gearbox_type_id = Column(Integer, ForeignKey("gearbox_types.id"), nullable=False)
    plate = Column(String(20), unique=True, nullable=False)
    seats = Column(Integer, nullable=False)
    doors = Column(Integer, nullable=False)
    color = Column(String(50), nullable=False)
    fuel_per_km = Column(Float, default=0.0)
    mileage = Column(Integer, nullable=False, default=0)
    year = Column(Integer, nullable=False)
    price_per_day = Column(DECIMAL(10, 2), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        CheckConstraint("seats > 0"),
        CheckConstraint("doors > 0"),
        CheckConstraint("price_per_day > 0"),
        CheckConstraint("mileage >= 0"),
        CheckConstraint("fuel_per_km >= 0"),
        CheckConstraint("year >= 1900"),

        Index("idx_car_brand", "brand_id"),
        Index("idx_car_model", "model_id"),
        Index("idx_car_status", "status"),
        Index("idx_car_price", "price_per_day"),
    )

    brand = relationship("Brand", back_populates="cars")
    model = relationship("Model", back_populates="cars")

    car_type = relationship("CarType", back_populates="cars")
    fuel_type = relationship("FuelType", back_populates="cars")
    gearbox_type = relationship("GearboxType", back_populates="cars")

    images = relationship("CarImage", back_populates="car", cascade="all, delete-orphan")
    tags = relationship("Tag", secondary="car_tags", back_populates="cars")
    service_history = relationship("CarServiceHistory", back_populates="car", cascade="all, delete-orphan")

    rentals = relationship(
        "Rental",
        back_populates="car",
        cascade="all, delete-orphan"
    )


class CarImage(Base):
    __tablename__ = "cars_image"

    id = Column(Integer, primary_key=True)
    car_id = Column(Integer, ForeignKey("cars.id", ondelete="CASCADE"), nullable=False)
    image_url = Column(String(500), nullable=False)
    is_primary = Column(Boolean, default=False)

    car = relationship("Car", back_populates="images")


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False, unique=True)

    cars = relationship("Car", secondary="car_tags", back_populates="tags")


class CarTag(Base):
    __tablename__ = "car_tags"

    car_id = Column(Integer, ForeignKey("cars.id", ondelete="CASCADE"), primary_key=True)
    tag_id = Column(Integer, ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True)


class CarServiceHistory(Base):
    __tablename__ = "car_service_history"

    id = Column(Integer, primary_key=True)
    car_id = Column(Integer, ForeignKey("cars.id", ondelete="CASCADE"), nullable=False)
    description = Column(String(255))
    service_date = Column(TIMESTAMP, nullable=False)
    mileage = Column(Integer)

    car = relationship("Car", back_populates="service_history")