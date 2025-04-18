from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Base Attendance Schema (shared properties)
class AttendanceBase(BaseModel):
    user_id: int
    check_in_time: datetime = datetime.now()
    check_in_method: str = "manual"
    checked_in_by: Optional[int] = None

# Schema for creating a new attendance record
class AttendanceCreate(AttendanceBase):
    pass

# Schema for updating an attendance record
class AttendanceUpdate(BaseModel):
    check_out_time: Optional[datetime] = None

# Schema for attendance in DB (response schema)
class Attendance(AttendanceBase):
    id: int
    check_out_time: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {
        "from_attributes": True
    } 