from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from schemas.users import UserCreateSchema, UserUpdateSchema, UserResponseSchema
from models.users import User, UserRole
from core.database import get_db

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/{user_id}", response_model=UserResponseSchema)
def get_by_id(user_id: int, db: Session = Depends(get_db)):
    user_db = db.query(User).filter(User.id == user_id).first()
    if not user_db:
        raise HTTPException(status_code=404, detail="User not found")
    return user_db


@router.get("/email/{email}", response_model=UserResponseSchema)
def get_by_email(email: str, db: Session = Depends(get_db)):
    user_db = db.query(User).filter(User.email == email).first()
    if not user_db:
        raise HTTPException(status_code=404, detail="User not found")
    return user_db


@router.get("/phone/{phone}", response_model=UserResponseSchema)
def get_by_phone(phone_number: str, db: Session = Depends(get_db)):
    user_db = db.query(User).filter(User.phone_number == phone_number).first()
    if not user_db:
        raise HTTPException(status_code=404, detail="User not found")
    return user_db


@router.get("/", response_model=list[UserResponseSchema])
def get_all(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(User).offset(skip).limit(limit).all()


@router.post("/", response_model=UserResponseSchema)
def create_user(user: UserCreateSchema, db: Session = Depends(get_db)):
    existing = db.query(User).filter((User.email == user.email) | (User.phone_number == user.phone_number)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email or phone number already registered")
    
    #hash_password remove 
    user_db = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        phone_number=user.phone_number,
        password_hash=user.password,
        license_series=user.license_series,
        license_number=user.license_number,
        dob=user.dob
    )

    db.add(user_db)
    db.commit()
    db.refresh(user_db)

    return user_db


def update_user

#make crud for current user
@router.delete("/{user_id}", status_code=204)
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this user")
    
    user_db = db.query(User).filter(User.id == user_id).first()
    if not user_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user_db)
    db.commit()
    return {"detail": "User deleted successfully"}