from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
from backend.app.agents.socratic_engine import SocraticEvaluator, SocraticEvaluationResponse
from backend.app.services.gamification_service import evaluate_mastery_delta, calculate_exam_readiness
from backend.app.api.v1.endpoints.courses import CURRENT_TRACK
from backend.app.models.user import User

router = APIRouter()

# Active in-memory user
CURRENT_USER = User(
    username="CyberScholar",
    email="scholar@antigravity.ai",
    level=2,
    xp=180,
    xp_to_next_level=500,
    streak=3,
)

evaluator = SocraticEvaluator()


class FeynmanSubmission(BaseModel):
    node_id: str
    student_explanation: str
    hint_count: int = 0


class FeynmanResult(BaseModel):
    evaluation: SocraticEvaluationResponse
    delta_mastery: float
    new_mastery: float
    xp_awarded: int
    leveled_up: bool
    current_level: int
    current_xp: int
    xp_to_next_level: int
    new_combat_readiness: float


@router.get("/user")
async def get_current_user_profile():
    """Retrieve user level, XP, streak, and stats."""
    CURRENT_USER.stats.combat_readiness = calculate_exam_readiness(CURRENT_TRACK)
    return CURRENT_USER


@router.post("/evaluate", response_model=FeynmanResult)
async def evaluate_feynman_response(submission: FeynmanSubmission):
    """
    Socratic Feynman Evaluation Endpoint:
    1. Evaluates student explanation with token-bounded Socratic agent (<=150 tokens).
    2. Dynamically calculates delta mastery ΔM(v) based on accuracy and hint count.
    3. Updates node mastery and user gamification state (XP, level, readiness).
    """
    target_node = None
    for node in CURRENT_TRACK.nodes:
        if node.id == submission.node_id:
            target_node = node
            break
            
    if not target_node:
        raise HTTPException(status_code=404, detail="Topic node not found.")

    # Find prerequisite nodes for scaffolding support
    prereqs = [n for n in CURRENT_TRACK.nodes if n.id in target_node.prerequisites]

    evaluation = await evaluator.evaluate_explanation(
        student_explanation=submission.student_explanation,
        current_node=target_node,
        prerequisite_nodes=prereqs,
        hint_count=submission.hint_count,
    )

    delta_m = evaluate_mastery_delta(evaluation.accuracy, submission.hint_count)
    
    # Update node mastery
    target_node.mastery = min(1.0, round(target_node.mastery + delta_m, 3))
    
    # Gamification rewards
    base_xp = 50
    mastery_bonus = 150 if evaluation.is_mastered else 0
    xp_gained = base_xp + mastery_bonus
    leveled_up = CURRENT_USER.add_xp(xp_gained)

    new_readiness = calculate_exam_readiness(CURRENT_TRACK)
    CURRENT_USER.stats.combat_readiness = new_readiness
    if evaluation.is_mastered:
        CURRENT_USER.stats.total_nodes_completed += 1

    return FeynmanResult(
        evaluation=evaluation,
        delta_mastery=delta_m,
        new_mastery=target_node.mastery,
        xp_awarded=xp_gained,
        leveled_up=leveled_up,
        current_level=CURRENT_USER.level,
        current_xp=CURRENT_USER.xp,
        xp_to_next_level=CURRENT_USER.xp_to_next_level,
        new_combat_readiness=new_readiness,
    )
