"""
Inquiry routes
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from ..core.deps import get_db, get_current_admin
from ..models.inquiry import Inquiry
from ..models.product import Product
from ..schemas.inquiry import InquiryCreate, InquiryUpdate, InquiryResponse

router = APIRouter()


@router.get("/", response_model=List[InquiryResponse])
async def get_inquiries(
    skip: int = 0,
    limit: int = 100,
    status: str = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Get all inquiries (admin only)"""
    query = db.query(Inquiry)
    if status:
        query = query.filter(Inquiry.status == status)
    inquiries = query.offset(skip).limit(limit).all()
    return inquiries


@router.get("/{inquiry_id}", response_model=InquiryResponse)
async def get_inquiry(
    inquiry_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Get inquiry by ID"""
    inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return inquiry


@router.post("/", response_model=InquiryResponse)
async def create_inquiry(
    inquiry: InquiryCreate,
    db: Session = Depends(get_db)
):
    """Create new inquiry (public endpoint)"""
    db_inquiry = Inquiry(id=str(uuid.uuid4()), **inquiry.dict())
    db.add(db_inquiry)
    
    # Update product inquiry count
    product = db.query(Product).filter(Product.id == inquiry.product_id).first()
    if product:
        product.inquiry_count += 1
    
    db.commit()
    db.refresh(db_inquiry)
    return db_inquiry


@router.put("/{inquiry_id}", response_model=InquiryResponse)
async def update_inquiry(
    inquiry_id: str,
    inquiry_update: InquiryUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Update inquiry (admin only)"""
    db_inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not db_inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    
    update_data = inquiry_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_inquiry, field, value)
    
    db.commit()
    db.refresh(db_inquiry)
    return db_inquiry


@router.delete("/{inquiry_id}")
async def delete_inquiry(
    inquiry_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Delete inquiry"""
    db_inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not db_inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    
    db.delete(db_inquiry)
    db.commit()
    return {"message": "Inquiry deleted successfully"}
