"""
Contact Log schemas for buyer-Farmer communication
"""
from pydantic import BaseModel, EmailStr, field_serializer
from typing import Optional
from datetime import datetime
from ..utils.timezone import format_ist_datetime


class InquiryBase(BaseModel):
    name: str
    email: Optional[EmailStr] = None  # Optional
    location: str
    phone: str  # Required
    product_id: str
    ip_address: Optional[str] = None  # Optional - backend will capture from request


class InquiryCreate(InquiryBase):
    pass


class InquiryUpdate(BaseModel):
    pass


class InquiryResponse(BaseModel):
    id: str
    buyer_id: str
    product_id: str
    farmer_id: str
    ip_address: str
    created_at: datetime
    # Enriched fields
    buyer_name: Optional[str] = None
    buyer_phone: Optional[str] = None
    buyer_email: Optional[str] = None
    buyer_location: Optional[str] = None
    product_name: Optional[str] = None
    farmer_name: Optional[str] = None

    @field_serializer('created_at')
    def serialize_datetime(self, dt: Optional[datetime], _info) -> Optional[str]:
        """Convert UTC datetime to IST and format as dd/mm/yyyy hh:mm:ss AM/PM"""
        if dt is None:
            return None
        return format_ist_datetime(dt)

    class Config:
        from_attributes = True
