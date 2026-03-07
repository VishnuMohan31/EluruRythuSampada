"""
Application configuration settings.
Loads environment variables and provides configuration objects.
"""

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Application
    APP_NAME: str
    APP_VERSION: str
    DEBUG: bool
    ENVIRONMENT: str
    
    # Server
    HOST: str
    PORT: int
    
    # Database
    DATABASE_URL: str
    DB_ECHO: bool
    
    # JWT
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    REFRESH_TOKEN_EXPIRE_DAYS: int
    
    # AWS S3
    AWS_REGION: str
    S3_BUCKET_IMAGES: str
    S3_BUCKET_BACKUPS: str
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    
    # Email
    SMTP_HOST: str
    SMTP_PORT: int
    SMTP_USER: str
    SMTP_PASSWORD: str
    SMTP_FROM_EMAIL: str
    SMTP_FROM_NAME: str
    
    # CAPTCHA
    RECAPTCHA_SECRET_KEY: str
    
    # Rate Limiting
    RATE_LIMIT_ENABLED: bool
    CONTACT_VENDOR_RATE_LIMIT: int
    LOGIN_RATE_LIMIT: int
    
    # CORS
    CORS_ORIGINS: str
    CORS_ALLOW_CREDENTIALS: bool
    
    # File Upload
    MAX_IMAGE_SIZE_MB: int
    ALLOWED_IMAGE_FORMATS: str
    STORAGE_PATH: str
    
    # Logging
    LOG_LEVEL: str
    LOG_FILE: str
    
    # Backup
    BACKUP_RETENTION_COUNT: int
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins string into list."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    @property
    def allowed_image_formats_list(self) -> List[str]:
        """Parse allowed image formats string into list."""
        return [fmt.strip() for fmt in self.ALLOWED_IMAGE_FORMATS.split(",")]
    
    @property
    def max_image_size_bytes(self) -> int:
        """Convert max image size from MB to bytes."""
        return self.MAX_IMAGE_SIZE_MB * 1024 * 1024
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()


# Create required directories if they don't exist
os.makedirs("logs", exist_ok=True)
os.makedirs(os.path.join(settings.STORAGE_PATH, "products"), exist_ok=True)
os.makedirs(os.path.join(settings.STORAGE_PATH, "temp"), exist_ok=True)
