"""
SHG (Self Help Group) schemas for validation
"""
from pydantic import BaseModel, validator
from typing import Optional, Literal
from datetime import datetime


class SHGBase(BaseModel):
    type: Literal['SHG', 'Farmer'] = 'SHG'
    name: str
    contact_person: str
    mobile_number: str
    state: Optional[str] = None  # Auto-filled from super admin
    district: Optional[str] = None  # Auto-filled from super admin
    mandal: str
    village: str
    description: Optional[str] = None
    image_url: Optional[str] = None


class SHGCreate(SHGBase):
    pass


class SHGUpdate(BaseModel):
    type: Optional[Literal['SHG', 'Farmer']] = None
    name: Optional[str] = None
    contact_person: Optional[str] = None
    mobile_number: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    mandal: Optional[str] = None
    village: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None


class SHGResponse(SHGBase):
    id: str
    type: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
