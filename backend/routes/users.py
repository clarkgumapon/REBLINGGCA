from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..config.database import get_db
from ..controllers.user_controller import UserController
from ..controllers.profile_controller import ProfileController
from ..schemas.user import User as UserSchema, UserUpdate, PasswordChange
from ..schemas.profile import Profile as ProfileSchema, ProfileCreate, ProfileUpdate
from ..utils.auth import get_current_user, get_current_active_user, get_admin_user, get_staff_user

router = APIRouter(
    prefix="/api/users",
    tags=["users"],
    responses={401: {"description": "Unauthorized"}},
)

# Current user endpoints
@router.get("/me", response_model=UserSchema)
async def read_users_me(current_user = Depends(get_current_active_user)):
    return current_user

@router.put("/me", response_model=UserSchema)
async def update_users_me(user_update: UserUpdate, current_user = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return UserController.update_user(db, current_user.id, user_update)

@router.post("/me/change-password")
async def change_password(password_data: PasswordChange, current_user = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return UserController.change_password(
        db, 
        current_user.id, 
        password_data.old_password, 
        password_data.new_password, 
        password_data.confirm_password
    )

# User profile endpoints
@router.get("/me/profile", response_model=ProfileSchema)
async def read_users_me_profile(current_user = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return ProfileController.get_profile_by_user_id(db, current_user.id)

@router.post("/me/profile", response_model=ProfileSchema)
async def create_users_me_profile(profile_create: ProfileCreate, current_user = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return ProfileController.create_profile(db, current_user.id, profile_create)

@router.put("/me/profile", response_model=ProfileSchema)
async def update_users_me_profile(profile_update: ProfileUpdate, current_user = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return ProfileController.update_profile(db, current_user.id, profile_update)

# Admin-only endpoints
@router.get("/", response_model=List[UserSchema])
async def read_users(skip: int = 0, limit: int = 100, role: str = None, current_user = Depends(get_admin_user), db: Session = Depends(get_db)):
    return UserController.get_users(db, skip, limit, role)

@router.get("/{user_id}", response_model=UserSchema)
async def read_user(user_id: int, current_user = Depends(get_staff_user), db: Session = Depends(get_db)):
    return UserController.get_user_by_id(db, user_id)

@router.put("/{user_id}", response_model=UserSchema)
async def update_user(user_id: int, user_update: UserUpdate, current_user = Depends(get_admin_user), db: Session = Depends(get_db)):
    return UserController.update_user(db, user_id, user_update)

@router.delete("/{user_id}")
async def delete_user(user_id: int, current_user = Depends(get_admin_user), db: Session = Depends(get_db)):
    return UserController.delete_user(db, user_id)

# User profile admin endpoints
@router.get("/{user_id}/profile", response_model=ProfileSchema)
async def read_user_profile(user_id: int, current_user = Depends(get_staff_user), db: Session = Depends(get_db)):
    return ProfileController.get_profile_by_user_id(db, user_id)

@router.post("/{user_id}/profile", response_model=ProfileSchema)
async def create_user_profile(user_id: int, profile_create: ProfileCreate, current_user = Depends(get_staff_user), db: Session = Depends(get_db)):
    return ProfileController.create_profile(db, user_id, profile_create)

@router.put("/{user_id}/profile", response_model=ProfileSchema)
async def update_user_profile(user_id: int, profile_update: ProfileUpdate, current_user = Depends(get_staff_user), db: Session = Depends(get_db)):
    return ProfileController.update_profile(db, user_id, profile_update) 