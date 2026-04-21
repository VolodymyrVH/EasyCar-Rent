from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from schemas.cars import *
from models.cars import Car, CarStatus
from core.database import get_db


get_car_all
get_car_by_id
get_cars_by_brand
get_cars_by_status
get_cars_by_type   
create_car
update_car
update_car_status
delete_car