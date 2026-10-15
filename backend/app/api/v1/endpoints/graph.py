from fastapi import APIRouter
from typing import List, Dict, Any
from backend.app.services.dag_service import DAGService
from backend.app.api.v1.endpoints.courses import CURRENT_TRACK

router = APIRouter()


@router.get("/status")
async def get_graph_status() -> Dict[str, Any]:
    """
    Returns NetworkX DAG analysis:
    - Unlock state for each node (unlocked iff parents have mastery >= 0.70)
    - Calculated Priority P(v) for all nodes
    - Ranked study schedule
    - Edge list for UI visualization
    """
    dag = DAGService(CURRENT_TRACK.nodes)
    
    unlock_states: Dict[str, bool] = {}
    priorities: Dict[str, float] = {}
    descendants: Dict[str, List[str]] = {}

    for node in CURRENT_TRACK.nodes:
        unlock_states[node.id] = dag.is_node_unlocked(node.id)
        priorities[node.id] = round(dag.calculate_priority(node.id), 4)
        descendants[node.id] = list(dag.get_descendants(node.id))

    ranked = dag.get_ranked_schedule(unlocked_only=False)
    ranked_payload = [
        {
            "node_id": node.id,
            "title": node.title,
            "tier": node.tier.value,
            "mastery": node.mastery,
            "is_unlocked": unlock_states[node.id],
            "priority": score,
        }
        for node, score in ranked
    ]

    # Collect edges
    edges = []
    for node in CURRENT_TRACK.nodes:
        for prereq in node.prerequisites:
            edges.append({"source": prereq, "target": node.id})

    return {
        "course_id": CURRENT_TRACK.id,
        "is_acyclic": dag.is_valid_dag(),
        "unlock_states": unlock_states,
        "priorities": priorities,
        "descendants": descendants,
        "ranked_schedule": ranked_payload,
        "edges": edges,
    }
