from fastapi import APIRouter
from typing import List, Dict, Any
from pydantic import BaseModel
from backend.app.services.gamification_service import calculate_boss_hp
from backend.app.api.v1.endpoints.courses import CURRENT_TRACK
from backend.app.api.v1.endpoints.feynman import CURRENT_USER

router = APIRouter()


class BossEncounter(BaseModel):
    boss_id: str
    boss_name: str
    boss_type: str  # "MINI_BOSS" or "MAIN_BOSS"
    max_hp: int
    current_hp: int
    hp_percentage: int
    scope_node_ids: List[str]
    is_defeated: bool
    weakness_nodes: List[str]


@router.get("/status")
async def get_boss_arena_status() -> Dict[str, Any]:
    """
    Returns combat status for Boss Battles:
    - Mini-Boss (Midterm Algorithmic Colossus): Scope = SL + HL nodes
    - Main Boss (Grand Turing Overlord): Scope = All nodes (SL + HL + EX)
    """
    all_nodes = CURRENT_TRACK.nodes
    sl_hl_nodes = [n for n in all_nodes if n.tier.value in ("SL", "HL")]
    
    # 1. Mini-Boss: Midterm Algorithmic Colossus
    mini_max_hp = 500
    mini_curr_hp = calculate_boss_hp(sl_hl_nodes, max_hp=mini_max_hp)
    mini_defeated = mini_curr_hp <= 0
    mini_weaknesses = [n.title for n in sl_hl_nodes if n.mastery < 0.70]

    # 2. Main Boss: Grand Turing Overlord
    main_max_hp = 1200
    main_curr_hp = calculate_boss_hp(all_nodes, max_hp=main_max_hp)
    main_defeated = main_curr_hp <= 0
    main_weaknesses = [n.title for n in all_nodes if n.mastery < 0.70]

    return {
        "course_title": CURRENT_TRACK.title,
        "mini_boss": {
            "boss_id": "boss_midterm_colossus",
            "boss_name": "Midterm Algorithmic Colossus",
            "boss_type": "MINI_BOSS",
            "max_hp": mini_max_hp,
            "current_hp": mini_curr_hp,
            "hp_percentage": int(round((mini_curr_hp / mini_max_hp) * 100)),
            "scope_node_ids": [n.id for n in sl_hl_nodes],
            "is_defeated": mini_defeated,
            "unmastered_weaknesses": mini_weaknesses,
        },
        "main_boss": {
            "boss_id": "boss_grand_turing",
            "boss_name": "Grand Turing Overlord",
            "boss_type": "MAIN_BOSS",
            "max_hp": main_max_hp,
            "current_hp": main_curr_hp,
            "hp_percentage": int(round((main_curr_hp / main_max_hp) * 100)),
            "scope_node_ids": [n.id for n in all_nodes],
            "is_defeated": main_defeated,
            "unmastered_weaknesses": main_weaknesses,
        },
    }
