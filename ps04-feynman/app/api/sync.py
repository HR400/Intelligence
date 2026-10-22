from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.services.graph_engine import GraphEngine

router = APIRouter(prefix="/sync", tags=["Sync"])

# Shared graph engine instance for real-time memory synchronization
shared_graph_engine = GraphEngine()
# In-memory store of active nodes
NODE_STORE: Dict[str, Dict[str, Any]] = {}


class VaultSyncPayload(BaseModel):
    node_id: str
    mastery_score: float = 0.0
    status: str = "LOCKED"
    content: Optional[str] = None
    filepath: Optional[str] = None


@router.post("/vault-node")
async def sync_vault_node(payload: VaultSyncPayload):
    """
    Receives file change events from scripts/vault_watcher.py when an Obsidian note is modified.
    Updates node status & mastery in the deterministic graph engine.
    """
    node = NODE_STORE.get(payload.node_id, {
        "_id": payload.node_id,
        "title": payload.node_id.replace("_", " ").title(),
        "xp_yield": 150,
        "prerequisites": [],
    })

    node["mastery_score"] = payload.mastery_score
    node["status"] = payload.status
    if payload.content:
        node["content"] = payload.content
    if payload.filepath:
        node["filepath"] = payload.filepath

    NODE_STORE[payload.node_id] = node

    # Synchronize graph engine
    shared_graph_engine.build_graph(list(NODE_STORE.values()))
    unlocked = shared_graph_engine.get_unlocked_nodes()

    # Automatically unlock nodes whose prerequisites reached 0.8 mastery
    for uid in unlocked:
        if uid in NODE_STORE and NODE_STORE[uid].get("status") == "LOCKED":
            NODE_STORE[uid]["status"] = "UNLOCKED"

    return {
        "status": "synchronized",
        "node_id": payload.node_id,
        "mastery_score": payload.mastery_score,
        "node_status": NODE_STORE[payload.node_id]["status"],
        "unlocked_nodes": unlocked,
    }


@router.get("/nodes")
async def get_all_synced_nodes():
    return list(NODE_STORE.values())
