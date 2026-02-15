"""
Vendor schemas for validation
"""
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class VendorBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    tribe_id: str
    location: Optional[str] = None
    description: Optional[str] = None
    specialization: Optional[str] = None


class VendorCreate(VendorBase):
    pass


class VendorUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    tribe_id: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    specialization: Optional[str] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None


class VendorResponse(VendorBase):
    id: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
