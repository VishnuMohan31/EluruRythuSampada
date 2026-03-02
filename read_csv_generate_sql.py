"""
Read CSV file and generate SQL seed file
STANDARD PRODUCTION APPROACH - No external dependencies needed
"""
import csv

STATE = "Andhra Pradesh"
DISTRICT = "Eluru"
CSV_FILE = "Eluru Mandal&Villages.csv"
OUTPUT_FILE = "backend/database/02_seed_locations.sql"

def read_csv_and_generate_sql():
    """Read CSV file and generate SQL INSERT statements"""
    
    try:
        print(f"Reading {CSV_FILE}...")
        
        with open(CSV_FILE, 'r', encoding='utf-8') as f:
            # Try to detect delimiter
            sample = f.read(1024)
            f.seek(0)
            
            # Detect delimiter (comma, tab, or semicolon)
            if '\t' in sample:
                delimiter = '\t'
            elif ',' in sample:
                delimiter = ','
            elif ';' in sample:
                delimiter = ';'
            else:
                delimiter = ','
            
            print(f"✓ Detected delimiter: {'TAB' if delimiter == chr(9) else repr(delimiter)}")
            
            reader = csv.DictReader(f, delimiter=delimiter)
            
            # Get column names
            fieldnames = reader.fieldnames
            print(f"✓ Columns found: {fieldnames}")
            
            # Find mandal and village columns (case insensitive)
            mandal_col = None
            village_col = None
            
            for col in fieldnames:
                col_lower = str(col).lower().strip()
                if 'mandal' in col_lower:
                    mandal_col = col
                if 'village' in col_lower and 'code' not in col_lower:
                    village_col = col
            
            if not mandal_col or not village_col:
                print("\nError: Could not find Mandal and Village columns")
                print(f"Available columns: {fieldnames}")
                return
            
            print(f"✓ Using columns: Mandal='{mandal_col}', Village='{village_col}'")
            
            # Read data
            values = []
            skipped = 0
            mandal_counts = {}
            row_count = 0
            
            for row in reader:
                row_count += 1
                mandal = str(row.get(mandal_col, '')).strip()
                village = str(row.get(village_col, '')).strip()
                
                if mandal and village and mandal != 'None' and village != 'None':
                    # Escape single quotes
                    mandal_escaped = mandal.replace("'", "''")
                    village_escaped = village.replace("'", "''")
                    values.append(f"('{STATE}', '{DISTRICT}', '{mandal_escaped}', '{village_escaped}', CURRENT_TIMESTAMP)")
                    
                    # Count villages per mandal
                    mandal_counts[mandal] = mandal_counts.get(mandal, 0) + 1
                else:
                    skipped += 1
            
            print(f"✓ Total rows read: {row_count}")
        
        if not values:
            print("\nError: No valid data found in CSV file")
            return
        
        # Generate SQL file
        sql_content = """-- ============================================
-- Seed data for master_locations table
-- Auto-generated from CSV file
-- All villages in Eluru District, Andhra Pradesh
-- This file automatically loads when database initializes
-- ============================================

INSERT INTO master_locations (state, district, mandal, village, created_at) VALUES
"""
        
        sql_content += ',\n'.join(values) + ';\n'
        
        # Write to file
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            f.write(sql_content)
        
        print("\n" + "=" * 60)
        print("✓ SQL SEED FILE GENERATED SUCCESSFULLY")
        print("=" * 60)
        print(f"✓ Total villages: {len(values)}")
        print(f"✓ Unique mandals: {len(mandal_counts)}")
        print(f"✓ Skipped rows: {skipped}")
        print(f"✓ Output file: {OUTPUT_FILE}")
        print("=" * 60)
        
        # Show mandal-wise count
        print("\nVillages per Mandal:")
        for mandal in sorted(mandal_counts.keys()):
            print(f"  - {mandal}: {mandal_counts[mandal]} villages")
        
        print("\n✓ This file will automatically load when you restart containers!")
        print("\nNext steps:")
        print("1. Run: docker-compose down")
        print("2. Run: docker-compose up -d")
        print("3. Data will be automatically loaded into database!")
        
    except FileNotFoundError:
        print(f"Error: {CSV_FILE} not found")
        print(f"Please ensure the CSV file exists in the current directory")
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    read_csv_and_generate_sql()
