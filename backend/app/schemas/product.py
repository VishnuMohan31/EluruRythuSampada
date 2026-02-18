"""
Product schemas for validation
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ProductBase(BaseModel):
    name: str
    description: str
    category_id: str
    subcategory_id: Optional[str] = None
    shg_id: str
    image_url: Optional[str] = None
    youtube_link: Optional[str] = None
    instagram_link: Optional[str] = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[str] = None
    subcategory_id: Optional[str] = None
    shg_id: Optional[str] = None
    image_url: Optional[str] = None
    youtube_link: Optional[str] = None
    instagram_link: Optional[str] = None
    is_active: Optional[bool] = None


class ProductResponse(ProductBase):
    id: str
    view_count: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Nested relationships
    category: Optional[dict] = None
    subcategory: Optional[dict] = None
    shg: Optional[dict] = None

    class Config:
        from_attributes = True
