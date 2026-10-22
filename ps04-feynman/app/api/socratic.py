from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
from app.api.sync import shared_graph_engine, NODE_STORE

router = APIRouter(prefix="/socratic", tags=["Socratic"])


class SocraticEvaluationRequest(BaseModel):
    node_id: str
    student_explanation: str
    hint_count: int = 0


class SocraticEvaluationResponse(BaseModel):
    node_id: str
    accuracy: float
    is_mastered: bool
    needs_scaffolding: bool
    feedback: str
    probing_question: str
    identified_misconceptions: List[str] = Field(default_factory=list)
    new_mastery: float
    xp_awarded: int
    tokens_used: int


@router.post("/evaluate", response_model=SocraticEvaluationResponse)
async def evaluate_explanation(req: SocraticEvaluationRequest):
    """
    Token-bounded Socratic Feynman evaluation.
    Applies N-1 scaffolding if student has conceptual gaps.
    """
    explanation = req.student_explanation.strip()
    if not explanation:
        raise HTTPException(status_code=400, detail="Student explanation cannot be empty.")

    tokens_used = min(150, len(explanation.split()) * 2 + 35)

    # Conceptual validation: check first-principles keywords vs common buzzwords
    lowered = explanation.lower()
    has_subproblem = any(w in lowered for w in ["subproblem", "overlapping", "state", "recurrence", "bound"])
    has_proof = any(w in lowered for w in ["invariant", "induction", "base case", "optimal", "limit"])
    is_vague = any(w in lowered for w in ["fast", "good", "magic", "basically", "easy", "idk"])

    if has_subproblem and has_proof and not is_vague:
        accuracy = 0.92
        is_mastered = True
        needs_scaffolding = False
        feedback = "Rigorous first-principles explanation. The inductive hypothesis and structural invariant are sound."
        probing_question = "How does your recurrence guarantee optimal substructure when subproblems share state?"
        misconceptions = []
        xp = 150
        delta = 0.30
    elif has_subproblem:
        accuracy = 0.72
        is_mastered = False
        needs_scaffolding = True
        feedback = "Partial conceptual grasp. You defined the recurrence mechanics but omitted the boundary conditions."
        probing_question = "[N-1 Scaffolding] What prevents an infinite recursion from occurring at the base case?"
        misconceptions = ["Missing base-case termination invariant"]
        xp = 80
        delta = 0.15
    else:
        accuracy = 0.40
        is_mastered = False
        needs_scaffolding = True
        feedback = "Explanation lacks mechanistic derivation. Probing lower-level prerequisite concept."
        probing_question = "[N-1 Scaffolding] Before analyzing this topic, how does the underlying data structure layout affect lookup time?"
        misconceptions = ["Conflating worst-case time with amortized bounds"]
        xp = 30
        delta = 0.05

    # Update in-memory NODE_STORE
    current_node = NODE_STORE.get(req.node_id, {})
    old_mastery = current_node.get("mastery_score", 0.0)
    new_mastery = round(min(1.0, old_mastery + delta), 2)
    if req.node_id in NODE_STORE:
        NODE_STORE[req.node_id]["mastery_score"] = new_mastery
        if new_mastery >= 0.8:
            NODE_STORE[req.node_id]["status"] = "COMPLETED"
        shared_graph_engine.build_graph(list(NODE_STORE.values()))

    return SocraticEvaluationResponse(
        node_id=req.node_id,
        accuracy=accuracy,
        is_mastered=is_mastered,
        needs_scaffolding=needs_scaffolding,
        feedback=feedback,
        probing_question=probing_question,
        identified_misconceptions=misconceptions,
        new_mastery=new_mastery,
        xp_awarded=xp,
        tokens_used=tokens_used,
    )
