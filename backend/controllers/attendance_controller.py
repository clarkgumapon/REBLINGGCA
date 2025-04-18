from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Optional, List
from datetime import datetime, date, timedelta

from ..models.attendance import Attendance
from ..schemas.attendance import AttendanceCreate, AttendanceUpdate
from .user_controller import UserController

class AttendanceController:
    @staticmethod
    def create_attendance(db: Session, attendance_create: AttendanceCreate):
        # Check if user exists
        UserController.get_user_by_id(db, attendance_create.user_id)
        
        # If staff is specified, check if staff exists
        if attendance_create.checked_in_by:
            UserController.get_user_by_id(db, attendance_create.checked_in_by)
        
        # Check if user already has an active attendance (no check-out time)
        active_attendance = db.query(Attendance).filter(
            Attendance.user_id == attendance_create.user_id,
            Attendance.check_out_time.is_(None)
        ).first()
        
        if active_attendance:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already has an active check-in",
            )
        
        # Create attendance record
        db_attendance = Attendance(
            user_id=attendance_create.user_id,
            check_in_time=attendance_create.check_in_time,
            check_in_method=attendance_create.check_in_method,
            checked_in_by=attendance_create.checked_in_by
        )
        
        db.add(db_attendance)
        db.commit()
        db.refresh(db_attendance)
        
        return db_attendance
    
    @staticmethod
    def get_attendance_by_id(db: Session, attendance_id: int):
        db_attendance = db.query(Attendance).filter(Attendance.id == attendance_id).first()
        if not db_attendance:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Attendance record not found",
            )
        return db_attendance
    
    @staticmethod
    def get_attendances(db: Session, skip: int = 0, limit: int = 100, date_from: Optional[date] = None, date_to: Optional[date] = None):
        query = db.query(Attendance)
        
        if date_from:
            date_from_dt = datetime.combine(date_from, datetime.min.time())
            query = query.filter(Attendance.check_in_time >= date_from_dt)
            
        if date_to:
            date_to_dt = datetime.combine(date_to, datetime.max.time())
            query = query.filter(Attendance.check_in_time <= date_to_dt)
            
        return query.order_by(Attendance.check_in_time.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_user_attendances(db: Session, user_id: int, skip: int = 0, limit: int = 100, date_from: Optional[date] = None, date_to: Optional[date] = None):
        # Check if user exists
        UserController.get_user_by_id(db, user_id)
        
        query = db.query(Attendance).filter(Attendance.user_id == user_id)
        
        if date_from:
            date_from_dt = datetime.combine(date_from, datetime.min.time())
            query = query.filter(Attendance.check_in_time >= date_from_dt)
            
        if date_to:
            date_to_dt = datetime.combine(date_to, datetime.max.time())
            query = query.filter(Attendance.check_in_time <= date_to_dt)
            
        return query.order_by(Attendance.check_in_time.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_active_attendance(db: Session, user_id: int):
        # Check if user exists
        UserController.get_user_by_id(db, user_id)
        
        # Get active attendance
        active_attendance = db.query(Attendance).filter(
            Attendance.user_id == user_id,
            Attendance.check_out_time.is_(None)
        ).first()
        
        if not active_attendance:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No active check-in found for this user",
            )
            
        return active_attendance
    
    @staticmethod
    def check_out_user(db: Session, user_id: int, attendance_update: AttendanceUpdate):
        # Get active attendance
        active_attendance = AttendanceController.get_active_attendance(db, user_id)
        
        # Update check-out time
        active_attendance.check_out_time = attendance_update.check_out_time or datetime.now()
        
        db.commit()
        db.refresh(active_attendance)
        
        return active_attendance
    
    @staticmethod
    def get_attendance_stats(db: Session, date_from: date = None, date_to: date = None):
        # Set default date range to past 30 days if not specified
        if not date_from:
            date_from = date.today() - timedelta(days=30)
        if not date_to:
            date_to = date.today()
            
        date_from_dt = datetime.combine(date_from, datetime.min.time())
        date_to_dt = datetime.combine(date_to, datetime.max.time())
        
        # Get total check-ins
        total_check_ins = db.query(Attendance).filter(
            Attendance.check_in_time >= date_from_dt,
            Attendance.check_in_time <= date_to_dt
        ).count()
        
        # Get unique users checked in
        unique_users = db.query(Attendance.user_id).filter(
            Attendance.check_in_time >= date_from_dt,
            Attendance.check_in_time <= date_to_dt
        ).distinct().count()
        
        # Get average time spent (for checked-out records)
        checked_out_records = db.query(Attendance).filter(
            Attendance.check_in_time >= date_from_dt,
            Attendance.check_in_time <= date_to_dt,
            Attendance.check_out_time.isnot(None)
        ).all()
        
        total_time = timedelta()
        for record in checked_out_records:
            time_spent = record.check_out_time - record.check_in_time
            total_time += time_spent
        
        avg_time_seconds = 0
        if checked_out_records:
            avg_time_seconds = total_time.total_seconds() / len(checked_out_records)
        
        return {
            "date_from": date_from,
            "date_to": date_to,
            "total_check_ins": total_check_ins,
            "unique_users": unique_users,
            "average_time_minutes": round(avg_time_seconds / 60, 2)
        } 