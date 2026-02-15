"""
Analytics model for tracking platform metrics
"""
from sqlalchemy import Column, String, Integer, Date, JSON
from sqlalchemy.sql import func
from ..database import Base


class Analytics(Base):
    __tablename__ = "analytics"

    id = Column(String, primary_key=True, index=True)
    date = Column(Date, nullable=False, index=True)
    total_views = Column(Integer, default=0)
    total_inquiries = Column(Integer, default=0)
    active_products = Column(Integer, default=0)
    active_vendors = Column(Integer, default=0)
    top_products = Column(JSON)  # Array of product IDs
    top_categories = Column(JSON)  # Array of category IDs
    metrics = Column(JSON)  # Additional metrics
