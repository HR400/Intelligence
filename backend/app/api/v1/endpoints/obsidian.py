from fastapi import APIRouter, Response
from backend.app.services.obsidian_service import export_node_to_markdown, generate_obsidian_canvas
from backend.app.api.v1.endpoints.courses import CURRENT_TRACK

router = APIRouter()


@router.get("/canvas")
async def export_vault_canvas():
    """Returns the visual Obsidian .canvas JSON file with 2D node-edge layout."""
    nodes = CURRENT_TRACK.nodes
    edges = []
    for node in nodes:
        for prereq in node.prerequisites:
            edges.append((prereq, node.id))
            
    canvas_json = generate_obsidian_canvas(nodes, edges)
    return Response(
        content=canvas_json,
        media_type="application/json",
        headers={"Content-Disposition": 'attachment; filename="course_curriculum.canvas"'},
    )


@router.get("/notes/{node_id}")
async def export_single_note_markdown(node_id: str):
    """Returns markdown note with YAML frontmatter for an individual node."""
    target_node = None
    for n in CURRENT_TRACK.nodes:
        if n.id == node_id:
            target_node = n
            break

    if not target_node:
        return {"error": "Node not found."}

    md_content = export_node_to_markdown(target_node)
    return {
        "node_id": node_id,
        "filename": f"{node_id}.md",
        "content": md_content,
    }
