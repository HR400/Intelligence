import uuid
from typing import List, Optional, Tuple
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel
from backend.app.models.schedule import TaskSchedule, ScheduleDriftLog


class TimeSlot(BaseModel):
    start: datetime
    end: datetime

    @property
    def duration_minutes(self) -> float:
        return (self.end - self.start).total_seconds() / 60.0


def find_first_available_slot(
    earliest_start: datetime,
    duration_minutes: int,
    busy_intervals: List[TimeSlot],
    search_horizon_days: int = 7,
) -> Optional[TimeSlot]:
    """
    Deterministically finds the first open window of length >= duration_minutes
    starting at or after earliest_start, avoiding busy intervals.
    Zero LLM token consumption.
    """
    needed_delta = timedelta(minutes=duration_minutes)
    current_cursor = earliest_start

    # Filter and sort busy intervals that end after earliest_start
    sorted_busy = sorted(
        [slot for slot in busy_intervals if slot.end > earliest_start],
        key=lambda s: s.start,
    )

    for busy in sorted_busy:
        if busy.start > current_cursor:
            # Check gap between current_cursor and busy.start
            gap = busy.start - current_cursor
            if gap >= needed_delta:
                return TimeSlot(start=current_cursor, end=current_cursor + needed_delta)
        # Advance cursor if busy interval extends past cursor
        if busy.end > current_cursor:
            current_cursor = busy.end

    # If no more busy intervals within search horizon, schedule immediately after last
    max_search_time = earliest_start + timedelta(days=search_horizon_days)
    if current_cursor + needed_delta <= max_search_time:
        return TimeSlot(start=current_cursor, end=current_cursor + needed_delta)

    return None


def cascade_schedule_drift(
    missed_task: TaskSchedule,
    current_time: datetime,
    busy_intervals: List[TimeSlot],
    duration_minutes: int = 45,
) -> Tuple[TaskSchedule, ScheduleDriftLog]:
    """
    Zero-Token Drift Handler:
    Automatically reallocates a missed or cancelled study task to the next open
    calendar block without any LLM token usage.
    """
    new_slot = find_first_available_slot(
        earliest_start=current_time,
        duration_minutes=duration_minutes,
        busy_intervals=busy_intervals,
    )
    if not new_slot:
        # Fallback to tomorrow same time if horizon exceeded
        fallback_start = current_time + timedelta(days=1)
        new_slot = TimeSlot(start=fallback_start, end=fallback_start + timedelta(minutes=duration_minutes))

    drift_log = ScheduleDriftLog(
        id=str(uuid.uuid4()),
        task_id=missed_task.id,
        original_start=missed_task.scheduled_start,
        original_end=missed_task.scheduled_end,
        new_start=new_slot.start,
        new_end=new_slot.end,
        reason="SCHEDULE_DRIFT_CASCADE",
        timestamp=current_time,
    )

    updated_task = missed_task.model_copy(deep=True)
    updated_task.scheduled_start = new_slot.start
    updated_task.scheduled_end = new_slot.end
    updated_task.drift_count += 1

    return updated_task, drift_log


class GoogleCalendarSyncService:
    """Helper to dispatch quests as calendar events."""
    
    @staticmethod
    def format_quest_event_title(topic_title: str, quest_type: str = "STUDY") -> str:
        prefix = "[BOSS BATTLE]" if quest_type == "BOSS_BATTLE" else "[QUEST]"
        return f"{prefix} {topic_title}"

    @staticmethod
    def create_mock_event_payload(
        task_id: str,
        topic_title: str,
        start_time: datetime,
        end_time: datetime,
        quest_type: str = "STUDY",
    ) -> dict:
        summary = GoogleCalendarSyncService.format_quest_event_title(topic_title, quest_type)
        return {
            "id": f"cal_{task_id}",
            "summary": summary,
            "description": f"Academic mastery quest for {topic_title}. Socratic evaluation ready.",
            "start": {"dateTime": start_time.isoformat()},
            "end": {"dateTime": end_time.isoformat()},
            "status": "confirmed",
        }
