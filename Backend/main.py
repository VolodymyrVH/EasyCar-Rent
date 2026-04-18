from fastapi import FastAPI
from contextlib import asynccontextmanager

from core.database import get_db
from api import auth, users

from models.users import *
from models.cars import *
from models.rentals import *
from models.payments import *


@asynccontextmanager
async def lifespan(app: FastAPI):
    get_db()
    yield

app = FastAPI(lifespan=lifespan)


app.include_router(auth.router)
app.include_router(users.router)

@app.get("/")
def read_root():
    return {"status": "ok"}
