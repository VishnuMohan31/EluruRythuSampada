"""
Inquiry model for buyer-vendor communication
"""
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base
import enum


class InquiryStatus(str, enum.Enum):
    PENDING = "pending"
    RESPONDED = "responded"
    CLOSED = "closed"


class Inquiry(Base):
    __tablename__ = "inquiries"

    id = Column(String, primary_key=True, index=True)
    product_id = Column(String, ForeignKey("products.id"))
    buyer_name = Column(String, nullable=False)
    buyer_email = Column(String, nullable=False)
    buyer_phone = Column(String)
    message = Column(Text, nullable=False)
    status = Column(Enum(InquiryStatus), default=InquiryStatus.PENDING)
    admin_notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    product = relationship("Product", back_populates="inquiries")
