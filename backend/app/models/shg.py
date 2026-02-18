"""
SHG (Self Help Group) model for community information
"""
from sqlalchemy import Column, String, Text, Integer, Boolean, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base


class SHG(Base):
    __tablename__ = "shgs"

    # Primary key as auto-increment integer
    _id = Column(Integer, primary_key=True, autoincrement=True)
    id = Column(String, unique=True, index=True, nullable=False)  # Format: SHG001
    
    name = Column(String(100), nullable=False, index=True)
    contact_person = Column(String(100), nullable=False)  # Contact person name
    mobile_number = Column(String(20), nullable=False)  # Contact mobile number
    
    # Location hierarchy (required)
    state = Column(String(100), nullable=False, index=True)
    district = Column(String(100), nullable=False, index=True)
    mandal = Column(String(100), nullable=False, index=True)
    village = Column(String(100), nullable=False, index=True)
    
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)  # S3 URL
    
    # Status and audit fields
    is_active = Column(Boolean, default=True, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    created_by = Column(String, nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    updated_by = Column(String, nullable=True)
    
    # Soft delete fields
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    deleted_by = Column(String, nullable=True)
    
    # Relationships
    products = relationship("Product", back_populates="shg")
    vendors = relationship("Vendor", back_populates="shg")
