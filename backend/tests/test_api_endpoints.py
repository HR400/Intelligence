import pytest
from httpx import AsyncClient, ASGITransport
from backend.app.main import app


@pytest.mark.anyio
async def test_health_check_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"


@pytest.mark.anyio
async def test_courses_and_graph_endpoints():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        track_resp = await ac.get("/api/v1/courses/track")
        assert track_resp.status_code == 200
        track = track_resp.json()
        assert track["id"] == "cs202"
        assert len(track["nodes"]) > 0

        graph_resp = await ac.get("/api/v1/graph/status")
        assert graph_resp.status_code == 200
        graph_data = graph_resp.json()
        assert graph_data["is_acyclic"] is True
        assert len(graph_data["ranked_schedule"]) > 0


@pytest.mark.anyio
async def test_feynman_evaluation_flow():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {
            "node_id": "algo_binary_heaps",
            "student_explanation": "A binary heap is a complete binary tree where parent keys satisfy the heap-order property relative to children. In a min-heap, the root holds the minimum element.",
            "hint_count": 0,
        }
        resp = await ac.post("/api/v1/feynman/evaluate", json=payload)
        assert resp.status_code == 200
        result = resp.json()
        assert "evaluation" in result
        assert result["evaluation"]["accuracy"] > 0.5
        assert result["xp_awarded"] >= 50
        assert result["delta_mastery"] > 0


@pytest.mark.anyio
async def test_boss_arena_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        resp = await ac.get("/api/v1/boss/status")
        assert resp.status_code == 200
        data = resp.json()
        assert "mini_boss" in data
        assert "main_boss" in data
        assert data["main_boss"]["max_hp"] == 1200


@pytest.mark.anyio
async def test_calendar_drift_cascade_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        events_resp = await ac.get("/api/v1/calendar/events")
        assert events_resp.status_code == 200
        events = events_resp.json()
        assert len(events) > 0

        cascade_resp = await ac.post("/api/v1/calendar/drift/cascade/task_1")
        assert cascade_resp.status_code == 200
        data = cascade_resp.json()
        assert data["status"] == "DRIFT_REALLOCATED"
        assert data["tokens_spent"] == 0
