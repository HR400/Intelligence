from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.models.ontology import SubjectOntology, NodeOntology, DepthTiers, TierDetail
from app.api.sync import shared_graph_engine, NODE_STORE

router = APIRouter(prefix="/ontology", tags=["Ontology"])

# Default academic syllabus seed: CS 202 Algorithms & Complexity Theory
SEED_NODES: List[NodeOntology] = [
    NodeOntology(
        node_id="algo_big_o",
        subject="cs202",
        title="Asymptotic Notation & Time Complexity",
        prerequisites=[],
        tier_unlocked="SL",
        mastery_score=0.90,
        xp_yield=150,
        status="UNLOCKED",
        depth_tiers=DepthTiers(
            SL=TierDetail(
                target="Surface Level Intuition",
                outcomes=["Define Big-O, Big-Omega, Big-Theta", "Order standard complexity classes"],
                estimated_minutes=30,
            ),
            HL=TierDetail(
                target="High Level Rigor",
                outcomes=["Formal limit definitions", "Solve non-trivial recurrence relations"],
                estimated_minutes=45,
            ),
            EX=TierDetail(
                target="Expert Level Proofs",
                outcomes=["Construct adversarial lower-bound adversary arguments"],
                estimated_minutes=60,
            ),
        ),
    ),
    NodeOntology(
        node_id="algo_divide_conquer",
        subject="cs202",
        title="Divide & Conquer Recurrences",
        prerequisites=["algo_big_o"],
        tier_unlocked="SL",
        mastery_score=0.80,
        xp_yield=200,
        status="UNLOCKED",
        depth_tiers=DepthTiers(
            SL=TierDetail(
                target="Surface Level Intuition",
                outcomes=["Trace MergeSort partition steps", "State Master Theorem cases"],
                estimated_minutes=35,
            ),
            HL=TierDetail(
                target="High Level Rigor",
                outcomes=["Prove recursion tree summation bounds", "Analyze QuickSort randomized pivot expectation"],
                estimated_minutes=50,
            ),
            EX=TierDetail(
                target="Expert Level Proofs",
                outcomes=["Derive Akra-Bazzi method for unequal partition splits"],
                estimated_minutes=70,
            ),
        ),
    ),
    NodeOntology(
        node_id="algo_dynamic_programming",
        subject="cs202",
        title="Dynamic Programming & Optimal Substructure",
        prerequisites=["algo_divide_conquer"],
        tier_unlocked="HL",
        mastery_score=0.35,
        xp_yield=250,
        status="LOCKED",
        depth_tiers=DepthTiers(
            SL=TierDetail(
                target="Surface Level Intuition",
                outcomes=["Identify overlapping subproblems", "Memoization vs Tabulation"],
                estimated_minutes=45,
            ),
            HL=TierDetail(
                target="High Level Rigor",
                outcomes=["Formalize Bellman recurrence equations", "Reconstruct solutions in 0/1 Knapsack & LCS"],
                estimated_minutes=60,
            ),
            EX=TierDetail(
                target="Expert Level Proofs",
                outcomes=["Convex Hull Optimization and Knuth-Yao DP speedups"],
                estimated_minutes=90,
            ),
        ),
    ),
    NodeOntology(
        node_id="algo_graph_traversals",
        subject="cs202",
        title="Graph Traversals & Topological Ordering",
        prerequisites=["algo_divide_conquer"],
        tier_unlocked="HL",
        mastery_score=0.20,
        xp_yield=200,
        status="LOCKED",
        depth_tiers=DepthTiers(
            SL=TierDetail(
                target="Surface Level Intuition",
                outcomes=["BFS vs DFS mechanics", "Adjacency matrix vs list representations"],
                estimated_minutes=40,
            ),
            HL=TierDetail(
                target="High Level Rigor",
                outcomes=["Tarjan's strongly connected components", "Kahn's in-degree topological sort"],
                estimated_minutes=55,
            ),
            EX=TierDetail(
                target="Expert Level Proofs",
                outcomes=["Prove correctness of 2-SAT linear time resolution via SCC condensation"],
                estimated_minutes=85,
            ),
        ),
    ),
    NodeOntology(
        node_id="algo_np_completeness",
        subject="cs202",
        title="NP-Completeness & Polynomial Reductions",
        prerequisites=["algo_dynamic_programming", "algo_graph_traversals"],
        tier_unlocked="EX",
        mastery_score=0.0,
        xp_yield=300,
        status="LOCKED",
        depth_tiers=DepthTiers(
            SL=TierDetail(
                target="Surface Level Intuition",
                outcomes=["Explain P vs NP distinction", "Understand certificate verification"],
                estimated_minutes=50,
            ),
            HL=TierDetail(
                target="High Level Rigor",
                outcomes=["Construct polynomial-time reduction from 3-SAT to Vertex Cover"],
                estimated_minutes=75,
            ),
            EX=TierDetail(
                target="Expert Level Proofs",
                outcomes=["Cook-Levin theorem circuit-SAT completeness derivation"],
                estimated_minutes=110,
            ),
        ),
    ),
]

