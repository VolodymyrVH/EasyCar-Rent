from sqlalchemy import Column, Integer, String, ForeignKey, Float, Boolean, Text, DECIMAL, Enum, TIMESTAMP
from sqlalchemy.orm import relationship, declarative_base
from enum import Enum as PyEnum

Base = declarative_base()

class CarStatus(PyEnum):
    AVAILABLE = "AVAILABLE"
    RENTED = "RENTED"
    SERVICE = "SERVICE"


class Brand(Base):
    __tablename__ = "brands"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)

    models = relationship("Model", back_populates="brand")
    cars = relationship("Car", back_populates="brand")


class Model(Base):
    __tablename__ = "models"

    id = Column(Integer, primary_key=True)
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=False)
    name = Column(String(100), nullable=False, unique=True)

    brand = relationship("Brand", back_populates="models")
    cars = relationship("Car", back_populates="model")


class CarType(Base):
    __tablename__ = "car_types"

    id = Column(Integer, primary_key=True)
    name = Column(String)

    cars = relationship("Car", back_populates="type_rel")


class FuelType(Base):
    __tablename__ = "fuel_types"

    id = Column(Integer, primary_key=True)
    name = Column(String)

    cars = relationship("Car", back_populates="fuel_rel")


class GearboxType(Base):
    __tablename__ = "gearbox_types"

    id = Column(Integer, primary_key=True)
    name = Column(String)

    cars = relationship("Car", back_populates="gearbox_rel")


class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True)
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=False)
    model_id = Column(Integer, ForeignKey("models.id"), nullable=False)
    status = Column(Enum(CarStatus), nullable=False, default=CarStatus.AVAILABLE)
    type = Column(Integer, ForeignKey("car_types.id"), nullable=False)
    plate = Column(String(30), unique=True, nullable=False)
    seats = Column(Integer, nullable=False)
    doors = Column(Integer, nullable=False)
    color = Column(String, nullable=False)
    fuel = Column(Integer, ForeignKey("fuel_types.id"), nullable=False)
    fuel_pro_km = Column(Float)
    gearbox = Column(Integer, ForeignKey("gearbox_types.id"), nullable=False)
    mileage = Column(Integer, nullable=False, default=0)
    year = Column(Integer, nullable=False)
    price_per_day = Column(DECIMAL(10, 2), nullable=False)

    brand = relationship("Brand", back_populates="cars")
    model = relationship("Model", back_populates="cars")

    type_rel = relationship("CarType", back_populates="cars")
    fuel_rel = relationship("FuelType", back_populates="cars")
    gearbox_rel = relationship("GearboxType", back_populates="cars")

    images = relationship("CarImage", back_populates="car")
    tags = relationship("CarTag", back_populates="car")
    service_history = relationship("CarServiceHistory", back_populates="car")


class CarImage(Base):
    __tablename__ = "cars_image"

    id = Column(Integer, primary_key=True)
    car_id = Column(Integer, ForeignKey("cars.id"), nullable=False)
    image_url = Column(String(500), nullable=False)
    is_primary = Column(Boolean)

    car = relationship("Car", back_populates="images")


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)

    cars = relationship("CarTag", back_populates="tag")


class CarTag(Base):
    __tablename__ = "car_tags"

    car_id = Column(Integer, ForeignKey("cars.id"), primary_key=True)
    tag_id = Column(Integer, ForeignKey("tags.id"), primary_key=True)

    car = relationship("Car", back_populates="tags")
    tag = relationship("Tag", back_populates="cars")


class CarServiceHistory(Base):
    __tablename__ = "car_service_history"

    id = Column(Integer, primary_key=True)
    car_id = Column(Integer, ForeignKey("cars.id"), nullable=False)
    description = Column(Text)
    service_date = Column(TIMESTAMP, nullable=False)
    mileage = Column(Integer)

    car = relationship("Car", back_populates="service_history")