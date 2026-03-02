"""
Product model for SHG products
"""
from sqlalchemy import Column, String, Text, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base


class Product(Base):
    __tablename__ = "products"

    # Primary key with formatted ID (PRD001)
    id = Column(String(20), primary_key=True, index=True)
    
    name = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=False)
    
    # Foreign keys (required)
    category_id = Column(String, ForeignKey("categories.id"), nullable=False, index=True)
    shg_id = Column(String, ForeignKey("shgs.id"), nullable=False, index=True)
    
    # Product details (optional for backward compatibility)
    price = Column(String(20), nullable=True)  # Price as string (e.g., "99.99")
    max_quantity = Column(String(50), nullable=True)  # Max quantity as string (e.g., "100 kg")
    
    # Media
    image_url = Column(String(500), nullable=True)  # Deprecated: kept for backward compatibility
    images = Column(ARRAY(Text), default=list, nullable=False)  # Array of image URLs (up to 5)
    main_image_index = Column(Integer, default=0, nullable=False)  # Index of main image
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
    shg = relationship("SHG", back_populates="products")
    product_views = relationship("ProductView", back_populates="product")
    contact_logs = relationship("ContactLog", back_populates="product")
