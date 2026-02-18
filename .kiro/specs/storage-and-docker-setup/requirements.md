# Storage and Docker Setup - Requirements

## Overview
Set up proper file storage infrastructure for uploaded images and finalize Docker configuration for the SHG India Marketplace Portal. The system needs to handle image uploads outside of git, auto-create storage folders, and ensure smooth Docker operation for backend + database while frontend runs locally.

## User Stories

### 1. Storage Infrastructure
**As a developer**, I want uploaded images stored outside the application code so that:
- Images don't bloat the git repository
- Fresh clones work immediately without manual setup
- Storage folders are created automatically on first run
- The system is production-ready for AWS S3 migration

### 2. Docker Configuration
**As a developer**, I want backend + database running in Docker so that:
- Environment setup is consistent across machines
- Database tables auto-create on first start
- I can use simple shell scripts to manage services
- Frontend can run locally for faster development

### 3. Git Configuration
**As a developer**, I want a clean .gitignore file so that:
- Merge conflicts are resolved
- Storage folders are excluded from git
- SQL files are tracked (not ignored)
- Only necessary files are committed

## Acceptance Criteria

### 1.1 Storage Folder Structure
- Storage folder exists at project root: `storage/`
- Subfolders: `storage/images/`, `storage/temp/`
- Folders auto-create on application startup if missing
- Storage path configurable via environment variable

### 1.2 Storage in .gitignore
- `storage/` folder added to .gitignore
- Merge conflict markers removed from .gitignore
- SQL files NOT ignored (removed `*.sql` from .gitignore)
- Clean, organized .gitignore file

### 1.3 Docker Volume Mount
- Storage folder mounted as Docker volume in docker-compose.yml
- Volume persists between container restarts
- Backend can read/write to storage folder
- Proper permissions set for Docker user

### 1.4 Backend Initialization
- Backend creates storage folders on startup if missing
- Logs folder created automatically
- Storage path loaded from config
- Graceful error handling if folder creation fails

### 1.5 Shell Scripts Organization
- All shell scripts in `scripts/` folder
- Scripts work on Windows (PowerShell) and Linux (bash)
- Clear naming: start.sh, stop.sh, restart.sh, logs.sh, db-shell.sh, reset-db.sh
- All batch files (.bat) deleted

### 1.6 Database Auto-Creation
- Database tables auto-create when Docker starts
- SQL file mounted as init script: `./backend/database:/docker-entrypoint-initdb.d:ro`
- Default admin user created automatically
- Triggers and functions created automatically

### 1.7 Documentation
- README.md updated with storage folder information
- Clear instructions for running backend + database in Docker
- Instructions for running frontend locally
- Shell script usage documented

## Technical Requirements

### Storage Configuration
- Default storage path: `./storage`
- Environment variable: `STORAGE_PATH`
- Subfolders: `images/`, `temp/`
- Max image size: 5MB (configurable)
- Allowed formats: jpg, jpeg, png, webp

### Docker Configuration
- PostgreSQL 14 in Docker
- FastAPI backend in Docker
- Frontend runs locally via npm
- Network: bridge network named `shg_network`
- Volumes: `postgres_data`, `storage`

### File Upload Handling
- Images uploaded to `storage/images/`
- Temporary files in `storage/temp/`
- File paths stored in database as relative paths
- Image URLs served via backend API endpoint

## Out of Scope
- AWS S3 integration (future enhancement)
- Image optimization/resizing (future enhancement)
- CDN configuration (future enhancement)
- Backup automation (future enhancement)

## Dependencies
- Docker and Docker Compose installed
- Python 3.11+
- PostgreSQL 14+
- Node.js 18+ (for frontend)

## Success Metrics
- Storage folders auto-create on first run
- No manual folder creation needed
- Images persist between Docker restarts
- Clean git status (no untracked storage files)
- Shell scripts work correctly
- Database tables auto-create on Docker start
