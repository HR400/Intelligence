from pydantic import BaseModel, Field
from typing import Optional


class UserStats(BaseModel):
    total_nodes_completed: int = 0
    total_quizzes_passed: int = 0
    total_bosses_defeated: int = 0
    combat_readiness: float = 0.0


class UserProfile(BaseModel):
    user_id: str = "scholar_1"
    username: str = "CyberScholar"
    email: str = "scholar@antigravity.ai"
    level: int = 1
    xp: int = 150
    xp_to_next_level: int = 500
    streak: int = 3
    stats: UserStats = Field(default_factory=UserStats)
