"""
Analytics schemas for validation
"""
from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import date


class AnalyticsResponse(BaseModel):
    id: str
    date: date
    total_views: int
    total_inquiries: int
    active_products: int
    active_vendors: int
    top_products: List[str]
    top_categories: List[str]
    metrics: Dict[str, Any]

    class Config:
        from_attributes = True
