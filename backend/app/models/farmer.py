"""
Farmer model for farmer information
"""
from sqlalchemy import Column, String, Text, Integer, Boolean, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base


class Farmer(Base):
    __tablename__ = "farmers"

    # Primary key with formatted ID (FARMER001)
    id = Column(String(20), primary_key=True, index=True)
    
    # Type: 'FARMER' only
    type = Column(String(20), nullable=False, default='FARMER', index=True)
    
    name = Column(String(100), nullable=False, index=True)
    mobile_number = Column(String(20), nullable=False)  # Mobile number
    whatsapp_number = Column(String(20), nullable=True)  # WhatsApp number (optional)
    
    # Location hierarchy
    state = Column(String(100), nullable=True, index=True)
    district = Column(String(100), nullable=True, index=True)
    mandal = Column(String(100), nullable=False, index=True)
    village = Column(String(100), nullable=False, index=True)
    
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)  # S3 URL
    farmer_image = Column(String(500), nullable=True)  # Farmer photo
    
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
    products = relationship("Product", back_populates="farmer")
    contact_logs = relationship("ContactLog", back_populates="farmer")

