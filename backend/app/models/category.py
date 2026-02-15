"""
Category model for product categorization
"""
from sqlalchemy import Column, String, Text, Integer, Boolean, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    image_url = Column(String)
    product_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    products = relationship("Product", back_populates="category")
