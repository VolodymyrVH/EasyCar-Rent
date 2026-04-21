from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from schemas.cars import *
from models.cars import Car, CarStatus
from core.database import get_db



get_cartype_all
get_cartype_by_id
created_cartype
update_cartype
delete_cartype

get_fueltype_all
get_fueltype_by_id
created_fueltype
update_fueltype
delete_fueltype

get_gearboxtype_all
get_gearboxtype_by_id
created_gearboxtype
update_gearboxtype
delete_gearboxtype


get_tag_all
get_tag_by_id
create_tag
update_tag
delete_tag