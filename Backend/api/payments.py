import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from schemas.payments import *
from models.payments import Payment, PaymentMethod, PaymentStatus as ModelPaymentStatus
from models.rentals import Rental
from models.users import User, UserRole
from core.database import get_db
from api.auth import get_current_user

router = APIRouter(prefix="/payments", tags=["payments"])


@router.get("/methods", response_model=list[PaymentMethodResponseSchema])
def get_payment_methods(db: Session = Depends(get_db)):
    return db.query(PaymentMethod).all()


@router.post("/methods", response_model=PaymentMethodResponseSchema, status_code=201)
def create_payment_method(data: PaymentMethodCreateSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    existing = db.query(PaymentMethod).filter(PaymentMethod.name == data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Payment method already exists")

    method = PaymentMethod(**data.model_dump())
    db.add(method)
    db.commit()
    db.refresh(method)
    return method


@router.patch("/methods/{method_id}", response_model=PaymentMethodResponseSchema)
def update_payment_method(method_id: int, data: PaymentMethodUpdateSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    method = db.query(PaymentMethod).filter(PaymentMethod.id == method_id).first()
    if not method:
        raise HTTPException(status_code=404, detail="Payment method not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(method, field, value)

    db.commit()
    db.refresh(method)
    return method


@router.delete("/methods/{method_id}", status_code=204)
def delete_payment_method(method_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    method = db.query(PaymentMethod).filter(PaymentMethod.id == method_id).first()
    if not method:
        raise HTTPException(status_code=404, detail="Payment method not found")

    db.delete(method)
    db.commit()


@router.get("/", response_model=list[PaymentResponseSchema])
def get_all_payments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return db.query(Payment).offset(skip).limit(limit).all()


@router.get("/rental/{rental_id}", response_model=list[PaymentResponseSchema])
def get_payments_by_rental(rental_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rental = db.query(Rental).filter(Rental.id == rental_id).first()
    if not rental:
        raise HTTPException(status_code=404, detail="Rental not found")
    
    if current_user.role != UserRole.ADMIN and rental.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return db.query(Payment).filter(Payment.rental_id == rental_id).all()


@router.get("/{payment_id}", response_model=PaymentResponseSchema)
def get_payment_by_id(payment_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    rental = db.query(Rental).filter(Rental.id == payment.rental_id).first()
    if current_user.role != UserRole.ADMIN and rental.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return payment


@router.post("/", response_model=PaymentResponseSchema, status_code=201)
def create_payment(data: PaymentCreateSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rental = db.query(Rental).filter(Rental.id == data.rental_id).first()
    if not rental:
        raise HTTPException(status_code=404, detail="Rental not found")
    
    if current_user.role != UserRole.ADMIN and rental.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    method = db.query(PaymentMethod).filter(PaymentMethod.id == data.payment_method_id).first()
    if not method:
        raise HTTPException(status_code=404, detail="Payment method not found")

    payment = Payment(
        rental_id=data.rental_id,
        transaction_id=str(uuid.uuid4()),
        payment_type=data.payment_type,
        payment_method_id=data.payment_method_id,
        amount=data.amount,
        payment_status=ModelPaymentStatus.PENDING,
        paid_at=None
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment


@router.patch("/{payment_id}/status", response_model=PaymentResponseSchema)
def update_payment_status(payment_id: int, data: PaymentStatusUpdateSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    payment.payment_status = data.payment_status

    if data.payment_status == ModelPaymentStatus.COMPLETED:
        payment.paid_at = datetime.now()

    db.commit()
    db.refresh(payment)
    return payment