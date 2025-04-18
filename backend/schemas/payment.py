from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Base Payment Schema (shared properties)
class PaymentBase(BaseModel):
    user_id: int
    subscription_id: int
    amount: float
    payment_method: str
    payment_date: datetime = datetime.now()
    reference_number: Optional[str] = None

# Schema for creating a new payment
class PaymentCreate(PaymentBase):
    pass

# Schema for updating a payment
class PaymentUpdate(BaseModel):
    payment_method: Optional[str] = None
    payment_date: Optional[datetime] = None
    is_verified: Optional[bool] = None
    reference_number: Optional[str] = None

# Schema for verifying a payment
class PaymentVerify(BaseModel):
    is_verified: bool = True
    verified_by: int
    verification_date: datetime = datetime.now()

# Schema for payment in DB (response schema)
class Payment(PaymentBase):
    id: int
    is_verified: bool
    verified_by: Optional[int] = None
    verification_date: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {
        "from_attributes": True
    } 