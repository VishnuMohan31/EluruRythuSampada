"""
Vendor model for tribal artisans/vendors
"""
from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base


class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    tribe_id = Column(String, ForeignKey("tribes.id"))
    location = Column(String)
    description = Column(Text)
    specialization = Column(String)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    tribe = relationship("Tribe", back_populates="vendors")
    products = relationship("Product", back_populates="vendor")
