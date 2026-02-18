"""
Product view tracking model for analytics
"""
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base


class ProductView(Base):
    """Track individual product views for detailed analytics"""
    __tablename__ = "product_views"

    # Primary key as auto-increment integer
    _id = Column(Integer, primary_key=True, autoincrement=True)
    id = Column(String, unique=True, index=True, nullable=False)  # Format: PVW001
    
    product_id = Column(String, ForeignKey("products.id"), nullable=False, index=True)
    session_id = Column(String(100), nullable=True, index=True)  # For unique view tracking
    ip_address = Column(String(45), nullable=True)  # IPv4 or IPv6
    user_agent = Column(String(500), nullable=True)
    
    viewed_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    
    # Relationships
    product = relationship("Product", back_populates="product_views")
