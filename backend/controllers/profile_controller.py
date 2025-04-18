from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Optional

from ..models.profile import Profile
from ..models.user import User
from ..schemas.profile import ProfileCreate, ProfileUpdate
from .user_controller import UserController

class ProfileController:
    @staticmethod
    def create_profile(db: Session, user_id: int, profile_create: ProfileCreate):
        # Check if user exists
        UserController.get_user_by_id(db, user_id)
        
        # Check if user already has a profile
        db_profile = db.query(Profile).filter(Profile.user_id == user_id).first()
        if db_profile:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already has a profile",
            )
        
        # Create profile
        db_profile = Profile(
            user_id=user_id,
            phone_number=profile_create.phone_number,
            address=profile_create.address,
            date_of_birth=profile_create.date_of_birth,
            gender=profile_create.gender,
            height=profile_create.height,
            weight=profile_create.weight,
            emergency_contact_name=profile_create.emergency_contact_name,
            emergency_contact_phone=profile_create.emergency_contact_phone
        )
        
        db.add(db_profile)
        db.commit()
        db.refresh(db_profile)
        
        return db_profile
    
    @staticmethod
    def get_profile_by_id(db: Session, profile_id: int):
        db_profile = db.query(Profile).filter(Profile.id == profile_id).first()
        if not db_profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found",
            )
        return db_profile
    
    @staticmethod
    def get_profile_by_user_id(db: Session, user_id: int):
        # Check if user exists
        UserController.get_user_by_id(db, user_id)
        
        db_profile = db.query(Profile).filter(Profile.user_id == user_id).first()
        if not db_profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found for this user",
            )
        return db_profile
    
    @staticmethod
    def update_profile(db: Session, user_id: int, profile_update: ProfileUpdate):
        # Get profile
        db_profile = ProfileController.get_profile_by_user_id(db, user_id)
        
        # Update profile data
        for key, value in profile_update.dict(exclude_unset=True).items():
            setattr(db_profile, key, value)
        
        db.commit()
        db.refresh(db_profile)
        
        return db_profile
    
    @staticmethod
    def delete_profile(db: Session, profile_id: int):
        db_profile = ProfileController.get_profile_by_id(db, profile_id)
        db.delete(db_profile)
        db.commit()
        
        return {"detail": "Profile deleted successfully"}
    
    @staticmethod
    def update_profile_picture(db: Session, user_id: int, picture_url: str):
        # Get profile
        db_profile = ProfileController.get_profile_by_user_id(db, user_id)
        
        # Update profile picture
        db_profile.profile_picture = picture_url
        db.commit()
        
        return {"detail": "Profile picture updated successfully"} 