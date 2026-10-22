from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Literal


class TierDetail(BaseModel):
    target: str
    outcomes: List[str]
    estimated_minutes: int
    resources: Optional[Dict[str, List[str]]] = None


class DepthTiers(BaseModel):
    SL: TierDetail
    HL: TierDetail
    EX: TierDetail


class NodeOntology(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    node_id: str = Field(..., alias="_id")
    subject: str
    title: str
    prerequisites: List[str] = Field(default_factory=list)
    tier_unlocked: Literal["SL", "HL", "EX"] = "SL"
    mastery_score: float = Field(default=0.0, ge=0.0, le=1.0)
    xp_yield: int = 150
    depth_tiers: DepthTiers
    status: Literal["LOCKED", "UNLOCKED", "COMPLETED"] = "LOCKED"


class SubjectOntology(BaseModel):
    subject_id: str
    title: str
    nodes: List[NodeOntology]
    boss_metadata: Dict[str, str] = Field(default_factory=dict)  # Main Boss Exam metadata
