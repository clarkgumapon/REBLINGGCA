from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..config.database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    subscription_id = Column(Integer, ForeignKey("subscriptions.id"))
    amount = Column(Float)
    payment_method = Column(String)  # Cash, Credit Card, etc.
    payment_date = Column(DateTime)
    is_verified = Column(Boolean, default=False)
    verified_by = Column(Integer, ForeignKey("users.id"), nullable=True)  # Staff member who verified the payment
    verification_date = Column(DateTime, nullable=True)
    reference_number = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="payments", foreign_keys=[user_id])
    subscription = relationship("Subscription")
    verified_staff = relationship("User", foreign_keys=[verified_by]) 