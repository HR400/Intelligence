import pytest
from backend.app.models.ontology import OntologyNode, NodeTier, CourseTrack
from backend.app.services.gamification_service import (
    calculate_exam_readiness,
    calculate_boss_hp,
    evaluate_mastery_delta,
)


def test_exam_readiness_formula():
    """
    R_exam = sum_{i=1}^N (W_i * M_i)
    Normalized by sum(W_i)
    """
    nodes = [
        OntologyNode(id="n1", course_id="c1", title="N1", weight=0.4, mastery=0.5),
        OntologyNode(id="n2", course_id="c1", title="N2", weight=0.6, mastery=0.8),
    ]
    track = CourseTrack(id="c1", title="Track 1", nodes=nodes)
    r_exam = calculate_exam_readiness(track)
    # (0.4 * 0.5 + 0.6 * 0.8) / (0.4 + 0.6) = (0.2 + 0.48) / 1.0 = 0.68
    assert round(r_exam, 2) == 0.68


def test_boss_hp_formula():
    """
    Boss HP = Max HP * (1 - (sum_{v in Exam Scope} M_v) / |Exam Scope|)
    """
    nodes = [
        OntologyNode(id="n1", course_id="c1", title="N1", mastery=0.6),
        OntologyNode(id="n2", course_id="c1", title="N2", mastery=0.8),
    ]
    max_hp = 1000
    # Avg mastery in scope = (0.6 + 0.8) / 2 = 0.70
    # Remaining Boss HP = 1000 * (1 - 0.70) = 300
    boss_hp = calculate_boss_hp(nodes, max_hp=max_hp)
    assert boss_hp == 300


def test_evaluate_mastery_delta():
    """
    Delta mastery reward:
    Increases with clear explanations and low hint count,
    diminishes if student needed heavy scaffolding.
    """
    # Flawless explanation, 0 hints
    delta_flawless = evaluate_mastery_delta(accuracy=1.0, hint_count=0)
    assert delta_flawless >= 0.25

    # Adequate explanation, 3 hints used
    delta_scaffolded = evaluate_mastery_delta(accuracy=0.7, hint_count=3)
    assert 0.05 <= delta_scaffolded < delta_flawless

    # Misconceptions / failed
    delta_failed = evaluate_mastery_delta(accuracy=0.2, hint_count=4)
    assert delta_failed == 0.0
