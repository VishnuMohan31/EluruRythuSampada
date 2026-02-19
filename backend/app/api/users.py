"""
User management routes
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ..core.deps import get_db, get_current_admin, get_current_user
from ..core.security import get_password_hash
from ..models.user import User
from ..schemas.user import UserCreate, UserUpdate, UserResponse, ChangePasswordRequest

router = APIRouter()


@router.get("/", response_model=List[UserResponse])
async def get_users(
    role: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Get all users (admin only) - can filter by role"""
    query = db.query(User).filter(User.is_active == True)
    
    if role:
        query = query.filter(User.role == role)
    
    users = query.offset(skip).limit(limit).all()
    return users


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Get user by ID"""
    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/", response_model=UserResponse)
async def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Create new user (admin only)"""
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user with auto-generated ID from database trigger
    db_user = User(
        email=user.email,
        name=user.name,
        mobile_number=user.mobile_number,
        state=user.state,
        district=user.district,
        role=user.role,
        hashed_password=get_password_hash(user.password),
        created_by=current_user.id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Update user (admin only)"""
    db_user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = user_update.dict(exclude_unset=True)
    
    # Handle password update separately
    if "password" in update_data and update_data["password"]:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    elif "password" in update_data:
        update_data.pop("password")
    
    # Update fields
    for field, value in update_data.items():
        if hasattr(db_user, field):
            setattr(db_user, field, value)
    
    db_user.updated_at = datetime.utcnow()
    db_user.updated_by = current_user.id
    
    db.commit()
    db.refresh(db_user)
    return db_user


@router.put("/{user_id}/deactivate")
async def deactivate_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Deactivate user (soft delete)"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_user.is_active = False
    db_user.deleted_at = datetime.utcnow()
    db_user.deleted_by = current_user.id
    
    db.commit()
    return {"message": "User deactivated successfully"}


@router.put("/{user_id}/reactivate")
async def reactivate_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Reactivate user"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_user.is_active = True
    db_user.deleted_at = None
    db_user.deleted_by = None
    db_user.updated_at = datetime.utcnow()
    db_user.updated_by = current_user.id
    
    db.commit()
    return {"message": "User reactivated successfully"}


@router.put("/me/change-password")
async def change_own_password(
    password_data: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Change current user's password"""
    from ..core.security import verify_password
    
    # Verify current password
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    # Update password
    current_user.hashed_password = get_password_hash(password_data.new_password)
    current_user.updated_at = datetime.utcnow()
    
    db.commit()
    return {"message": "Password changed successfully"}


@router.delete("/{user_id}")
async def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """Hard delete user (admin only) - use deactivate instead"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(db_user)
    db.commit()
    return {"message": "User deleted successfully"}
