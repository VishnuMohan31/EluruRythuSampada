"""
Inquiry routes
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from ..core.deps import get_db, get_current_admin
from ..models.inquiry import ContactLog, Buyer
from ..models.product import Product
from ..schemas.inquiry import InquiryCreate, InquiryUpdate, InquiryResponse

router = APIRouter()


@router.get("/", response_model=List[InquiryResponse])
async def get_inquiries(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Get all contact logs (admin only)"""
    contact_logs = db.query(ContactLog).offset(skip).limit(limit).all()
    return contact_logs


@router.get("/{contact_id}", response_model=InquiryResponse)
async def get_inquiry(
    contact_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Get contact log by ID"""
    contact_log = db.query(ContactLog).filter(ContactLog.id == contact_id).first()
    if not contact_log:
        raise HTTPException(status_code=404, detail="Contact log not found")
    return contact_log


@router.post("/", response_model=InquiryResponse)
async def create_inquiry(
    inquiry: InquiryCreate,
    db: Session = Depends(get_db)
):
    """Create new contact log (public endpoint)"""
    # Create or get buyer
    buyer = db.query(Buyer).filter(Buyer.email == inquiry.email).first()
    if not buyer:
        buyer = Buyer(
            name=inquiry.name,
            email=inquiry.email,
            location=inquiry.location,
            phone=inquiry.phone
        )
        db.add(buyer)
        db.flush()
    
    # Get product to find SHG
    product = db.query(Product).filter(Product.id == inquiry.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Create contact log
    contact_log = ContactLog(
        buyer_id=buyer.id,
        product_id=inquiry.product_id,
        shg_id=product.shg_id,
        ip_address=inquiry.ip_address
    )
    db.add(contact_log)
    
    # Update product view count
    product.view_count += 1
    
    db.commit()
    db.refresh(contact_log)
    return contact_log


@router.delete("/{contact_id}")
async def delete_inquiry(
    contact_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Delete contact log"""
    contact_log = db.query(ContactLog).filter(ContactLog.id == contact_id).first()
    if not contact_log:
        raise HTTPException(status_code=404, detail="Contact log not found")
    
    db.delete(contact_log)
    db.commit()
    return {"message": "Contact log deleted successfully"}
