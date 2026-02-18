"""
Product model for SHG products
"""
from sqlalchemy import Column, String, Text, Integer, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base


class Product(Base):
    __tablename__ = "products"

    # Primary key as auto-increment integer
    _id = Column(Integer, primary_key=True, autoincrement=True)
    id = Column(String, unique=True, index=True, nullable=False)  # Format: PRD001
    
    name = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=False)
    
    # Foreign keys (required)
    category_id = Column(String, ForeignKey("categories.id"), nullable=False, index=True)
    subcategory_id = Column(String, ForeignKey("subcategories.id"), nullable=True, index=True)  # Optional
    shg_id = Column(String, ForeignKey("shgs.id"), nullable=False, index=True)
    
    # Media
    image_url = Column(String(500), nullable=True)  # Single product image S3 URL
    youtube_link = Column(String(500), nullable=True)
    instagram_link = Column(String(500), nullable=True)
    
    # Analytics
    view_count = Column(Integer, default=0, nullable=False)
    
    # Status and audit fields
    is_active = Column(Boolean, default=True, nullable=False, index=True)  # Active/Inactive
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    created_by = Column(String, nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    updated_by = Column(String, nullable=True)
    
    # Soft delete fields
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    deleted_by = Column(String, nullable=True)
    
    # Relationships
    category = relationship("Category", back_populates="products")
    subcategory = relationship("Subcategory", back_populates="products")
    shg = relationship("SHG", back_populates="products")
    product_views = relationship("ProductView", back_populates="product")
    inquiries = relationship("Inquiry", back_populates="product")
