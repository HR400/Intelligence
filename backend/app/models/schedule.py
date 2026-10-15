from enum import Enum
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone


class QuestType(str, Enum):
    STUDY = "STUDY"
    BOSS_BATTLE = "BOSS_BATTLE"
    DRILL = "DRILL"


class TaskSchedule(BaseModel):
    id: str
    user_id: str
    node_id: str
    quest_type: QuestType = QuestType.STUDY
    scheduled_start: datetime
    scheduled_end: datetime
    is_completed: bool = False
    google_event_id: Optional[str] = None
    drift_count: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ScheduleDriftLog(BaseModel):
    id: str
    task_id: str
    original_start: datetime
    original_end: datetime
    new_start: datetime
    new_end: datetime
    reason: str = "SCHEDULE_DRIFT_CASCADE"
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
