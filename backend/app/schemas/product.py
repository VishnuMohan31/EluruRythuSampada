"""
Product schemas for validation
"""
from pydantic import BaseModel, field_serializer
from typing import Optional
from datetime import datetime
from ..utils.timezone import format_ist_datetime


class CategoryNested(BaseModel):
    id: str
    name: str
    
    class Config:
        from_attributes = True


class SHGNested(BaseModel):
    id: str
    name: str
    contact_person: str
    mobile_number: str
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

    @field_serializer('created_at', 'updated_at')
    def serialize_datetime(self, dt: Optional[datetime], _info) -> Optional[str]:
        """Convert UTC datetime to IST and format as dd/mm/yyyy hh:mm:ss AM/PM"""
        if dt is None:
            return None
        return format_ist_datetime(dt)

    class Config:
        from_attributes = True
