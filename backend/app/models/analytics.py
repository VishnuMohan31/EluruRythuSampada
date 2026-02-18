"""
Analytics model for tracking platform metrics
"""
from sqlalchemy import Column, String, Integer, Date, JSON, DateTime
from sqlalchemy.sql import func
from ..database import Base


class DailyAnalytics(Base):
    """Daily aggregated analytics for dashboard"""
    __tablename__ = "daily_analytics"

    # Primary key as auto-increment integer
    _id = Column(Integer, primary_key=True, autoincrement=True)
    id = Column(String, unique=True, index=True, nullable=False)  # Format: DAN001
    
    date = Column(Date, nullable=False, unique=True, index=True)
    
    # Counts
    total_product_views = Column(Integer, default=0, nullable=False)
    total_vendor_contacts = Column(Integer, default=0, nullable=False)
    new_products = Column(Integer, default=0, nullable=False)
    new_vendors = Column(Integer, default=0, nullable=False)
    new_buyers = Column(Integer, default=0, nullable=False)
    
    # Top items (JSON arrays of IDs)
    top_products = Column(JSON, nullable=True)  # [{id, name, views}, ...]
    top_categories = Column(JSON, nullable=True)  # [{id, name, count}, ...]
    top_shgs = Column(JSON, nullable=True)  # [{id, name, contacts}, ...]
    
    # Additional metrics
    metrics = Column(JSON, nullable=True)  # Flexible field for additional data
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
