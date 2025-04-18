from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from ..config.database import get_db
from ..controllers.payment_controller import PaymentController
from ..schemas.payment import Payment as PaymentSchema, PaymentCreate, PaymentUpdate, PaymentVerify
from ..utils.auth import get_current_user, get_current_active_user, get_admin_user, get_staff_user

router = APIRouter(
    prefix="/api/payments",
    tags=["payments"],
    responses={401: {"description": "Unauthorized"}},
)

# User payment endpoints
@router.get("/me", response_model=List[PaymentSchema])
async def read_my_payments(verified: Optional[bool] = None, current_user = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return PaymentController.get_user_payments(db, current_user.id, verified)

@router.post("/", response_model=PaymentSchema)
async def create_payment(payment_create: PaymentCreate, current_user = Depends(get_current_active_user), db: Session = Depends(get_db)):
    # Override user_id with current user's id for security
    payment_create.user_id = current_user.id
    return PaymentController.create_payment(db, payment_create)

# Admin/Staff payment endpoints
@router.get("/", response_model=List[PaymentSchema])
async def read_payments(skip: int = 0, limit: int = 100, verified: Optional[bool] = None, current_user = Depends(get_staff_user), db: Session = Depends(get_db)):
    return PaymentController.get_payments(db, skip, limit, verified)

@router.get("/{payment_id}", response_model=PaymentSchema)
async def read_payment(payment_id: int, current_user = Depends(get_staff_user), db: Session = Depends(get_db)):
    return PaymentController.get_payment_by_id(db, payment_id)

@router.put("/{payment_id}", response_model=PaymentSchema)
async def update_payment(payment_id: int, payment_update: PaymentUpdate, current_user = Depends(get_staff_user), db: Session = Depends(get_db)):
    return PaymentController.update_payment(db, payment_id, payment_update)

@router.post("/{payment_id}/verify", response_model=PaymentSchema)
async def verify_payment(payment_id: int, payment_verify: PaymentVerify, current_user = Depends(get_staff_user), db: Session = Depends(get_db)):
    # Override verified_by with current user's id for security and audit
    payment_verify.verified_by = current_user.id
    return PaymentController.verify_payment(db, payment_id, payment_verify)

@router.delete("/{payment_id}")
async def delete_payment(payment_id: int, current_user = Depends(get_staff_user), db: Session = Depends(get_db)):
    return PaymentController.delete_payment(db, payment_id)

@router.get("/users/{user_id}", response_model=List[PaymentSchema])
async def read_user_payments(user_id: int, verified: Optional[bool] = None, current_user = Depends(get_staff_user), db: Session = Depends(get_db)):
    return PaymentController.get_user_payments(db, user_id, verified) 