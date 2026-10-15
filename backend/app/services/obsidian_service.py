import json
import yaml
from typing import List, Tuple, Dict, Any
from backend.app.models.ontology import OntologyNode, NodeTier


def export_node_to_markdown(node: OntologyNode) -> str:
    """Export an OntologyNode to a Markdown string with YAML frontmatter."""
    frontmatter = {
        "id": node.id,
        "course_id": node.course_id,
        "title": node.title,
        "tier": node.tier.value,
        "mastery": round(node.mastery, 2),
        "weight": node.weight,
        "estimated_minutes": node.estimated_minutes,
        "prerequisites": node.prerequisites,
        "tags": node.tags or [f"tier/{node.tier.value.lower()}"],
    }
    
    yaml_header = yaml.dump(frontmatter, sort_keys=False).strip()
    
    content = f"""---
{yaml_header}
---

# {node.title}

**Tier**: `{node.tier.value}` | **Mastery**: `{int(node.mastery * 100)}%` | **Est. Time**: `{node.estimated_minutes}m`

## Concept Overview
{node.summary or "Detailed conceptual breakdown and study notes."}

## Prerequisites
{chr(10).join(f"- [[{prereq}]]" for prereq in node.prerequisites) if node.prerequisites else "None (Foundational Topic)"}

## Socratic Objectives
- [ ] Articulate core intuition in simple terms (Feynman Technique)
- [ ] Connect concept with practical implementation
- [ ] Pass the Boss Battle evaluation
"""
    return content


def generate_obsidian_canvas(nodes: List[OntologyNode], edges: List[Tuple[str, str]]) -> str:
    """
    Generate an Obsidian .canvas JSON graph layout from ontology nodes and edges.
    Arranges nodes in a readable 2D grid based on topological tiers.
    """
    canvas_nodes: List[Dict[str, Any]] = []
    canvas_edges: List[Dict[str, Any]] = []

    # Map colors to tiers:
    # 1: Red (EX Extension), 4: Green (Mastered >= 0.7), 5: Cyan/Blue (SL), 6: Purple (HL)
    def get_color(node: OntologyNode) -> str:
        if node.mastery >= 0.70:
            return "4"  # Green
        if node.tier == NodeTier.EX:
            return "1"  # Red
        if node.tier == NodeTier.HL:
            return "6"  # Purple
        return "5"      # Cyan/Blue

    # Simple 2D layout calculation: group by level/incoming edge depth
    # Map node id to index for horizontal/vertical placement
    node_map = {n.id: n for n in nodes}
    x_spacing = 380
    y_spacing = 220
    
    # Calculate simple column index based on prerequisites count
    columns: Dict[int, List[OntologyNode]] = {}
    for node in nodes:
        col = len(node.prerequisites)
        columns.setdefault(col, []).append(node)

    for col_idx, col_nodes in columns.items():
        for row_idx, node in enumerate(col_nodes):
            x = col_idx * x_spacing
            y = row_idx * y_spacing
            color_id = get_color(node)
            
            canvas_nodes.append({
                "id": node.id,
                "x": x,
                "y": y,
                "width": 300,
                "height": 160,
                "color": color_id,
                "type": "text",
                "text": f"### {node.title}\n**Tier**: {node.tier.value} | **Mastery**: {int(node.mastery * 100)}%\n\n{node.summary[:100]}..." if node.summary else f"### {node.title}\n**Tier**: {node.tier.value} | **Mastery**: {int(node.mastery * 100)}%",
            })

    for idx, (source_id, target_id) in enumerate(edges):
        canvas_edges.append({
            "id": f"edge_{idx}_{source_id}_{target_id}",
            "fromNode": source_id,
            "fromSide": "right",
            "toNode": target_id,
            "toSide": "left",
            "color": "5",
        })

    canvas_data = {
        "nodes": canvas_nodes,
        "edges": canvas_edges,
    }
    return json.dumps(canvas_data, indent=2)
