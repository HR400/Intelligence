from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.ingest import router as ingest_router
from app.api.sync import router as sync_router
from app.api.ontology import router as ontology_router
from app.api.socratic import router as socratic_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure Obsidian Vault directories exist
    settings.VAULT_PATH.mkdir(parents=True, exist_ok=True)
    (settings.VAULT_PATH / "PDF_Inbox").mkdir(parents=True, exist_ok=True)
    (settings.VAULT_PATH / "Subjects").mkdir(parents=True, exist_ok=True)
    (settings.VAULT_PATH / "viz").mkdir(parents=True, exist_ok=True)
    (settings.VAULT_PATH / ".pi" / "agents").mkdir(parents=True, exist_ok=True)
    print(f"🚀 [PS04 Backend] Vault path verified at: {settings.VAULT_PATH}")
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(ingest_router, prefix=settings.API_V1_STR)
app.include_router(sync_router, prefix=settings.API_V1_STR)
app.include_router(ontology_router, prefix=settings.API_V1_STR)
app.include_router(socratic_router, prefix=settings.API_V1_STR)


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "vault_path": str(settings.VAULT_PATH),
    }


@app.get("/api/user")
async def get_user_profile():
    return {
        "user_id": "scholar_1",
        "username": "CyberScholar",
        "email": "scholar@antigravity.ai",
        "level": 2,
        "xp": 180,
        "xp_to_next_level": 500,
        "streak": 3,
        "stats": {
            "total_nodes_completed": 1,
            "total_quizzes_passed": 4,
            "total_bosses_defeated": 0,
            "combat_readiness": 0.42,
        },
    }
