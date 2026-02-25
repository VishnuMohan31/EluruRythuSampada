"""
Timezone utility functions for IST (Indian Standard Time) conversion
"""
from datetime import datetime, timedelta
from typing import Optional


def utc_to_ist(utc_time: Optional[datetime]) -> Optional[datetime]:
    """
    Convert UTC datetime to IST (UTC+5:30)
    
    Args:
        utc_time: UTC datetime object
        
    Returns:
        IST datetime object or None if input is None
    """
    if utc_time is None:
        return None
    return utc_time + timedelta(hours=5, minutes=30)


def format_ist_datetime(utc_time: Optional[datetime], format_str: str = '%d/%m/%Y %I:%M:%S %p') -> str:
    """
    Convert UTC datetime to IST and format as string
    
    Args:
        utc_time: UTC datetime object
        format_str: strftime format string (default: DD/MM/YYYY HH:MM:SS AM/PM)
        
    Returns:
        Formatted IST datetime string or empty string if input is None
    """
    if utc_time is None:
        return ''
    ist_time = utc_to_ist(utc_time)
    return ist_time.strftime(format_str)


def format_ist_date(utc_time: Optional[datetime]) -> str:
    """
    Convert UTC datetime to IST and format as date only
    
    Args:
        utc_time: UTC datetime object
        
    Returns:
        Formatted IST date string (DD/MM/YYYY) or empty string if input is None
    """
    return format_ist_datetime(utc_time, '%d/%m/%Y')
