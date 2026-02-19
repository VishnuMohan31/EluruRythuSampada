"""
Vendor model for SHG artisans/vendors
"""
from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, Integer
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base


class Vendor(Base):
    __tablename__ = "vendors"

    # Primary key as auto-increment integer
    _id = Column(Integer, primary_key=True, autoincrement=True)
    id = Column(String, unique=True, index=True, nullable=False)  # Format: VND001
    
    name = Column(String(100), nullable=False, index=True)
    shg_id = Column(String, ForeignKey("shgs.id"), nullable=False, index=True)
    
    # Location hierarchy (required)
    state = Column(String(100), nullable=False, index=True)
    district = Column(String(100), nullable=False, index=True)
    mandal = Column(String(100), nullable=False, index=True)
    village = Column(String(100), nullable=False, index=True)
    
    # Contact information
    phone = Column(String(20), nullable=False)
    email = Column(String(255), nullable=True, index=True)
    
    # Approval status
    status = Column(String(20), default='Pending', nullable=False, index=True)  # 'Pending', 'Approved', 'Rejected'
    
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
    shg = relationship("SHG", back_populates="vendors")
