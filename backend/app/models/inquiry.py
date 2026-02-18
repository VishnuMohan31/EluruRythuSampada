"""
Inquiry/Contact models for buyer-vendor communication
"""
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Integer
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base


class Buyer(Base):
    """Light registration for buyers who want to contact vendors"""
    __tablename__ = "buyers"

    # Primary key as auto-increment integer
    _id = Column(Integer, primary_key=True, autoincrement=True)
    id = Column(String, unique=True, index=True, nullable=False)  # Format: BYR001
    
    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    location = Column(String(200), nullable=False)
    phone = Column(String(20), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_contact_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    contact_logs = relationship("ContactLog", back_populates="buyer")


class ContactLog(Base):
    """Log of all vendor contacts by buyers"""
    __tablename__ = "contact_logs"

    # Primary key as auto-increment integer
    _id = Column(Integer, primary_key=True, autoincrement=True)
    id = Column(String, unique=True, index=True, nullable=False)  # Format: CNT001
    
    buyer_id = Column(String, ForeignKey("buyers.id"), nullable=False, index=True)
    product_id = Column(String, ForeignKey("products.id"), nullable=False, index=True)
    vendor_id = Column(String, ForeignKey("vendors.id"), nullable=False, index=True)
    
    ip_address = Column(String(45), nullable=False, index=True)  # IPv4 or IPv6
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    
    # Relationships
    buyer = relationship("Buyer", back_populates="contact_logs")
    product = relationship("Product", back_populates="contact_logs")
    vendor = relationship("Vendor", back_populates="contact_logs")
