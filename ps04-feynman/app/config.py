import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path
from pydantic import field_validator


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="allow")

    PROJECT_NAME: str = "PS04 Socratic Quest & Academic Workload Engine"
    API_V1_STR: str = "/api"
    VAULT_PATH: Path = Path.home() / "learning-vault"
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "ps04_academic_engine"
    HOST: str = "127.0.0.1"
    PORT: int = 8000

    @field_validator("VAULT_PATH", mode="before")
    @classmethod
    def expand_vault_path(cls, v):
        if isinstance(v, str):
            return Path(os.path.expanduser(v)).resolve()
        return v


settings = Settings()
