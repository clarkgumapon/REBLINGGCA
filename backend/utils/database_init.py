"""
Database initialization script for Niel's Fitness Gym Management System
This script will create initial data for the application
"""

import sys
import os
import datetime
from pathlib import Path

# Add parent directory to sys.path
sys.path.append(str(Path(__file__).parent.parent.parent))

from backend.config.database import SessionLocal, engine, Base
from backend.models import User, Profile, MembershipPlan, Subscription, Payment, Attendance
from backend.utils.auth import get_password_hash

def init_db():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Check if we already have users (don't seed if data exists)
        existing_users = db.query(User).count()
        if existing_users > 0:
            print("Database already contains data. Skipping initialization.")
            return
        
        print("Initializing database with seed data...")
        
        # Create admin user
        admin_password = get_password_hash("admin123")
        admin = User(
            username="admin",
            email="admin@nielsfitness.com",
            password=admin_password,
            full_name="Admin User",
            role="admin",
            is_active=True
        )
        db.add(admin)
        
        # Create staff user
        staff_password = get_password_hash("staff123")
        staff = User(
            username="staff",
            email="staff@nielsfitness.com",
            password=staff_password,
            full_name="Staff User",
            role="staff",
            is_active=True
        )
        db.add(staff)
        
        # Create member user
        member_password = get_password_hash("member123")
        member = User(
            username="member",
            email="member@example.com",
            password=member_password,
            full_name="Test Member",
            role="member",
            is_active=True
        )
        db.add(member)
        
        # Commit users to get their IDs
        db.commit()
        
        # Create member profile
        profile = Profile(
            user_id=member.id,
            phone_number="09123456789",
            address="123 Test Address, City",
            date_of_birth=datetime.date(1990, 1, 15),
            gender="Male",
            height=175,
            weight=70,
            emergency_contact_name="Emergency Contact",
            emergency_contact_phone="09123456789"
        )
        db.add(profile)
        
        # Create membership plans
        monthly_plan = MembershipPlan(
            name="Monthly",
            description="Perfect for those just starting their fitness journey",
            price=500.0,
            duration_days=30,
            is_active=True
        )
        db.add(monthly_plan)
        
        quarterly_plan = MembershipPlan(
            name="Quarterly",
            description="Great value for committed fitness enthusiasts",
            price=1300.0,
            duration_days=90,
            is_active=True
        )
        db.add(quarterly_plan)
        
        annual_plan = MembershipPlan(
            name="Annual",
            description="Best value for dedicated fitness enthusiasts",
            price=5000.0,
            duration_days=365,
            is_active=True
        )
        db.add(annual_plan)
        
        # Commit plans to get their IDs
        db.commit()
        
        # Create subscription for the member
        start_date = datetime.datetime.now()
        end_date = start_date + datetime.timedelta(days=30)
        
        subscription = Subscription(
            user_id=member.id,
            plan_id=monthly_plan.id,
            start_date=start_date,
            end_date=end_date,
            is_active=True
        )
        db.add(subscription)
        
        # Commit subscription to get its ID
        db.commit()
        
        # Create payment for the subscription
        payment = Payment(
            user_id=member.id,
            subscription_id=subscription.id,
            amount=monthly_plan.price,
            payment_method="Cash",
            payment_date=start_date,
            is_verified=True,
            verified_by=staff.id,
            verification_date=start_date,
            reference_number="CASH-001"
        )
        db.add(payment)
        
        # Create attendance records
        check_in_time = datetime.datetime.now() - datetime.timedelta(days=1)
        check_out_time = check_in_time + datetime.timedelta(hours=2)
        
        attendance = Attendance(
            user_id=member.id,
            check_in_time=check_in_time,
            check_out_time=check_out_time,
            check_in_method="manual",
            checked_in_by=staff.id
        )
        db.add(attendance)
        
        # Commit all changes
        db.commit()
        
        print("Database initialized successfully!")
        
    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db() 