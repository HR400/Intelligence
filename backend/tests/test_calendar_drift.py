import pytest
from datetime import datetime, timezone, timedelta
from backend.app.models.schedule import TaskSchedule, QuestType
from backend.app.services.calendar_service import (
    find_first_available_slot,
    cascade_schedule_drift,
    TimeSlot,
)


def test_find_first_available_slot():
    base_time = datetime(2026, 10, 16, 9, 0, tzinfo=timezone.utc)
    # Busy blocks: 09:00 - 10:00, 10:30 - 11:30
    busy_intervals = [
        TimeSlot(start=base_time, end=base_time + timedelta(hours=1)),
        TimeSlot(start=base_time + timedelta(minutes=90), end=base_time + timedelta(minutes=150)),
    ]
    
    # We need a 45 min slot starting from base_time
    # Gap between 10:00 and 10:30 is only 30 min (not enough for 45 min)
    # Next free slot should be at 11:30
    slot = find_first_available_slot(
        earliest_start=base_time,
        duration_minutes=45,
        busy_intervals=busy_intervals,
    )
    assert slot is not None
    assert slot.start == base_time + timedelta(minutes=150)
    assert slot.end == base_time + timedelta(minutes=195)


def test_cascade_schedule_drift_zero_token():
    base_time = datetime(2026, 10, 16, 10, 0, tzinfo=timezone.utc)
    
    # Task that was missed (scheduled in the past)
    missed_task = TaskSchedule(
        id="task_drift_1",
        user_id="user_1",
        node_id="calc_derivatives",
        quest_type=QuestType.STUDY,
        scheduled_start=base_time - timedelta(hours=2),
        scheduled_end=base_time - timedelta(hours=1),
        is_completed=False,
    )
    
    # Current busy schedule: 10:00 to 11:00
    busy = [
        TimeSlot(start=base_time, end=base_time + timedelta(hours=1))
    ]
    
    reallocated_task, drift_log = cascade_schedule_drift(
        missed_task=missed_task,
        current_time=base_time,
        busy_intervals=busy,
        duration_minutes=60,
    )
    
    assert reallocated_task.scheduled_start >= base_time + timedelta(hours=1)
    assert reallocated_task.drift_count == 1
    assert drift_log.task_id == "task_drift_1"
    assert drift_log.reason == "SCHEDULE_DRIFT_CASCADE"
