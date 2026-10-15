import pytest
from datetime import datetime, timezone, timedelta
from backend.app.models.ontology import OntologyNode, NodeTier
from backend.app.services.dag_service import (
    DAGService,
    CycleDetectedException,
)


def create_sample_nodes():
    now = datetime.now(timezone.utc)
    # Node A: Foundational
    node_a = OntologyNode(
        id="calc_limits",
        course_id="math201",
        title="Limits & Continuity",
        prerequisites=[],
        tier=NodeTier.SL,
        mastery=0.85,  # Mastered
        weight=0.2,
        deadline=now + timedelta(days=2),
    )
    # Node B: Dependent on A
    node_b = OntologyNode(
        id="calc_derivatives",
        course_id="math201",
        title="Derivative Rules",
        prerequisites=["calc_limits"],
        tier=NodeTier.SL,
        mastery=0.40,  # In progress
        weight=0.3,
        deadline=now + timedelta(days=3),
    )
    # Node C: Dependent on B
    node_c = OntologyNode(
        id="calc_chain_rule",
        course_id="math201",
        title="Chain Rule & Implicit Diff",
        prerequisites=["calc_derivatives"],
        tier=NodeTier.HL,
        mastery=0.0,  # Unstarted
        weight=0.3,
        deadline=now + timedelta(days=5),
    )
    # Node D: Dependent on C
    node_d = OntologyNode(
        id="calc_taylor",
        course_id="math201",
        title="Taylor Series Approximations",
        prerequisites=["calc_chain_rule"],
        tier=NodeTier.EX,
        mastery=0.0,
        weight=0.2,
        deadline=now + timedelta(days=10),
    )
    return [node_a, node_b, node_c, node_d]


def test_dag_building_and_acyclicity():
    nodes = create_sample_nodes()
    dag = DAGService(nodes)
    assert dag.is_valid_dag() is True
    # In degree of calc_limits should be 0
    assert dag.graph.in_degree("calc_limits") == 0
    # Descendants of calc_derivatives: calc_chain_rule, calc_taylor -> 2
    assert len(dag.get_descendants("calc_derivatives")) == 2


def test_dag_cycle_detection():
    now = datetime.now(timezone.utc)
    # Create circular dependency A -> B -> A
    node_1 = OntologyNode(
        id="node_1",
        course_id="math",
        title="N1",
        prerequisites=["node_2"],
        deadline=now + timedelta(days=1),
    )
    node_2 = OntologyNode(
        id="node_2",
        course_id="math",
        title="N2",
        prerequisites=["node_1"],
        deadline=now + timedelta(days=1),
    )
    with pytest.raises(CycleDetectedException):
        DAGService([node_1, node_2])


def test_dag_unlock_states():
    nodes = create_sample_nodes()
    dag = DAGService(nodes)
    
    # calc_limits mastery is 0.85 (>= 0.70), so calc_derivatives should be UNLOCKED
    assert dag.is_node_unlocked("calc_derivatives") is True
    
    # calc_derivatives mastery is 0.40 (< 0.70), so calc_chain_rule should be LOCKED
    assert dag.is_node_unlocked("calc_chain_rule") is False


def test_deterministic_priority_scoring():
    nodes = create_sample_nodes()
    dag = DAGService(nodes)
    
    p_limits = dag.calculate_priority("calc_limits")
    p_derivatives = dag.calculate_priority("calc_derivatives")
    
    # Verify exact priority calculation follows P(v) formula
    # For calc_derivatives:
    # urgency = 1 / 3 = 0.333, weight = 0.3, descendants = 2, mastery deficit = 0.6
    # p = 0.35*(1/3) + 0.25*0.3 + 0.20*2 + 0.20*0.6 = 0.1167 + 0.075 + 0.40 + 0.12 = 0.7117
    assert round(p_derivatives, 3) == 0.712
    assert round(p_limits, 3) == 0.855
    
    # Ranked schedule with unlocked_only=True excludes completed nodes (mastery >= 0.70)
    # and locked nodes (chain rule), selecting calc_derivatives as top pending quest
    ranked = dag.get_ranked_schedule(unlocked_only=True)
    assert len(ranked) >= 1
    assert ranked[0][0].id == "calc_derivatives"
