"""
Category routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from ..core.deps import get_db, get_current_admin
from ..models.category import Category
from ..schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse

router = APIRouter()


@router.get("/", response_model=List[CategoryResponse])
async def get_categories(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all categories"""
    categories = db.query(Category).filter(Category.is_active == True).offset(skip).limit(limit).all()
    return categories


@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(
    category_id: str,
    db: Session = Depends(get_db)
):
    """Get category by ID"""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.post("/", response_model=CategoryResponse)
async def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Create new category"""
    db_category = Category(
        id=str(uuid.uuid4()),
        **category.dict()
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: str,
    category_update: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Update category"""
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    update_data = category_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_category, field, value)
    
    db.commit()
    db.refresh(db_category)
    return db_category


@router.delete("/{category_id}")
async def delete_category(
    category_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Delete category"""
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db.delete(db_category)
    db.commit()
    return {"message": "Category deleted successfully"}
