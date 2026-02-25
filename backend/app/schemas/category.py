"""
Category schemas for validation
"""
from pydantic import BaseModel, field_serializer
from typing import Optional
from datetime import datetime
from ..utils.timezone import format_ist_datetime


class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    image: Optional[str] = None
    state: Optional[str] = None  # Auto-filled from super admin
    district: Optional[str] = None  # Auto-filled from super admin


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    image: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    is_active: Optional[bool] = None


class CategoryResponse(CategoryBase):
    id: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    @field_serializer('created_at', 'updated_at')
    def serialize_datetime(self, dt: Optional[datetime], _info) -> Optional[str]:
        """Convert UTC datetime to IST and format as dd/mm/yyyy hh:mm:ss AM/PM"""
        if dt is None:
            return None
        return format_ist_datetime(dt)

    class Config:
        from_attributes = True
