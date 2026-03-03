#!/usr/bin/env python3
"""
Script to rename all SHG references to Farmer across the codebase
"""
import os
import re
from pathlib import Path

# Define replacement patterns
REPLACEMENTS = [
    # Class names and types
    (r'\bSHG\b', 'Farmer'),
    (r'\bSHGs\b', 'Farmers'),
    
    # Table names
    (r'"shgs"', '"farmers"'),
    (r"'shgs'", "'farmers'"),
    
    # Variable and field names
    (r'\bshg_id\b', 'farmer_id'),
    (r'\bshg_image\b', 'farmer_image'),
    (r'\bshgs_id_seq\b', 'farmers_id_seq'),
    
    # Function and variable names
    (r'\bget_shgs\b', 'get_farmers'),
    (r'\bget_shg\b', 'get_farmer'),
    (r'\bcreate_shg\b', 'create_farmer'),
    (r'\bupdate_shg\b', 'update_farmer'),
    (r'\bdeactivate_shg\b', 'deactivate_farmer'),
    (r'\breactivate_shg\b', 'reactivate_farmer'),
    (r'\bupload_shg_image\b', 'upload_farmer_image'),
    (r'\bdb_shg\b', 'db_farmer'),
    (r'\bexisting_shg\b', 'existing_farmer'),
    
    # Schema classes
    (r'\bSHGBase\b', 'FarmerBase'),
    (r'\bSHGCreate\b', 'FarmerCreate'),
    (r'\bSHGUpdate\b', 'FarmerUpdate'),
    (r'\bSHGResponse\b', 'FarmerResponse'),
    (r'\bSHGNested\b', 'FarmerNested'),
    
    # React/JS variables
    (r'\bshgs\b', 'farmers'),
    (r'\bshg\b', 'farmer'),
    (r'\bselectedSHG\b', 'selectedFarmer'),
    (r'\buniqueSHGs\b', 'uniqueFarmers'),
    (r'\bmatchesSHG\b', 'matchesFarmer'),
    (r'\btopSHGs\b', 'topFarmers'),
    (r'\bleastSHGs\b', 'leastFarmers'),
    (r'\btopSHGInquiries\b', 'topFarmerInquiries'),
    (r'\bleastSHGInquiries\b', 'leastFarmerInquiries'),
    (r'\btotal_shg_contacts\b', 'total_farmer_contacts'),
    (r'\bnew_shgs\b', 'new_farmers'),
    (r'\btop_shgs\b', 'top_farmers'),
    (r'\btotalSHGs\b', 'totalFarmers'),
    
    # ID format
    (r'SHG\{seq_num:03d\}', 'FARMER{seq_num:03d}'),
    (r'"SHG001"', '"FARMER001"'),
    (r"'SHG001'", "'FARMER001'"),
    
    # Type literals
    (r"type IN \('SHG'\)", "type IN ('FARMER')"),
    (r"type: Literal\['SHG'\]", "type: Literal['FARMER']"),
    (r"type = 'SHG'", "type = 'FARMER'"),
    (r'type: "SHG"', 'type: "FARMER"'),
    
    # Comments and strings
    (r'Self Help Group', 'Farmer'),
    (r'self help group', 'farmer'),
    (r'SHG \(Self Help Group\)', 'Farmer'),
]

# Files to process
BACKEND_PATTERNS = [
    'backend/app/**/*.py',
    'backend/database/*.sql',
]

FRONTEND_PATTERNS = [
    'frontend/src/**/*.jsx',
    'frontend/src/**/*.js',
]

def process_file(file_path):
    """Process a single file and apply replacements"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Apply all replacements
        for pattern, replacement in REPLACEMENTS:
            content = re.sub(pattern, replacement, content)
        
        # Only write if content changed
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Updated: {file_path}")
            return True
        return False
    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")
        return False

def main():
    """Main function to process all files"""
    base_dir = Path(__file__).parent
    updated_count = 0
    
    print("=" * 60)
    print("Renaming SHG to Farmer across the codebase")
    print("=" * 60)
    print()
    
    # Process backend files
    print("Processing backend files...")
    for pattern in BACKEND_PATTERNS:
        for file_path in base_dir.glob(pattern):
            if file_path.is_file():
                if process_file(file_path):
                    updated_count += 1
    
    # Process frontend files
    print("\nProcessing frontend files...")
    for pattern in FRONTEND_PATTERNS:
        for file_path in base_dir.glob(pattern):
            if file_path.is_file():
                if process_file(file_path):
                    updated_count += 1
    
    print()
    print("=" * 60)
    print(f"✅ Complete! Updated {updated_count} files")
    print("=" * 60)

if __name__ == '__main__':
    main()
