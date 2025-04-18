from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Base MembershipPlan Schema (shared properties)
class MembershipPlanBase(BaseModel):
    name: str
    description: str
    price: float
    duration_days: int
    is_active: bool = True

# Schema for creating a new membership plan
class MembershipPlanCreate(MembershipPlanBase):
    pass

# Schema for updating a membership plan
class MembershipPlanUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    duration_days: Optional[int] = None
    is_active: Optional[bool] = None

# Schema for membership plan in DB (response schema)
class MembershipPlan(MembershipPlanBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {
        "from_attributes": True
    }

# Base Subscription Schema (shared properties)
class SubscriptionBase(BaseModel):
    user_id: int
    plan_id: int
    start_date: datetime
    end_date: datetime
    is_active: bool = True

# Schema for creating a new subscription
class SubscriptionCreate(BaseModel):
    plan_id: int

# Schema for updating a subscription
class SubscriptionUpdate(BaseModel):
    plan_id: Optional[int] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_active: Optional[bool] = None

# Schema for subscription in DB (response schema)
class Subscription(SubscriptionBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    plan: MembershipPlan

    model_config = {
        "from_attributes": True
    } 