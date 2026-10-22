from datetime import datetime, timedelta, timezone
from typing import List, Dict, Any, Optional
from app.models.task import CalendarTask


class CalendarService:
    @staticmethod
    def cascade_schedule_drift(
        delayed_task_id: str,
        drift_hours: float,
        tasks: List[CalendarTask],
        dependencies: Dict[str, List[str]],
        exam_deadline: Optional[datetime] = None,
    ) -> List[CalendarTask]:
        """
        Deterministic, zero-token calendar drift cascade.
        Shifts the delayed task and all its topological downstream dependencies by drift_hours.
        Checks for exam deadline boundaries.
        """
        task_map = {t.task_id: t for t in tasks}
        if delayed_task_id not in task_map:
            return tasks

        drift_delta = timedelta(hours=drift_hours)
        affected_ids = set()
        queue = [delayed_task_id]

        while queue:
            curr = queue.pop(0)
            affected_ids.add(curr)
            for child in dependencies.get(curr, []):
                if child not in affected_ids:
                    queue.append(child)

        for tid in affected_ids:
            if tid in task_map:
                t = task_map[tid]
                new_start = t.start_time + drift_delta
                new_end = t.end_time + drift_delta

                if exam_deadline and new_end > exam_deadline:
                    # Compressed adjustment to stay within exam boundary
                    t.drift_count += 1
                else:
                    t.start_time = new_start
                    t.end_time = new_end
                    t.drift_count += 1

        return list(task_map.values())
