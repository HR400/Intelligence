import frontmatter
from pathlib import Path
from typing import Dict, Any, Optional
from app.config import settings


class ObsidianService:
    @staticmethod
    def get_subject_note_path(subject: str, topic_slug: str) -> Path:
        return settings.VAULT_PATH / "Subjects" / subject / f"{topic_slug}.md"

    @staticmethod
    def read_note_frontmatter(file_path: Path) -> Dict[str, Any]:
        if not file_path.exists():
            return {}
        post = frontmatter.load(file_path)
        return post.metadata

    @staticmethod
    def update_note_mastery(file_path: Path, new_mastery: float) -> bool:
        if not file_path.exists():
            return False
        post = frontmatter.load(file_path)
        post.metadata["mastery_score"] = round(new_mastery, 2)
        if new_mastery >= 0.8:
            post.metadata["status"] = "COMPLETED"
        with open(file_path, "wb") as f:
            frontmatter.dump(post, f)
        return True

    @staticmethod
    def export_canvas(nodes: list, edges: list) -> Dict[str, Any]:
        """Generate Obsidian .canvas compatible visual JSON layout."""
        canvas_nodes = []
        canvas_edges = []
        spacing_x = 280
        spacing_y = 180

        for idx, node in enumerate(nodes):
            nid = node.get("node_id") or node.get("_id")
            title = node.get("title", nid)
            mastery = node.get("mastery_score", 0.0)
            color = "4" if mastery >= 0.8 else ("1" if mastery < 0.5 else "3")

            canvas_nodes.append({
                "id": nid,
                "x": (idx % 3) * spacing_x,
                "y": (idx // 3) * spacing_y,
                "width": 240,
                "height": 120,
                "color": color,
                "text": f"## {title}\nMastery: {int(mastery * 100)}%\nTier: {node.get('tier_unlocked', 'SL')}",
                "type": "text",
            })

        for edge in edges:
            canvas_edges.append({
                "id": f"edge_{edge['source']}_{edge['target']}",
                "fromNode": edge["source"],
                "fromSide": "bottom",
                "toNode": edge["target"],
                "toSide": "top",
            })

        return {"nodes": canvas_nodes, "edges": canvas_edges}
