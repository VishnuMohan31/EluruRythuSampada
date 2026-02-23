"""
SHG (Self Help Group) routes
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
import uuid

from ..core.deps import get_db, get_current_admin
from ..models.shg import SHG
from ..schemas.shg import SHGCreate, SHGUpdate, SHGResponse

router = APIRouter()


@router.get("/", response_model=List[SHGResponse])
async def get_shgs(
    skip: int = 0,
    limit: int = 100,
    include_inactive: bool = False,
    type: str = None,  # Filter by type: 'SHG' or 'Farmer'
    db: Session = Depends(get_db)
):
    """Get all SHGs and Farmers"""
    query = db.query(SHG)
    if not include_inactive:
        query = query.filter(SHG.is_active == True)
    if type and type in ['SHG', 'Farmer']:
        query = query.filter(SHG.type == type)
    shgs = query.offset(skip).limit(limit).all()
    return shgs


@router.get("/{shg_id}", response_model=SHGResponse)
async def get_shg(shg_id: str, db: Session = Depends(get_db)):
    """Get SHG by ID"""
    shg = db.query(SHG).filter(SHG.id == shg_id).first()
    if not shg:
        raise HTTPException(status_code=404, detail="SHG not found")
    return shg


@router.post("/", response_model=SHGResponse)
async def create_shg(
    shg: SHGCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Create new SHG or Farmer - Auto-fills state/district from super admin"""
    shg_data = shg.dict()
    
    # Check for duplicate mobile number
    existing_shg = db.query(SHG).filter(SHG.mobile_number == shg_data['mobile_number']).first()
    if existing_shg:
        raise HTTPException(
            status_code=400, 
            detail=f"Mobile number already registered with {existing_shg.type} '{existing_shg.name}' (ID: {existing_shg.id})"
        )
    
    # If super admin, auto-fill their state and district
    if current_user.role == 'super_admin':
        shg_data['state'] = current_user.state
        shg_data['district'] = current_user.district
    
    # For Farmer type: copy name to contact_person (Farmer name is both name and contact)
    if shg_data.get('type') == 'Farmer':
        shg_data['contact_person'] = shg_data['name']
    
    # Generate ID based on type
    if shg_data.get('type') == 'Farmer':
        result = db.execute(text("SELECT nextval('farmers_id_seq')"))
        seq_num = result.scalar()
        shg_id = f"FRM{seq_num:03d}"
    else:
        result = db.execute(text("SELECT nextval('shgs_id_seq')"))
        seq_num = result.scalar()
        shg_id = f"SHG{seq_num:03d}"
    
    # Create SHG/Farmer
    db_shg = SHG(id=shg_id, **shg_data, created_by=current_user.id)
    db.add(db_shg)
    db.commit()
    db.refresh(db_shg)
    
    print(f"✅ {shg_data.get('type', 'SHG')} created: {shg_id} - {shg.name}")
    return db_shg


@router.put("/{shg_id}", response_model=SHGResponse)
async def update_shg(
    shg_id: str,
    shg_update: SHGUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Update SHG or Farmer (type cannot be changed after creation)"""
    db_shg = db.query(SHG).filter(SHG.id == shg_id).first()
    if not db_shg:
        raise HTTPException(status_code=404, detail="SHG/Farmer not found")
    
    update_data = shg_update.dict(exclude_unset=True)
    
    # Prevent type change after creation
    if 'type' in update_data and update_data['type'] != db_shg.type:
        raise HTTPException(status_code=400, detail="Cannot change type after creation")
    
    # For Farmer type: if name is updated, also update contact_person
    if db_shg.type == 'Farmer' and 'name' in update_data:
        update_data['contact_person'] = update_data['name']
    
    for field, value in update_data.items():
        setattr(db_shg, field, value)
    
    db_shg.updated_by = current_user.id
    db.commit()
    db.refresh(db_shg)
    return db_shg


@router.put("/{shg_id}/deactivate")
async def deactivate_shg(
    shg_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Deactivate SHG/Farmer (soft delete)"""
    db_shg = db.query(SHG).filter(SHG.id == shg_id).first()
    if not db_shg:
        raise HTTPException(status_code=404, detail="SHG/Farmer not found")
    
    db_shg.is_active = False
    db_shg.updated_by = current_user.id
    db.commit()
    db.refresh(db_shg)
    return {"message": f"{db_shg.type} deactivated successfully", "shg": db_shg}


@router.put("/{shg_id}/reactivate")
async def reactivate_shg(
    shg_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Reactivate SHG/Farmer"""
    db_shg = db.query(SHG).filter(SHG.id == shg_id).first()
    if not db_shg:
        raise HTTPException(status_code=404, detail="SHG/Farmer not found")
    
    db_shg.is_active = True
    db_shg.updated_by = current_user.id
    db.commit()
    db.refresh(db_shg)
    return {"message": f"{db_shg.type} reactivated successfully", "shg": db_shg}
