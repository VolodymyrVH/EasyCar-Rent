from fastapi import FastAPI
from contextlib import asynccontextmanager

from core.database import init_db

from models.users import *
from models.cars import *
from models.rentals import *
from models.payments import *


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(lifespan=lifespan)

@app.get("/")
def read_root():
    return {"status": "ok"}
