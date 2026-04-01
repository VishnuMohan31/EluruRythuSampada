"""
Farmer (Farmer) routes
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
import uuid
import os
from pathlib import Path
import shutil

from ..core.deps import get_db, get_current_admin
from ..models.farmer import Farmer
from ..schemas.farmer import FarmerCreate, FarmerUpdate, FarmerResponse
from ..config import settings

router = APIRouter()


@router.get("/", response_model=List[FarmerResponse])
async def get_farmers(
    skip: int = 0,
    limit: int = None,
    include_inactive: bool = False,
    type: str = None,
    db: Session = Depends(get_db)
):
    """Get all Farmers"""
    query = db.query(Farmer)
    if not include_inactive:
        query = query.filter(Farmer.is_active == True)
    if type and type in ['Farmer']:
        query = query.filter(Farmer.type == type)
    
    query = query.order_by(Farmer.updated_at.desc().nullslast(), Farmer.name.asc())
    
    if limit is not None:
        query = query.offset(skip).limit(limit)
    else:
        query = query.offset(skip)
    
    return query.all()


@router.get("/{farmer_id}", response_model=FarmerResponse)
async def get_farmer(farmer_id: str, db: Session = Depends(get_db)):
    """Get Farmer by ID"""
    farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
    return farmer


@router.post("/", response_model=FarmerResponse)
async def create_farmer(
    farmer: FarmerCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Create new Farmer - Auto-fills state/district from super admin"""
    farmer_data = farmer.dict()
    
    # Check for duplicate mobile number
    existing_farmer = db.query(Farmer).filter(Farmer.mobile_number == farmer_data['mobile_number']).first()
    if existing_farmer:
        raise HTTPException(
            status_code=400, 
            detail=f"Mobile number already registered with Farmer '{existing_farmer.name}' (ID: {existing_farmer.id})"
        )
    
    # If super admin, auto-fill their state and district
    if current_user.role == 'super_admin':
        farmer_data['state'] = current_user.state
        farmer_data['district'] = current_user.district
    
    # Generate ID for Farmer
    result = db.execute(text("SELECT nextval('farmers_id_seq')"))
    seq_num = result.scalar()
    farmer_id = f"FMR{seq_num:03d}"
    
    # Create Farmer
    db_farmer = Farmer(id=farmer_id, **farmer_data, created_by=current_user.id)
    db.add(db_farmer)
    db.commit()
    db.refresh(db_farmer)
    
    print(f"✅ Farmer created: {farmer_id} - {farmer.name}")
    return db_farmer


@router.put("/{farmer_id}", response_model=FarmerResponse)
async def update_farmer(
    farmer_id: str,
    farmer_update: FarmerUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Update Farmer"""
    db_farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
    if not db_farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
    
    update_data = farmer_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(db_farmer, field, value)
    
    db_farmer.updated_by = current_user.id
    db.commit()
    db.refresh(db_farmer)
    return db_farmer


@router.put("/{farmer_id}/deactivate")
async def deactivate_farmer(
    farmer_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Deactivate Farmer (soft delete)"""
    db_farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
    if not db_farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
    
    db_farmer.is_active = False
    db_farmer.updated_by = current_user.id
    db.commit()
    db.refresh(db_farmer)
    return {"message": "Farmer deactivated successfully", "farmer": db_farmer}


@router.put("/{farmer_id}/reactivate")
async def reactivate_farmer(
    farmer_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Reactivate Farmer"""
    db_farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
    if not db_farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
    
    db_farmer.is_active = True
    db_farmer.updated_by = current_user.id
    db.commit()
    db.refresh(db_farmer)
    return {"message": "Farmer reactivated successfully", "farmer": db_farmer}


@router.post("/upload-image")
async def upload_farmer_image(
    file: UploadFile = File(...),
    current_user = Depends(get_current_admin)
):
    """Upload Farmer image"""
    print(f"📤 Farmer Image upload started: {file.filename} by {current_user.id}")
    
    # Validate file type
    if not file.content_type.startswith('image/'):
        print(f"❌ Invalid file type: {file.content_type}")
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Validate file size (max 2MB)
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    if file_size > 2 * 1024 * 1024:
        print(f"❌ File too large: {file_size / (1024*1024):.2f}MB")
        raise HTTPException(status_code=400, detail="File size must be less than 2MB")
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    
    # Save file
    storage_path = Path(settings.STORAGE_PATH) / "farmers"
    storage_path.mkdir(parents=True, exist_ok=True)
    file_path = storage_path / unique_filename
    
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return relative URL
    image_url = f"/storage/farmers/{unique_filename}"
    print(f"✅ Farmer Image uploaded successfully: {image_url} ({file_size / 1024:.2f}KB)")
    return {"image_url": image_url, "filename": unique_filename}
