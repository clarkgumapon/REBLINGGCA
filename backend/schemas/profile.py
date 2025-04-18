from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

# Base Profile Schema (shared properties)
class ProfileBase(BaseModel):
    phone_number: str
    address: str
    date_of_birth: date
    gender: str
    height: Optional[int] = None  # in cm
    weight: Optional[int] = None  # in kg
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None

# Schema for creating a new profile
class ProfileCreate(ProfileBase):
    pass

# Schema for updating a profile
class ProfileUpdate(BaseModel):
    phone_number: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    height: Optional[int] = None
    weight: Optional[int] = None
    profile_picture: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None

# Schema for profile in DB (response schema)
class Profile(ProfileBase):
    id: int
    user_id: int
    profile_picture: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {
        "from_attributes": True
    } 