SEED_SUBJECT = SubjectOntology(
    subject_id="cs202",
    title="CS 202: Algorithms & Complexity Theory",
    nodes=SEED_NODES,
    boss_metadata={
        "boss_name": "Midterm Algorithmic Colossus",
        "boss_type": "MINI_BOSS",
        "max_hp": "500",
        "exam_date": "2026-11-15T09:00:00Z",
    },
)

# Initialize in-memory NODE_STORE and shared_graph_engine
for node in SEED_NODES:
    NODE_STORE[node.node_id] = {
        "_id": node.node_id,
        "subject": node.subject,
        "title": node.title,
        "prerequisites": node.prerequisites,
        "tier_unlocked": node.tier_unlocked,
        "mastery_score": node.mastery_score,
        "xp_yield": node.xp_yield,
        "status": node.status,
        "depth_tiers": node.depth_tiers.model_dump(),
    }
shared_graph_engine.build_graph(list(NODE_STORE.values()))


@router.get("/subject/{subject_id}", response_model=SubjectOntology)
async def get_subject_ontology(subject_id: str):
    """Retrieve subject ontology nodes and unlock states."""
    if subject_id.lower() != "cs202":
        raise HTTPException(status_code=404, detail="Subject not found")

    # Refresh current status from NODE_STORE
    updated_nodes: List[NodeOntology] = []
    unlocked_ids = set(shared_graph_engine.get_unlocked_nodes())

    for node in SEED_NODES:
        stored = NODE_STORE.get(node.node_id, {})
        mastery = stored.get("mastery_score", node.mastery_score)
        # Prerequisite check
        is_unlocked = node.node_id in unlocked_ids or len(node.prerequisites) == 0
        status = "COMPLETED" if mastery >= 0.8 else ("UNLOCKED" if is_unlocked else "LOCKED")

        updated_nodes.append(
            NodeOntology(
                node_id=node.node_id,
                subject=node.subject,
                title=node.title,
                prerequisites=node.prerequisites,
                tier_unlocked=node.tier_unlocked,
                mastery_score=mastery,
                xp_yield=node.xp_yield,
                status=status,
                depth_tiers=node.depth_tiers,
            )
        )

    return SubjectOntology(
        subject_id=SEED_SUBJECT.subject_id,
        title=SEED_SUBJECT.title,
        nodes=updated_nodes,
        boss_metadata=SEED_SUBJECT.boss_metadata,
    )


@router.get("/readiness/{subject_id}")
async def get_subject_readiness(subject_id: str):
    """Compute aggregate syllabus combat readiness R_exam (0.0 to 100.0)."""
    node_ids = list(NODE_STORE.keys())
    readiness = shared_graph_engine.compute_exam_readiness(node_ids)
    return {
        "subject_id": subject_id,
        "combat_readiness": readiness,
        "node_count": len(node_ids),
        "unlocked_nodes": shared_graph_engine.get_unlocked_nodes(),
    }


@router.get("/nodes/{node_id}", response_model=NodeOntology)
async def get_node_by_id(node_id: str):
    for node in SEED_NODES:
        if node.node_id == node_id:
            stored = NODE_STORE.get(node_id, {})
            node.mastery_score = stored.get("mastery_score", node.mastery_score)
            node.status = stored.get("status", node.status)
            return node
    raise HTTPException(status_code=404, detail="Node not found")
