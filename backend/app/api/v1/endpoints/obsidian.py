from fastapi import APIRouter, Response, HTTPException
from pydantic import BaseModel
from pathlib import Path
from backend.app.services.obsidian_service import (
    export_node_to_markdown,
    generate_obsidian_canvas,
    populate_vault_files,
    get_vault_telemetry,
    sync_note_mastery,
)
from backend.app.api.v1.endpoints.courses import CURRENT_TRACK

router = APIRouter()
VAULT_PATH = Path.home() / "learning-vault"


class UpdateNoteMasteryRequest(BaseModel):
    node_id: str
    mastery: float


@router.get("/status")
async def get_obsidian_vault_status():
    """Retrieve live Obsidian Vault status, note files, and Pi agent configuration."""
    return get_vault_telemetry(VAULT_PATH)


@router.post("/sync-vault")
async def sync_all_notes_to_vault():
    """
    Synchronizes the active course track nodes and .canvas file directly into ~/learning-vault.
    Target: ~/learning-vault/Subjects/Algorithms/ and ~/learning-vault/viz/
    """
    nodes = CURRENT_TRACK.nodes
    edges = []
    for node in nodes:
        for prereq in node.prerequisites:
            edges.append((prereq, node.id))

    result = populate_vault_files(VAULT_PATH, nodes, edges)
    return result


@router.post("/update-note")
async def update_external_note_mastery(payload: UpdateNoteMasteryRequest):
    """
    Simulates or receives an external Obsidian edit (e.g. from the Pi Socratic agent).
    Updates both the Markdown file in the vault and the in-memory curriculum DAG.
    """
    node = next((n for n in CURRENT_TRACK.nodes if n.id == payload.node_id), None)
    if not node:
        raise HTTPException(status_code=404, detail="Topic node not found.")

    node.mastery = min(1.0, max(0.0, payload.mastery))
    vault_result = sync_note_mastery(VAULT_PATH, payload.node_id, node.mastery)

    return {
        "status": "success",
        "node_id": node.id,
        "new_mastery": node.mastery,
        "is_mastered": node.mastery >= 0.70,
        "vault_sync": vault_result,
    }


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
    target_node = next((n for n in CURRENT_TRACK.nodes if n.id == node_id), None)
    if not target_node:
        raise HTTPException(status_code=404, detail="Node not found.")

    md_content = export_node_to_markdown(target_node)
    return {
        "node_id": node_id,
        "filename": f"{node_id}.md",
        "content": md_content,
        "obsidian_uri": f"obsidian://open?vault=learning-vault&file=Subjects%2FAlgorithms%2F{node_id}.md",
    }
