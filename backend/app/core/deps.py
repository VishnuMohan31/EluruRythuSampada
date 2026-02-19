"""
Dependencies for FastAPI routes
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Generator
from ..database import SessionLocal
from ..models.user import User
from .security import decode_access_token

security = HTTPBearer()


def get_db() -> Generator:
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user"""
    import logging
    logger = logging.getLogger(__name__)
    
    token = credentials.credentials
    logger.info(f"Decoding token: {token[:20]}...")
    payload = decode_access_token(token)
    
    if payload is None:
        logger.error("Token decode returned None")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )
    
    user_id: str = payload.get("sub")
    logger.info(f"Token decoded, user_id: {user_id}")
    
    if user_id is None:
        logger.error("No user_id in token payload")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        logger.error(f"User not found: {user_id}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    if not user.is_active:
        logger.warning(f"Inactive user attempted access: {user.email}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    
    logger.info(f"User authenticated: {user.email}, role: {user.role}")
    return user


async def get_current_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """Verify user is admin or super admin"""
    import logging
    logger = logging.getLogger(__name__)
    logger.info(f"Checking admin access for user {current_user.email} with role: '{current_user.role}' (type: {type(current_user.role)})")
    
    if current_user.role not in ['admin', 'super_admin']:
        logger.warning(f"Access denied for user {current_user.email} with role '{current_user.role}'")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user


async def get_current_super_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """Verify user is super admin"""
    if current_user.role != 'super_admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Super admin access required"
        )
    return current_user
