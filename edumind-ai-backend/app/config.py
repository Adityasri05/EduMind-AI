import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # App Settings
    PROJECT_NAME: str = "EduMind AI Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkeyforlocaltesting_changeinproduction")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440 # 24 hours
    
    # Databases
    # Defaults to SQLite out-of-the-box for smooth demo setups. If DATABASE_URL is supplied, it connects to PostgreSQL.
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./edumind.db")
    
    # AI Credentials (Gemini powers all AI agents: Tutor, Voice STT, OCR, Quiz)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Vector Database Configuration
    CHROMA_DB_PATH: str = os.getenv("CHROMA_DB_PATH", "./chroma_data")

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
    )

    def __init__(self, **values):
        super().__init__(**values)
        if self.DATABASE_URL.startswith("postgres://"):
            self.DATABASE_URL = self.DATABASE_URL.replace("postgres://", "postgresql://", 1)

settings = Settings()
