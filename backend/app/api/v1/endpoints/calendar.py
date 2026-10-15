from fastapi import APIRouter
from typing import List, Dict, Any
from datetime import datetime, timezone, timedelta
from backend.app.models.schedule import TaskSchedule, QuestType
from backend.app.services.calendar_service import cascade_schedule_drift, TimeSlot, GoogleCalendarSyncService
from backend.app.api.v1.endpoints.courses import CURRENT_TRACK

router = APIRouter()

now = datetime.now(timezone.utc)

# Initial sample schedule
SCHEDULE_STORE: List[TaskSchedule] = [
    TaskSchedule(
        id="task_1",
        user_id="user_cyberscholar",
        node_id="algo_binary_heaps",
        quest_type=QuestType.STUDY,
        scheduled_start=now + timedelta(hours=2),
        scheduled_end=now + timedelta(hours=3),
    ),
    TaskSchedule(
        id="task_2",
        user_id="user_cyberscholar",
        node_id="algo_dynamic_programming",
        quest_type=QuestType.STUDY,
        scheduled_start=now + timedelta(days=1, hours=4),
        scheduled_end=now + timedelta(days=1, hours=5),
    ),
    TaskSchedule(
        id="task_3",
        user_id="user_cyberscholar",
        node_id="algo_divide_conquer",
        quest_type=QuestType.BOSS_BATTLE,
        scheduled_start=now + timedelta(days=2, hours=2),
        scheduled_end=now + timedelta(days=2, hours=3, minutes=30),
    ),
]


@router.get("/events")
async def get_calendar_events() -> List[Dict[str, Any]]:
    """Retrieve schedule items formatted as Google Calendar events."""
    node_dict = {n.id: n.title for n in CURRENT_TRACK.nodes}
    events = []
    for task in SCHEDULE_STORE:
        title = node_dict.get(task.node_id, task.node_id)
        event = GoogleCalendarSyncService.create_mock_event_payload(
            task_id=task.id,
            topic_title=title,
            start_time=task.scheduled_start,
            end_time=task.scheduled_end,
            quest_type=task.quest_type.value,
        )
        event["is_completed"] = task.is_completed
        event["drift_count"] = task.drift_count
        events.append(event)
    return events


@router.post("/drift/cascade/{task_id}")
async def trigger_drift_cascade(task_id: str):
    """
    Simulates a missed study block and deterministically shifts the event
    to the next available calendar window using zero LLM tokens.
    """
    target_task = None
    for t in SCHEDULE_STORE:
        if t.id == task_id:
            target_task = t
            break

    if not target_task:
        return {"error": "Task not found."}

    # Simulate busy intervals around current time
    busy = [
        TimeSlot(start=now, end=now + timedelta(hours=1)),
        TimeSlot(start=now + timedelta(hours=3), end=now + timedelta(hours=5)),
    ]

    updated_task, drift_log = cascade_schedule_drift(
        missed_task=target_task,
        current_time=now,
        busy_intervals=busy,
        duration_minutes=45,
    )

    # Update in-store task
    for idx, t in enumerate(SCHEDULE_STORE):
        if t.id == task_id:
            SCHEDULE_STORE[idx] = updated_task
            break

    return {
        "status": "DRIFT_REALLOCATED",
        "tokens_spent": 0,
        "updated_task": updated_task,
        "drift_log": drift_log,
    }
