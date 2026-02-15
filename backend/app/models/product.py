"""
Product model for tribal products
"""
from sqlalchemy import Column, String, Text, Float, Integer, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text)
    category_id = Column(String, ForeignKey("categories.id"))
    tribe_id = Column(String, ForeignKey("tribes.id"))
    vendor_id = Column(String, ForeignKey("vendors.id"))
    price = Column(Float)
    images = Column(JSON)  # Array of image URLs
    materials = Column(String)
    dimensions = Column(String)
    weight = Column(String)
    stock_status = Column(String, default="available")
    view_count = Column(Integer, default=0)
    inquiry_count = Column(Integer, default=0)
    is_featured = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    category = relationship("Category", back_populates="products")
    tribe = relationship("Tribe", back_populates="products")
    vendor = relationship("Vendor", back_populates="products")
    inquiries = relationship("Inquiry", back_populates="product")
