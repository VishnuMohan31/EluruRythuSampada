"""
Product schemas for validation
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CategoryNested(BaseModel):
    id: str
    name: str
    
    class Config:
        from_attributes = True


class SHGNested(BaseModel):
    id: str
    name: str
    mandal: str
    village: str
    
    class Config:
        from_attributes = True


class ProductBase(BaseModel):
    name: str
    description: str
    category_id: str
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
    category: Optional[CategoryNested] = None
    shg: Optional[SHGNested] = None

    class Config:
        from_attributes = True
