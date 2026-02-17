"""
SHG (Self Help Group) routes
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
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
    db: Session = Depends(get_db)
):
    """Get all SHGs"""
    shgs = db.query(SHG).filter(SHG.is_active == True).offset(skip).limit(limit).all()
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
    """Create new SHG"""
    db_shg = SHG(id=str(uuid.uuid4()), **shg.dict())
    db.add(db_shg)
    db.commit()
    db.refresh(db_shg)
    return db_shg


@router.put("/{shg_id}", response_model=SHGResponse)
async def update_shg(
    shg_id: str,
    shg_update: SHGUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Update SHG"""
    db_shg = db.query(SHG).filter(SHG.id == shg_id).first()
    if not db_shg:
        raise HTTPException(status_code=404, detail="SHG not found")
    
    update_data = shg_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_shg, field, value)
    
    db.commit()
    db.refresh(db_shg)
    return db_shg


@router.delete("/{shg_id}")
async def delete_shg(
    shg_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Delete SHG"""
    db_shg = db.query(SHG).filter(SHG.id == shg_id).first()
    if not db_shg:
        raise HTTPException(status_code=404, detail="SHG not found")
    
    db.delete(db_shg)
    db.commit()
    return {"message": "SHG deleted successfully"}
