import pytest
from app.services.graph_engine import GraphEngine


@pytest.fixture
def sample_nodes():
    return [
        {
            "_id": "node_big_o",
            "title": "Asymptotic Notation",
            "xp_yield": 150,
            "mastery_score": 0.85,
            "status": "UNLOCKED",
            "prerequisites": [],
        },
        {
            "_id": "node_divide_conquer",
            "title": "Divide & Conquer",
            "xp_yield": 200,
            "mastery_score": 0.80,
            "status": "UNLOCKED",
            "prerequisites": ["node_big_o"],
        },
        {
            "_id": "node_dynamic_prog",
            "title": "Dynamic Programming",
            "xp_yield": 250,
            "mastery_score": 0.30,  # Unaddressed error (< 0.5)
            "status": "LOCKED",
            "prerequisites": ["node_divide_conquer"],
        },
        {
            "_id": "node_graphs",
            "title": "Graph Traversals",
            "xp_yield": 200,
            "mastery_score": 0.10,  # Unaddressed error (< 0.5)
            "status": "LOCKED",
            "prerequisites": ["node_divide_conquer"],
        },
        {
            "_id": "node_np",
            "title": "NP-Completeness",
            "xp_yield": 300,
            "mastery_score": 0.0,
            "status": "LOCKED",
            "prerequisites": ["node_dynamic_prog", "node_graphs"],
        },
    ]


def test_build_graph_and_acyclicity(sample_nodes):
    engine = GraphEngine()
    engine.build_graph(sample_nodes)

    assert engine.graph.number_of_nodes() == 5
    assert engine.graph.number_of_edges() == 5
    assert engine.is_acyclic() is True
    topo = engine.topological_sort()
    assert topo[0] == "node_big_o"
    assert topo[-1] == "node_np"


def test_priority_scoring_blocked_count(sample_nodes):
    engine = GraphEngine()
    engine.build_graph(sample_nodes)

    # node_divide_conquer has 2 successors: node_dynamic_prog and node_graphs.
    # Both are LOCKED in sample_nodes, so blocked_count = 2.
    # priority = ((weight * urgency) / (time_remaining_hours + epsilon)) * (1 + blocked_count)
    weight = 200
    urgency = 1.5
    hours = 12.0
    expected = round(((200 * 1.5) / (12.0 + 0.01)) * (1 + 2), 4)

    score = engine.calculate_priority_score("node_divide_conquer", hours, weight, urgency)
    assert score == expected


def test_compute_exam_readiness_with_penalty(sample_nodes):
    engine = GraphEngine()
    engine.build_graph(sample_nodes)

    exam_nodes = ["node_big_o", "node_divide_conquer", "node_dynamic_prog"]
    # node_big_o: w=150, m=0.85 -> 127.5
    # node_divide_conquer: w=200, m=0.80 -> 160.0
    # node_dynamic_prog: w=250, m=0.30 -> 75.0 (unaddressed error: m < 0.5)
    # total_weight = 600
    # weighted_mastery = 362.5
    # base_score = 362.5 / 600 = 0.6041666...
    # error_penalty = 1.0 - (1 / 3) = 2/3 = 0.666666...
    # readiness = round(0.6041666... * 0.666666... * 100, 2) = round(40.2777..., 2) = 40.28

    readiness = engine.compute_exam_readiness(exam_nodes)
    assert readiness == 40.28


def test_compute_exam_readiness_perfect_score():
    engine = GraphEngine()
    engine.build_graph([
        {"_id": "a", "title": "A", "xp_yield": 100, "mastery_score": 1.0, "status": "COMPLETED"},
        {"_id": "b", "title": "B", "xp_yield": 200, "mastery_score": 1.0, "status": "COMPLETED"},
    ])
    readiness = engine.compute_exam_readiness(["a", "b"])
    assert readiness == 100.0


def test_get_unlocked_nodes(sample_nodes):
    engine = GraphEngine()
    engine.build_graph(sample_nodes)

    unlocked = engine.get_unlocked_nodes()
    # node_big_o: no prereqs -> unlocked
    # node_divide_conquer: prereq node_big_o has mastery 0.85 >= 0.8 -> unlocked
    # node_dynamic_prog: prereq node_divide_conquer has mastery 0.80 >= 0.8 -> unlocked
    # node_graphs: prereq node_divide_conquer has mastery 0.80 >= 0.8 -> unlocked
    # node_np: prereqs node_dynamic_prog (0.3) and node_graphs (0.1) < 0.8 -> NOT unlocked
    assert "node_big_o" in unlocked
    assert "node_divide_conquer" in unlocked
    assert "node_dynamic_prog" in unlocked
    assert "node_graphs" in unlocked
    assert "node_np" not in unlocked


def test_get_descendants(sample_nodes):
    engine = GraphEngine()
    engine.build_graph(sample_nodes)

    desc = engine.get_descendants("node_divide_conquer")
    assert set(desc) == {"node_dynamic_prog", "node_graphs", "node_np"}
