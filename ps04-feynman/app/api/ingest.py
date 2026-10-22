import os
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import aiofiles
from app.config import settings

router = APIRouter(prefix="/ingest", tags=["Ingest"])

# Ensure absolute path expansion without tilde bottleneck
VAULT_PATH = Path.home() / "learning-vault"
VAULT_PATH.mkdir(parents=True, exist_ok=True)
(VAULT_PATH / "PDF_Inbox").mkdir(parents=True, exist_ok=True)
(VAULT_PATH / "Subjects").mkdir(parents=True, exist_ok=True)


def get_active_vault_path() -> Path:
    return getattr(settings, "VAULT_PATH", VAULT_PATH)


@router.post("/upload")
async def upload_material(
    subject: str = Form(...),
    tier: str = Form("HL"),
    file: UploadFile = File(...),
):
    try:
        active_vault = get_active_vault_path()
        inbox_dir = active_vault / "PDF_Inbox"
        inbox_dir.mkdir(parents=True, exist_ok=True)
        file_path = inbox_dir / file.filename

        async with aiofiles.open(file_path, "wb") as out:
            content = await file.read()
            await out.write(content)

        node_slug = file.filename.lower().replace(" ", "_").split(".")[0]
        subject_dir = active_vault / "Subjects" / subject
        subject_dir.mkdir(parents=True, exist_ok=True)
        note_path = subject_dir / f"{node_slug}.md"

        frontmatter = f"""---
node_id: {subject.lower()}_{node_slug}
subject: {subject}
tier: {tier}
mastery_score: 0.0
xp_yield: 150
prerequisites: []
status: UNLOCKED
---

# {node_slug.replace('_', ' ').title()}

## Objectives
- [ ] Understand fundamental mechanics and derivation.
- [ ] Complete unassisted Socratic check.

## Feynman Log
- Session pending.
"""
        async with aiofiles.open(note_path, "w") as note_file:
            await note_file.write(frontmatter)

        return {
            "status": "success",
            "node_id": f"{subject.lower()}_{node_slug}",
            "note_path": str(note_path),
            "file_path": str(file_path),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
