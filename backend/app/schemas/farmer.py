"""
Farmer schemas for validation
"""
from pydantic import BaseModel, validator, field_serializer
from typing import Optional, Literal
from datetime import datetime
from ..utils.timezone import format_ist_datetime


class FarmerBase(BaseModel):
    type: Literal['FARMER'] = 'FARMER'
    name: str
    mobile_number: str
    whatsapp_number: Optional[str] = None  # WhatsApp number (optional)
    state: Optional[str] = None  # Auto-filled from super admin
    district: Optional[str] = None  # Auto-filled from super admin
    mandal: str
    village: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    farmer_image: Optional[str] = None  # Farmer photo


class FarmerCreate(FarmerBase):
    pass


class FarmerUpdate(BaseModel):
    type: Optional[Literal['FARMER']] = None
    name: Optional[str] = None
    mobile_number: Optional[str] = None
    whatsapp_number: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    mandal: Optional[str] = None
    village: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    farmer_image: Optional[str] = None
    is_active: Optional[bool] = None


class FarmerResponse(FarmerBase):
    id: str
    type: str
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

