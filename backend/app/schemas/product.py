"""
Product schemas for validation
"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    category_id: str
    shg_id: str
    vendor_id: str
    price: Optional[float] = None
    materials: Optional[str] = None
    dimensions: Optional[str] = None
    weight: Optional[str] = None
    stock_status: str = "available"


class ProductCreate(ProductBase):
    images: Optional[List[str]] = []


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[str] = None
    shg_id: Optional[str] = None
    vendor_id: Optional[str] = None
    price: Optional[float] = None
    images: Optional[List[str]] = None
    materials: Optional[str] = None
    dimensions: Optional[str] = None
    weight: Optional[str] = None
    stock_status: Optional[str] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None


class ProductResponse(ProductBase):
    id: str
    images: List[str]
    view_count: int
    inquiry_count: int
    is_featured: bool
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
