from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from contextlib import asynccontextmanager

from core.database import init_db
from api import auth, users, cars, cars_details, cars_filters

from models.users import *
from models.cars import *
from models.rentals import *
from models.payments import *


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(users.router)
app.include_router(cars.router)
app.include_router(cars_details.router)
app.include_router(cars_filters.router)

@app.get("/")
def read_root():
    return {"status": "ok"}
