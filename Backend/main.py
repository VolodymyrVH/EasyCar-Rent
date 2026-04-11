from fastapi import FastAPI

from core.database import engine, Base

from models.users import *
from models.cars import *
from models.rentals import *
from models.payments import *


app = FastAPI()


Base.metadata.create_all(bind=engine)


@app.get("/")
def read_root():
    return {"status": "ok"}