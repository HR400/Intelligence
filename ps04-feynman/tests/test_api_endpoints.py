import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.config import settings
import io

client = TestClient(app)


def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"


def test_ontology_subject():
    res = client.get("/api/ontology/subject/cs202")
    assert res.status_code == 200
    data = res.json()
    assert data["subject_id"] == "cs202"
    assert len(data["nodes"]) == 5
    # Verify depth tiers exist
    for node in data["nodes"]:
        assert "depth_tiers" in node
        assert "SL" in node["depth_tiers"]
        assert "HL" in node["depth_tiers"]
        assert "EX" in node["depth_tiers"]


def test_ontology_readiness():
    res = client.get("/api/ontology/readiness/cs202")
    assert res.status_code == 200
    data = res.json()
    assert "combat_readiness" in data
    assert 0.0 <= data["combat_readiness"] <= 100.0


def test_vault_node_sync():
    payload = {
        "node_id": "algo_dynamic_programming",
        "mastery_score": 0.85,
        "status": "COMPLETED",
        "content": "# Dynamic Programming updated in Obsidian",
    }
    res = client.post("/api/sync/vault-node", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "synchronized"
    assert data["node_id"] == "algo_dynamic_programming"
    assert data["mastery_score"] == 0.85
    assert data["node_status"] == "COMPLETED"


def test_socratic_evaluation():
    payload = {
        "node_id": "algo_big_o",
        "student_explanation": "Asymptotic analysis bounds the growth rate using a mathematical invariant and inductive limit.",
    }
    res = client.post("/api/socratic/evaluate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["accuracy"] > 0.5
    assert data["tokens_used"] <= 150
    assert "probing_question" in data


def test_ingest_upload(tmp_path, monkeypatch):
    monkeypatch.setattr(settings, "VAULT_PATH", tmp_path)
    file_content = b"%PDF-1.4 test syllabus dummy binary"
    files = {"file": ("algorithms_syllabus.pdf", io.BytesIO(file_content), "application/pdf")}
    data = {"subject": "ComputerScience", "tier": "HL"}

    res = client.post("/api/ingest/upload", data=data, files=files)
    assert res.status_code == 200
    res_data = res.json()
    assert res_data["status"] == "success"
    assert "note_path" in res_data

    # Verify PDF was saved to PDF_Inbox
    inbox_pdf = tmp_path / "PDF_Inbox" / "algorithms_syllabus.pdf"
    assert inbox_pdf.exists()

    # Verify Markdown note was created in Subjects/ComputerScience
    note_md = tmp_path / "Subjects" / "ComputerScience" / "algorithms_syllabus.pdf.md" or tmp_path / "Subjects" / "ComputerScience" / "algorithms_syllabus.md"
    assert any(tmp_path.glob("Subjects/ComputerScience/*.md"))
