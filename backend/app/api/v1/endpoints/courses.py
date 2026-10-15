from fastapi import APIRouter, HTTPException
from typing import List
from backend.app.models.ontology import CourseTrack, OntologyNode
from backend.app.services.syllabus_service import SyllabusParserService
from backend.app.services.gamification_service import calculate_exam_readiness

router = APIRouter()

# In-memory store initialized with seed track
CURRENT_TRACK: CourseTrack = SyllabusParserService.get_seed_course_track()


@router.get("/track", response_model=CourseTrack)
async def get_current_course_track():
    """Retrieve active course track, ontology nodes, and syllabus scope."""
    return CURRENT_TRACK


@router.get("/track/readiness")
async def get_track_combat_readiness():
    """Returns the current aggregate combat readiness R_exam."""
    readiness = calculate_exam_readiness(CURRENT_TRACK)
    return {
        "course_id": CURRENT_TRACK.id,
        "combat_readiness": round(readiness, 4),
        "percentage": int(round(readiness * 100)),
    }


@router.get("/nodes/{node_id}", response_model=OntologyNode)
async def get_node_by_id(node_id: str):
    """Retrieve a single ontology node by ID."""
    for node in CURRENT_TRACK.nodes:
        if node.id == node_id:
            return node
    raise HTTPException(status_code=404, detail="Ontology node not found.")
