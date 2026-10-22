from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class CalendarTask(BaseModel):
    task_id: str
    node_id: str
    subject: str
    summary: str
    description: str = ""
    start_time: datetime
    end_time: datetime
    status: str = "confirmed"
    is_completed: bool = False
    drift_count: int = 0
