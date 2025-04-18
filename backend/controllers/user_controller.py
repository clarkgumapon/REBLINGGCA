from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import datetime, timedelta
from typing import Optional, List

from ..models.user import User
from ..models.profile import Profile
from ..schemas.user import UserCreate, UserUpdate
from ..utils.auth import get_password_hash, verify_password, create_access_token

class UserController:
    @staticmethod
    def create_user(db: Session, user_create: UserCreate):
        # Check if username already exists
        db_username = db.query(User).filter(User.username == user_create.username).first()
        if db_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered",
            )
        
        # Check if email already exists
        db_email = db.query(User).filter(User.email == user_create.email).first()
        if db_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )
        
        # Check if passwords match
        if user_create.password != user_create.confirm_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Passwords do not match",
            )
        
        # Create user
        hashed_password = get_password_hash(user_create.password)
        db_user = User(
            username=user_create.username,
            email=user_create.email,
            password=hashed_password,
            full_name=user_create.full_name,
            role=user_create.role,
            is_active=user_create.is_active
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        return db_user
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: int):
        db_user = db.query(User).filter(User.id == user_id).first()
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        return db_user
    
    @staticmethod
    def get_user_by_username(db: Session, username: str):
        return db.query(User).filter(User.username == username).first()
    
    @staticmethod
    def get_user_by_email(db: Session, email: str):
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def get_users(db: Session, skip: int = 0, limit: int = 100, role: Optional[str] = None):
        query = db.query(User)
        
        if role:
            query = query.filter(User.role == role)
            
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def update_user(db: Session, user_id: int, user_update: UserUpdate):
        db_user = UserController.get_user_by_id(db, user_id)
        
        # Check if username is being changed and if it already exists
        if user_update.username is not None and user_update.username != db_user.username:
            db_username = db.query(User).filter(User.username == user_update.username).first()
            if db_username:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Username already registered",
                )
        
        # Check if email is being changed and if it already exists
        if user_update.email is not None and user_update.email != db_user.email:
            db_email = db.query(User).filter(User.email == user_update.email).first()
            if db_email:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered",
                )
        
        # Update user data
        for key, value in user_update.dict(exclude_unset=True).items():
            setattr(db_user, key, value)
        
        db.commit()
        db.refresh(db_user)
        
        return db_user
    
    @staticmethod
    def delete_user(db: Session, user_id: int):
        db_user = UserController.get_user_by_id(db, user_id)
        db.delete(db_user)
        db.commit()
        
        return {"detail": "User deleted successfully"}
    
    @staticmethod
    def change_password(db: Session, user_id: int, old_password: str, new_password: str, confirm_password: str):
        db_user = UserController.get_user_by_id(db, user_id)
        
        # Verify old password
        if not verify_password(old_password, db_user.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect password",
            )
        
        # Check if new passwords match
        if new_password != confirm_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Passwords do not match",
            )
        
        # Update password
        db_user.password = get_password_hash(new_password)
        db.commit()
        
        return {"detail": "Password changed successfully"}
    
    @staticmethod
    def authenticate_user(db: Session, username: str, password: str):
        user = UserController.get_user_by_username(db, username)
        if not user or not verify_password(password, user.password):
            return False
        return user
    
    @staticmethod
    def create_user_token(user: User, expires_delta: Optional[timedelta] = None):
        to_encode = {"sub": user.username, "role": user.role}
        token = create_access_token(to_encode, expires_delta)
        return token 