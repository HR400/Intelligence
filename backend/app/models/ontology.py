from enum import Enum
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime, timezone


class NodeTier(str, Enum):
    SL = "SL"  # Standard Level
    HL = "HL"  # Higher Level
    EX = "EX"  # Extension


class OntologyNode(BaseModel):
    id: str
    course_id: str
    title: str
    summary: str = ""
    prerequisites: List[str] = Field(default_factory=list)
    tier: NodeTier = NodeTier.SL
    mastery: float = Field(default=0.0, ge=0.0, le=1.0)
    weight: float = Field(default=1.0, ge=0.0)
    estimated_minutes: int = 45
    deadline: Optional[datetime] = None
    tags: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    def is_unlocked(self, prereq_masteries: Dict[str, float], threshold: float = 0.70) -> bool:
        """A node is unlocked if and only if all parents have mastery >= threshold (0.7)."""
        if not self.prerequisites:
            return True
        for prereq_id in self.prerequisites:
            if prereq_masteries.get(prereq_id, 0.0) < threshold:
                return False
        return True


class CourseTrack(BaseModel):
    id: str
    title: str
    description: str = ""
    total_credits: float = 1.0
    exam_date: Optional[datetime] = None
    nodes: List[OntologyNode] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    def compute_combat_readiness(self) -> float:
        """
        Combat Readiness R_exam = sum_{i=1}^N (W_i * M_i) / sum(W_i)
        Normalized to [0.0, 1.0]
        """
        if not self.nodes:
            return 0.0
        total_weight = sum(node.weight for node in self.nodes)
        if total_weight <= 0:
            return 0.0
        weighted_mastery = sum(node.weight * node.mastery for node in self.nodes)
        return min(1.0, max(0.0, weighted_mastery / total_weight))
