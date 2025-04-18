from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# Base User Schema (shared properties)
class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    role: str = "member"
    is_active: bool = True

# Schema for creating a new user
class UserCreate(UserBase):
    password: str
    confirm_password: str

# Schema for updating a user
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None
    role: Optional[str] = None

# Schema for password change
class PasswordChange(BaseModel):
    old_password: str
    new_password: str
    confirm_password: str

# Schema for user in DB (response schema)
class User(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {
        "from_attributes": True
    }

# Schema for login
class UserLogin(BaseModel):
    username: str
    password: str

# Schema for token response
class Token(BaseModel):
    access_token: str
    token_type: str
    
# Schema for token data
class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None 