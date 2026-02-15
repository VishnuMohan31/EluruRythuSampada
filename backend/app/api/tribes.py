"""
Tribe routes
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from ..core.deps import get_db, get_current_admin
from ..models.tribe import Tribe
from ..schemas.tribe import TribeCreate, TribeUpdate, TribeResponse

router = APIRouter()


@router.get("/", response_model=List[TribeResponse])
async def get_tribes(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all tribes"""
    tribes = db.query(Tribe).filter(Tribe.is_active == True).offset(skip).limit(limit).all()
    return tribes


@router.get("/{tribe_id}", response_model=TribeResponse)
async def get_tribe(tribe_id: str, db: Session = Depends(get_db)):
    """Get tribe by ID"""
    tribe = db.query(Tribe).filter(Tribe.id == tribe_id).first()
    if not tribe:
        raise HTTPException(status_code=404, detail="Tribe not found")
    return tribe


@router.post("/", response_model=TribeResponse)
async def create_tribe(
    tribe: TribeCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Create new tribe"""
    db_tribe = Tribe(id=str(uuid.uuid4()), **tribe.dict())
    db.add(db_tribe)
    db.commit()
    db.refresh(db_tribe)
    return db_tribe


@router.put("/{tribe_id}", response_model=TribeResponse)
async def update_tribe(
    tribe_id: str,
    tribe_update: TribeUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Update tribe"""
    db_tribe = db.query(Tribe).filter(Tribe.id == tribe_id).first()
    if not db_tribe:
        raise HTTPException(status_code=404, detail="Tribe not found")
    
    update_data = tribe_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_tribe, field, value)
    
    db.commit()
    db.refresh(db_tribe)
    return db_tribe


@router.delete("/{tribe_id}")
async def delete_tribe(
    tribe_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Delete tribe"""
    db_tribe = db.query(Tribe).filter(Tribe.id == tribe_id).first()
    if not db_tribe:
        raise HTTPException(status_code=404, detail="Tribe not found")
    
    db.delete(db_tribe)
    db.commit()
    return {"message": "Tribe deleted successfully"}
