from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "Gamified Academic Planner & Socratic Agent Engine"
    API_V1_STR: str = "/api/v1"
    
    # MongoDB
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "academic_planner"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    
    # AI / LLM Configuration
    GEMINI_API_KEY: str = ""
    LITELLM_MODEL: str = "gemini/gemini-2.5-flash"
    MAX_SOCRATIC_TOKENS: int = 150
    
    # Obsidian Vault Path
    DEFAULT_OBSIDIAN_VAULT_PATH: str = "./vault"

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
