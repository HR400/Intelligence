import json
import pytest
from backend.app.models.ontology import OntologyNode, NodeTier
from backend.app.services.obsidian_service import export_node_to_markdown, generate_obsidian_canvas


def test_export_node_to_markdown():
    node = OntologyNode(
        id="cs101_recursion",
        course_id="cs101",
        title="Recursive Thinking & Call Stacks",
        prerequisites=["cs101_functions"],
        tier=NodeTier.SL,
        mastery=0.85,
        weight=0.15,
        estimated_minutes=45,
        summary="Understanding base cases and recursive steps.",
    )
    md_content = export_node_to_markdown(node)
    assert md_content.startswith("---")
    assert "id: cs101_recursion" in md_content
    assert "tier: SL" in md_content
    assert "mastery: 0.85" in md_content
    assert "cs101_functions" in md_content
    assert "# Recursive Thinking & Call Stacks" in md_content


def test_generate_obsidian_canvas():
    nodes = [
        OntologyNode(
            id="node_a",
            course_id="cs101",
            title="Node A",
            prerequisites=[],
            tier=NodeTier.SL,
            mastery=1.0,
            weight=0.5,
        ),
        OntologyNode(
            id="node_b",
            course_id="cs101",
            title="Node B",
            prerequisites=["node_a"],
            tier=NodeTier.HL,
            mastery=0.4,
            weight=0.5,
        ),
    ]
    edges = [("node_a", "node_b")]
    canvas_json_str = generate_obsidian_canvas(nodes, edges)
    canvas = json.loads(canvas_json_str)

    assert "nodes" in canvas
    assert "edges" in canvas
    assert len(canvas["nodes"]) == 2
    assert len(canvas["edges"]) == 1
    assert canvas["edges"][0]["fromNode"] == "node_a"
    assert canvas["edges"][0]["toNode"] == "node_b"
