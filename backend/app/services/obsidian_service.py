import json
import yaml
from pathlib import Path
from datetime import datetime, timezone
from typing import List, Tuple, Dict, Any, Optional
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

    def get_color(node: OntologyNode) -> str:
        if node.mastery >= 0.70:
            return "4"  # Green
        if node.tier == NodeTier.EX:
            return "1"  # Red
        if node.tier == NodeTier.HL:
            return "6"  # Purple
        return "5"      # Cyan/Blue

    x_spacing = 380
    y_spacing = 220

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


def populate_vault_files(vault_path: Path, nodes: List[OntologyNode], edges: List[Tuple[str, str]]) -> Dict[str, Any]:
    """
    Writes all syllabus markdown notes and the visual .canvas file to the actual Obsidian Vault.
    Target: ~/learning-vault/Subjects/Algorithms/ and ~/learning-vault/viz/
    """
    algorithms_dir = vault_path / "Subjects" / "Algorithms"
    viz_dir = vault_path / "viz"
    inbox_dir = vault_path / "PDF_Inbox"
    agents_dir = vault_path / ".pi" / "agents"

    algorithms_dir.mkdir(parents=True, exist_ok=True)
    viz_dir.mkdir(parents=True, exist_ok=True)
    inbox_dir.mkdir(parents=True, exist_ok=True)
    agents_dir.mkdir(parents=True, exist_ok=True)

    written_notes = []
    for node in nodes:
        note_file = algorithms_dir / f"{node.id}.md"
        content = export_node_to_markdown(node)
        note_file.write_text(content, encoding="utf-8")
        written_notes.append(str(note_file.relative_to(vault_path)))

    # Write .canvas file
    canvas_file = viz_dir / "course_curriculum.canvas"
    canvas_json = generate_obsidian_canvas(nodes, edges)
    canvas_file.write_text(canvas_json, encoding="utf-8")

    return {
        "status": "success",
        "notes_written": len(written_notes),
        "canvas_path": str(canvas_file.relative_to(vault_path)),
        "written_files": written_notes,
    }


def get_vault_telemetry(vault_path: Path) -> Dict[str, Any]:
    """
    Inspects ~/learning-vault and returns status of notes, canvas, and pi agent.
    """
    subjects_dir = vault_path / "Subjects"
    algorithms_dir = subjects_dir / "Algorithms"
    canvas_file = vault_path / "viz" / "course_curriculum.canvas"
    pi_agent_file = vault_path / ".pi" / "agents" / "teacher.md"

    notes = []
    if algorithms_dir.exists():
        for md_file in algorithms_dir.glob("*.md"):
            try:
                content = md_file.read_text(encoding="utf-8")
                # Parse frontmatter
                mastery = 0.0
                tier = "SL"
                if content.startswith("---"):
                    parts = content.split("---", 2)
                    if len(parts) >= 3:
                        fm = yaml.safe_load(parts[1])
                        if isinstance(fm, dict):
                            mastery = float(fm.get("mastery", 0.0))
                            tier = str(fm.get("tier", "SL"))
                notes.append({
                    "id": md_file.stem,
                    "filename": md_file.name,
                    "rel_path": str(md_file.relative_to(vault_path)),
                    "obsidian_uri": f"obsidian://open?vault=learning-vault&file=Subjects%2FAlgorithms%2F{md_file.name}",
                    "mastery": mastery,
                    "tier": tier,
                    "last_modified": datetime.fromtimestamp(md_file.stat().st_mtime, tz=timezone.utc).isoformat(),
                })
            except Exception:
                continue

    pi_agent_active = pi_agent_file.exists()
    pi_agent_info = None
    if pi_agent_active:
        pi_agent_info = {
            "name": "teacher",
            "model": "openrouter/google/gemini-2.0-flash-exp:free",
            "max_tokens_per_turn": 150,
            "scaffolding": "N-1 conceptual probing",
            "rel_path": str(pi_agent_file.relative_to(vault_path)),
        }

    return {
        "connected": vault_path.exists(),
        "vault_path": str(vault_path),
        "total_notes": len(notes),
        "notes": notes,
        "canvas_available": canvas_file.exists(),
        "canvas_uri": "obsidian://open?vault=learning-vault&file=viz%2Fcourse_curriculum.canvas" if canvas_file.exists() else None,
        "pi_agent": pi_agent_info,
        "last_sync": datetime.now(timezone.utc).isoformat(),
    }


def sync_note_mastery(vault_path: Path, node_id: str, new_mastery: float) -> Optional[Dict[str, Any]]:
    """
    Updates the YAML frontmatter of an individual note in ~/learning-vault/Subjects/Algorithms/{node_id}.md
    """
    algorithms_dir = vault_path / "Subjects" / "Algorithms"
    note_file = algorithms_dir / f"{node_id}.md"

    if not note_file.exists():
        return None

    content = note_file.read_text(encoding="utf-8")
    if not content.startswith("---"):
        return None

    parts = content.split("---", 2)
    if len(parts) < 3:
        return None

    fm = yaml.safe_load(parts[1]) or {}
    fm["mastery"] = round(new_mastery, 2)
    new_yaml = yaml.dump(fm, sort_keys=False).strip()
    new_content = f"---\n{new_yaml}\n---" + parts[2]
    note_file.write_text(new_content, encoding="utf-8")

    return {
        "node_id": node_id,
        "mastery": round(new_mastery, 2),
        "file_path": str(note_file.relative_to(vault_path)),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
