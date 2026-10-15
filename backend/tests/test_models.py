import pytest
from pydantic import ValidationError
from datetime import datetime, timezone

# We will import the models from backend.app.models
from backend.app.models.user import User, UserStats
from backend.app.models.ontology import OntologyNode, NodeTier, CourseTrack
from backend.app.models.schedule import TaskSchedule, QuestType


def test_user_model_defaults():
    user = User(
        username="learner_neo",
        email="neo@matrix.org",
    )
    assert user.level == 1
    assert user.xp == 0
    assert user.streak == 0
    assert user.stats.combat_readiness == 0.0


def test_ontology_node_validation():
    node = OntologyNode(
        id="cs101_recursion",
        course_id="cs101",
        title="Recursive Thinking & Call Stacks",
        prerequisites=["cs101_functions"],
        tier=NodeTier.SL,
        mastery=0.75,
        weight=0.15,
        estimated_minutes=45,
    )
    assert node.mastery == 0.75
    assert node.is_unlocked(prereq_masteries={"cs101_functions": 0.80}) is True
    assert node.is_unlocked(prereq_masteries={"cs101_functions": 0.50}) is False


def test_ontology_node_invalid_mastery():
    with pytest.raises(ValidationError):
        OntologyNode(
            id="bad_node",
            course_id="cs101",
            title="Bad",
            mastery=1.5,  # Must be <= 1.0
        )


def test_task_schedule_quest_types():
    task = TaskSchedule(
        id="task_1",
        user_id="user_123",
        node_id="cs101_recursion",
        quest_type=QuestType.BOSS_BATTLE,
        scheduled_start=datetime.now(timezone.utc),
        scheduled_end=datetime.now(timezone.utc),
    )
    assert task.quest_type == QuestType.BOSS_BATTLE
    assert task.is_completed is False
