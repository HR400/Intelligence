from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone


class UserStats(BaseModel):
    total_nodes_completed: int = 0
    total_quizzes_passed: int = 0
    total_bosses_defeated: int = 0
    combat_readiness: float = Field(default=0.0, ge=0.0, le=1.0)


class User(BaseModel):
    id: Optional[str] = None
    username: str
    email: str
    level: int = 1
    xp: int = 0
    xp_to_next_level: int = 500
    streak: int = 0
    last_active_date: Optional[datetime] = None
    stats: UserStats = Field(default_factory=UserStats)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    def add_xp(self, amount: int) -> bool:
        """Add XP and return True if leveled up."""
        self.xp += amount
        leveled_up = False
        while self.xp >= self.xp_to_next_level:
            self.xp -= self.xp_to_next_level
            self.level += 1
            self.xp_to_next_level = int(self.xp_to_next_level * 1.5)
            leveled_up = True
        return leveled_up
