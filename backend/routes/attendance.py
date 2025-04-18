from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Dict
from datetime import date

from ..config.database import get_db
from ..controllers.attendance_controller import AttendanceController
from ..schemas.attendance import Attendance as AttendanceSchema, AttendanceCreate, AttendanceUpdate
from ..utils.auth import get_current_user, get_current_active_user, get_admin_user, get_staff_user

router = APIRouter(
    prefix="/api/attendance",
    tags=["attendance"],
    responses={401: {"description": "Unauthorized"}},
)

# User attendance endpoints
@router.post("/check-in", response_model=AttendanceSchema)
async def check_in(current_user = Depends(get_current_active_user), db: Session = Depends(get_db)):
    attendance_create = AttendanceCreate(
        user_id=current_user.id,
        check_in_method="self"
    )
    return AttendanceController.create_attendance(db, attendance_create)

@router.post("/check-out", response_model=AttendanceSchema)
async def check_out(current_user = Depends(get_current_active_user), db: Session = Depends(get_db)):
    attendance_update = AttendanceUpdate()
    return AttendanceController.check_out_user(db, current_user.id, attendance_update)

@router.get("/me", response_model=List[AttendanceSchema])
async def read_my_attendance(skip: int = 0, limit: int = 100, date_from: Optional[date] = None, date_to: Optional[date] = None, current_user = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return AttendanceController.get_user_attendances(db, current_user.id, skip, limit, date_from, date_to)

@router.get("/me/active", response_model=AttendanceSchema)
async def read_my_active_attendance(current_user = Depends(get_current_active_user), db: Session = Depends(get_db)):
    try:
        return AttendanceController.get_active_attendance(db, current_user.id)
    except HTTPException as e:
        if e.status_code == 404:
            return None
        raise e

# Staff attendance endpoints
@router.get("/", response_model=List[AttendanceSchema])
async def read_attendance(skip: int = 0, limit: int = 100, date_from: Optional[date] = None, date_to: Optional[date] = None, current_user = Depends(get_staff_user), db: Session = Depends(get_db)):
    return AttendanceController.get_attendances(db, skip, limit, date_from, date_to)

@router.get("/stats", response_model=Dict)
async def get_attendance_stats(date_from: Optional[date] = None, date_to: Optional[date] = None, current_user = Depends(get_staff_user), db: Session = Depends(get_db)):
    return AttendanceController.get_attendance_stats(db, date_from, date_to)

@router.get("/{attendance_id}", response_model=AttendanceSchema)
async def read_attendance_by_id(attendance_id: int, current_user = Depends(get_staff_user), db: Session = Depends(get_db)):
    return AttendanceController.get_attendance_by_id(db, attendance_id)

@router.post("/users/{user_id}/check-in", response_model=AttendanceSchema)
async def staff_check_in_user(user_id: int, current_user = Depends(get_staff_user), db: Session = Depends(get_db)):
    attendance_create = AttendanceCreate(
        user_id=user_id,
        check_in_method="staff",
        checked_in_by=current_user.id
    )
    return AttendanceController.create_attendance(db, attendance_create)

@router.post("/users/{user_id}/check-out", response_model=AttendanceSchema)
async def staff_check_out_user(user_id: int, current_user = Depends(get_staff_user), db: Session = Depends(get_db)):
    attendance_update = AttendanceUpdate()
    return AttendanceController.check_out_user(db, user_id, attendance_update)

@router.get("/users/{user_id}", response_model=List[AttendanceSchema])
async def read_user_attendance(user_id: int, skip: int = 0, limit: int = 100, date_from: Optional[date] = None, date_to: Optional[date] = None, current_user = Depends(get_staff_user), db: Session = Depends(get_db)):
    return AttendanceController.get_user_attendances(db, user_id, skip, limit, date_from, date_to) 