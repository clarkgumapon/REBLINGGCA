from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Optional, List
from datetime import datetime, timedelta

from ..models.membership import MembershipPlan, Subscription
from ..schemas.membership import MembershipPlanCreate, MembershipPlanUpdate, SubscriptionCreate, SubscriptionUpdate
from .user_controller import UserController

class MembershipController:
    # Membership Plan methods
    @staticmethod
    def create_membership_plan(db: Session, plan_create: MembershipPlanCreate):
        # Check if plan with same name already exists
        db_plan = db.query(MembershipPlan).filter(MembershipPlan.name == plan_create.name).first()
        if db_plan:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Membership plan with this name already exists",
            )
        
        # Create plan
        db_plan = MembershipPlan(
            name=plan_create.name,
            description=plan_create.description,
            price=plan_create.price,
            duration_days=plan_create.duration_days,
            is_active=plan_create.is_active
        )
        
        db.add(db_plan)
        db.commit()
        db.refresh(db_plan)
        
        return db_plan
    
    @staticmethod
    def get_membership_plan_by_id(db: Session, plan_id: int):
        db_plan = db.query(MembershipPlan).filter(MembershipPlan.id == plan_id).first()
        if not db_plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Membership plan not found",
            )
        return db_plan
    
    @staticmethod
    def get_membership_plans(db: Session, skip: int = 0, limit: int = 100, active_only: bool = False):
        query = db.query(MembershipPlan)
        
        if active_only:
            query = query.filter(MembershipPlan.is_active == True)
            
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def update_membership_plan(db: Session, plan_id: int, plan_update: MembershipPlanUpdate):
        db_plan = MembershipController.get_membership_plan_by_id(db, plan_id)
        
        # Check if name is being changed and if it already exists
        if plan_update.name is not None and plan_update.name != db_plan.name:
            existing_plan = db.query(MembershipPlan).filter(MembershipPlan.name == plan_update.name).first()
            if existing_plan:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Membership plan with this name already exists",
                )
        
        # Update plan data
        for key, value in plan_update.dict(exclude_unset=True).items():
            setattr(db_plan, key, value)
        
        db.commit()
        db.refresh(db_plan)
        
        return db_plan
    
    @staticmethod
    def delete_membership_plan(db: Session, plan_id: int):
        db_plan = MembershipController.get_membership_plan_by_id(db, plan_id)
        
        # Check if plan has any subscriptions
        subscriptions = db.query(Subscription).filter(Subscription.plan_id == plan_id).first()
        if subscriptions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete plan with active subscriptions",
            )
        
        db.delete(db_plan)
        db.commit()
        
        return {"detail": "Membership plan deleted successfully"}
    
    # Subscription methods
    @staticmethod
    def create_subscription(db: Session, user_id: int, subscription_create: SubscriptionCreate):
        # Check if user exists
        UserController.get_user_by_id(db, user_id)
        
        # Check if plan exists and is active
        db_plan = MembershipController.get_membership_plan_by_id(db, subscription_create.plan_id)
        if not db_plan.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Membership plan is not active",
            )
        
        # Check if user already has an active subscription
        db_active_subscription = db.query(Subscription).filter(
            Subscription.user_id == user_id,
            Subscription.is_active == True
        ).first()
        
        if db_active_subscription:
            # Deactivate the current subscription
            db_active_subscription.is_active = False
            db.commit()
        
        # Create new subscription
        start_date = datetime.now()
        end_date = start_date + timedelta(days=db_plan.duration_days)
        
        db_subscription = Subscription(
            user_id=user_id,
            plan_id=subscription_create.plan_id,
            start_date=start_date,
            end_date=end_date,
            is_active=True
        )
        
        db.add(db_subscription)
        db.commit()
        db.refresh(db_subscription)
        
        return db_subscription
    
    @staticmethod
    def get_subscription_by_id(db: Session, subscription_id: int):
        db_subscription = db.query(Subscription).filter(Subscription.id == subscription_id).first()
        if not db_subscription:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Subscription not found",
            )
        return db_subscription
    
    @staticmethod
    def get_user_subscriptions(db: Session, user_id: int, active_only: bool = False):
        # Check if user exists
        UserController.get_user_by_id(db, user_id)
        
        query = db.query(Subscription).filter(Subscription.user_id == user_id)
        
        if active_only:
            query = query.filter(Subscription.is_active == True)
            
        return query.all()
    
    @staticmethod
    def get_active_subscription(db: Session, user_id: int):
        # Check if user exists
        UserController.get_user_by_id(db, user_id)
        
        db_subscription = db.query(Subscription).filter(
            Subscription.user_id == user_id,
            Subscription.is_active == True
        ).first()
        
        if not db_subscription:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No active subscription found for this user",
            )
            
        return db_subscription
    
    @staticmethod
    def update_subscription(db: Session, subscription_id: int, subscription_update: SubscriptionUpdate):
        db_subscription = MembershipController.get_subscription_by_id(db, subscription_id)
        
        # If plan_id is being updated, check if new plan exists and is active
        if subscription_update.plan_id is not None and subscription_update.plan_id != db_subscription.plan_id:
            db_plan = MembershipController.get_membership_plan_by_id(db, subscription_update.plan_id)
            if not db_plan.is_active:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Membership plan is not active",
                )
        
        # Update subscription data
        for key, value in subscription_update.dict(exclude_unset=True).items():
            setattr(db_subscription, key, value)
        
        db.commit()
        db.refresh(db_subscription)
        
        return db_subscription
    
    @staticmethod
    def cancel_subscription(db: Session, subscription_id: int):
        db_subscription = MembershipController.get_subscription_by_id(db, subscription_id)
        
        # Cancel subscription
        db_subscription.is_active = False
        db.commit()
        
        return {"detail": "Subscription cancelled successfully"} 