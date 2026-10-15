from fastapi import APIRouter
from backend.app.api.v1.endpoints import (
    courses,
    graph,
    feynman,
    boss,
    calendar,
    obsidian,
)

api_router = APIRouter()

api_router.include_router(courses.router, prefix="/courses", tags=["Courses"])
api_router.include_router(graph.router, prefix="/graph", tags=["DAG Graph"])
api_router.include_router(feynman.router, prefix="/feynman", tags=["Socratic Feynman"])
api_router.include_router(boss.router, prefix="/boss", tags=["Boss Arena"])
api_router.include_router(calendar.router, prefix="/calendar", tags=["Calendar"])
api_router.include_router(obsidian.router, prefix="/obsidian", tags=["Obsidian Vault"])
