from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..config.database import get_db
from ..controllers.membership_controller import MembershipController
from ..schemas.membership import (
    MembershipPlan as MembershipPlanSchema,
    MembershipPlanCreate,
    MembershipPlanUpdate,
    Subscription as SubscriptionSchema,
    SubscriptionCreate,
    SubscriptionUpdate
)
from ..utils.auth import get_current_user, get_current_active_user, get_admin_user, get_staff_user

router = APIRouter(
    prefix="/api/memberships",
    tags=["memberships"],
    responses={401: {"description": "Unauthorized"}},
)

# Membership Plan endpoints
@router.get("/plans", response_model=List[MembershipPlanSchema])
async def read_membership_plans(skip: int = 0, limit: int = 100, active_only: bool = False, db: Session = Depends(get_db)):
    # Public endpoint to see membership plans
    return MembershipController.get_membership_plans(db, skip, limit, active_only)

@router.get("/plans/{plan_id}", response_model=MembershipPlanSchema)
async def read_membership_plan(plan_id: int, db: Session = Depends(get_db)):
    # Public endpoint to see a specific membership plan
    return MembershipController.get_membership_plan_by_id(db, plan_id)

@router.post("/plans", response_model=MembershipPlanSchema)
async def create_membership_plan(plan_create: MembershipPlanCreate, current_user = Depends(get_admin_user), db: Session = Depends(get_db)):
    return MembershipController.create_membership_plan(db, plan_create)

@router.put("/plans/{plan_id}", response_model=MembershipPlanSchema)
async def update_membership_plan(plan_id: int, plan_update: MembershipPlanUpdate, current_user = Depends(get_admin_user), db: Session = Depends(get_db)):
    return MembershipController.update_membership_plan(db, plan_id, plan_update)

@router.delete("/plans/{plan_id}")
async def delete_membership_plan(plan_id: int, current_user = Depends(get_admin_user), db: Session = Depends(get_db)):
    return MembershipController.delete_membership_plan(db, plan_id)

# Subscription endpoints
@router.get("/subscriptions", response_model=List[SubscriptionSchema])
async def read_my_subscriptions(active_only: bool = False, current_user = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return MembershipController.get_user_subscriptions(db, current_user.id, active_only)

@router.get("/subscriptions/active", response_model=SubscriptionSchema)
async def read_my_active_subscription(current_user = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return MembershipController.get_active_subscription(db, current_user.id)

@router.post("/subscriptions", response_model=SubscriptionSchema)
async def create_subscription(subscription_create: SubscriptionCreate, current_user = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return MembershipController.create_subscription(db, current_user.id, subscription_create)

@router.put("/subscriptions/{subscription_id}", response_model=SubscriptionSchema)
async def update_subscription(subscription_id: int, subscription_update: SubscriptionUpdate, current_user = Depends(get_staff_user), db: Session = Depends(get_db)):
    return MembershipController.update_subscription(db, subscription_id, subscription_update)

@router.post("/subscriptions/{subscription_id}/cancel")
async def cancel_subscription(subscription_id: int, current_user = Depends(get_staff_user), db: Session = Depends(get_db)):
    return MembershipController.cancel_subscription(db, subscription_id)

# Admin/Staff endpoints for user subscriptions
@router.get("/users/{user_id}/subscriptions", response_model=List[SubscriptionSchema])
async def read_user_subscriptions(user_id: int, active_only: bool = False, current_user = Depends(get_staff_user), db: Session = Depends(get_db)):
    return MembershipController.get_user_subscriptions(db, user_id, active_only)

@router.get("/users/{user_id}/subscriptions/active", response_model=SubscriptionSchema)
async def read_user_active_subscription(user_id: int, current_user = Depends(get_staff_user), db: Session = Depends(get_db)):
    return MembershipController.get_active_subscription(db, user_id)

@router.post("/users/{user_id}/subscriptions", response_model=SubscriptionSchema)
async def create_user_subscription(user_id: int, subscription_create: SubscriptionCreate, current_user = Depends(get_staff_user), db: Session = Depends(get_db)):
    return MembershipController.create_subscription(db, user_id, subscription_create) 