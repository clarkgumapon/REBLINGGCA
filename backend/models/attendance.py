from sqlalchemy import Column, Integer, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..config.database import Base

class Attendance(Base):
    __tablename__ = "attendances"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    check_in_time = Column(DateTime)
    check_out_time = Column(DateTime, nullable=True)
    check_in_method = Column(String, default="manual")  # manual, card, biometric, etc.
    checked_in_by = Column(Integer, ForeignKey("users.id"), nullable=True)  # Staff who checked in the member
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="attendances", foreign_keys=[user_id])
    staff = relationship("User", foreign_keys=[checked_in_by]) 