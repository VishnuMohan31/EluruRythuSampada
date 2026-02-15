"""
Vendor routes
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from ..core.deps import get_db, get_current_admin
from ..models.vendor import Vendor
from ..schemas.vendor import VendorCreate, VendorUpdate, VendorResponse

router = APIRouter()


@router.get("/", response_model=List[VendorResponse])
async def get_vendors(
    skip: int = 0,
    limit: int = 100,
    tribe_id: str = None,
    db: Session = Depends(get_db)
):
    """Get all vendors"""
    query = db.query(Vendor).filter(Vendor.is_active == True)
    if tribe_id:
        query = query.filter(Vendor.tribe_id == tribe_id)
    vendors = query.offset(skip).limit(limit).all()
    return vendors


@router.get("/{vendor_id}", response_model=VendorResponse)
async def get_vendor(vendor_id: str, db: Session = Depends(get_db)):
    """Get vendor by ID"""
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return vendor


@router.post("/", response_model=VendorResponse)
async def create_vendor(
    vendor: VendorCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Create new vendor"""
    db_vendor = Vendor(id=str(uuid.uuid4()), **vendor.dict())
    db.add(db_vendor)
    db.commit()
    db.refresh(db_vendor)
    return db_vendor


@router.put("/{vendor_id}", response_model=VendorResponse)
async def update_vendor(
    vendor_id: str,
    vendor_update: VendorUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Update vendor"""
    db_vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not db_vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    
    update_data = vendor_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_vendor, field, value)
    
    db.commit()
    db.refresh(db_vendor)
    return db_vendor


@router.delete("/{vendor_id}")
async def delete_vendor(
    vendor_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Delete vendor"""
    db_vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not db_vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    
    db.delete(db_vendor)
    db.commit()
    return {"message": "Vendor deleted successfully"}
