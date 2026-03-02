"""
Location API endpoints for State, District, Mandal and Village dropdowns
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import distinct, and_
from typing import List, Optional
from ..core.deps import get_db
from ..models.master_location import MasterLocation
from ..schemas.master_location import MandalResponse, VillageListResponse, VillageResponse

router = APIRouter()


@router.get("/states")
def get_states(db: Session = Depends(get_db)):
    """
    Get unique list of states
    """
    states = db.query(distinct(MasterLocation.state)).order_by(MasterLocation.state).all()
    return {"states": [s[0] for s in states]}


@router.get("/districts")
def get_districts(
    state: str = Query(..., description="Filter by state (required)"),
    db: Session = Depends(get_db)
):
    """
    Get unique list of districts for a given state
    Required: state
    """
    districts = db.query(distinct(MasterLocation.district))\
        .filter(MasterLocation.state == state)\
        .filter(MasterLocation.district != '')\
        .order_by(MasterLocation.district)\
        .all()
    
    return {"districts": [d[0] for d in districts]}


@router.get("/mandals", response_model=MandalResponse)
def get_mandals(
    state: str = Query(None, description="Filter by state"),
    district: str = Query(None, description="Filter by district"),
    db: Session = Depends(get_db)
):
    """
    Get unique list of mandals
    Optional filters: state, district
    """
    query = db.query(distinct(MasterLocation.mandal))\
        .filter(MasterLocation.mandal != '')
    
    if state:
        query = query.filter(MasterLocation.state == state)
    if district:
        query = query.filter(MasterLocation.district == district)
    
    mandals = [m[0] for m in query.order_by(MasterLocation.mandal).all()]
    
    return MandalResponse(mandals=mandals)


@router.get("/villages", response_model=VillageListResponse)
def get_villages(
    mandal: str = Query(..., description="Filter by mandal (required)"),
    state: str = Query(None, description="Filter by state"),
    district: str = Query(None, description="Filter by district"),
    db: Session = Depends(get_db)
):
    """
    Get villages filtered by mandal
    Required: mandal
    Optional filters: state, district
    """
    query = db.query(MasterLocation)\
        .filter(MasterLocation.mandal == mandal)\
        .filter(MasterLocation.village != '')
    
    if state:
        query = query.filter(MasterLocation.state == state)
    if district:
        query = query.filter(MasterLocation.district == district)
    
    villages = query.order_by(MasterLocation.village).all()
    
    return VillageListResponse(villages=villages)
