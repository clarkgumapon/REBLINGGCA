from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Optional, List
from datetime import datetime

from ..models.payment import Payment
from ..schemas.payment import PaymentCreate, PaymentUpdate, PaymentVerify
from .user_controller import UserController
from .membership_controller import MembershipController

class PaymentController:
    @staticmethod
    def create_payment(db: Session, payment_create: PaymentCreate):
        # Check if user exists
        UserController.get_user_by_id(db, payment_create.user_id)
        
        # Check if subscription exists
        MembershipController.get_subscription_by_id(db, payment_create.subscription_id)
        
        # Create payment
        db_payment = Payment(
            user_id=payment_create.user_id,
            subscription_id=payment_create.subscription_id,
            amount=payment_create.amount,
            payment_method=payment_create.payment_method,
            payment_date=payment_create.payment_date,
            reference_number=payment_create.reference_number,
            is_verified=False
        )
        
        db.add(db_payment)
        db.commit()
        db.refresh(db_payment)
        
        return db_payment
    
    @staticmethod
    def get_payment_by_id(db: Session, payment_id: int):
        db_payment = db.query(Payment).filter(Payment.id == payment_id).first()
        if not db_payment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found",
            )
        return db_payment
    
    @staticmethod
    def get_payments(db: Session, skip: int = 0, limit: int = 100, verified: Optional[bool] = None):
        query = db.query(Payment)
        
        if verified is not None:
            query = query.filter(Payment.is_verified == verified)
            
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def get_user_payments(db: Session, user_id: int, verified: Optional[bool] = None):
        # Check if user exists
        UserController.get_user_by_id(db, user_id)
        
        query = db.query(Payment).filter(Payment.user_id == user_id)
        
        if verified is not None:
            query = query.filter(Payment.is_verified == verified)
            
        return query.all()
    
    @staticmethod
    def update_payment(db: Session, payment_id: int, payment_update: PaymentUpdate):
        db_payment = PaymentController.get_payment_by_id(db, payment_id)
        
        # Update payment data
        for key, value in payment_update.dict(exclude_unset=True).items():
            setattr(db_payment, key, value)
        
        db.commit()
        db.refresh(db_payment)
        
        return db_payment
    
    @staticmethod
    def verify_payment(db: Session, payment_id: int, payment_verify: PaymentVerify):
        db_payment = PaymentController.get_payment_by_id(db, payment_id)
        
        # Check if payment is already verified
        if db_payment.is_verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Payment is already verified",
            )
        
        # Check if staff exists
        UserController.get_user_by_id(db, payment_verify.verified_by)
        
        # Verify payment
        db_payment.is_verified = payment_verify.is_verified
        db_payment.verified_by = payment_verify.verified_by
        db_payment.verification_date = payment_verify.verification_date
        
        db.commit()
        db.refresh(db_payment)
        
        return db_payment
    
    @staticmethod
    def delete_payment(db: Session, payment_id: int):
        db_payment = PaymentController.get_payment_by_id(db, payment_id)
        
        # Check if payment is verified
        if db_payment.is_verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete verified payment",
            )
        
        db.delete(db_payment)
        db.commit()
        
        return {"detail": "Payment deleted successfully"} 