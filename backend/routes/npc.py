from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel

from models.npc import NPC, AffectionLevel
from services.affection_service import affection_service

router = APIRouter()

class NPCCreate(BaseModel):
    name: str

class APUpdate(BaseModel):
    npc_id: str
    roll_result: str
    action_type: str

class APUpdateResponse(BaseModel):
    npc: NPC
    ap_change: int
    level_up: Optional[AffectionLevel]
    message: str

@router.post("/npcs", response_model=NPC)
async def create_npc(npc_data: NPCCreate) -> NPC:
    """Create a new NPC."""
    return affection_service.create_npc(npc_data.name)

@router.get("/npcs", response_model=List[NPC])
async def list_npcs() -> List[NPC]:
    """Get all NPCs."""
    return affection_service.list_npcs()

@router.get("/npcs/{npc_id}", response_model=NPC)
async def get_npc(npc_id: str) -> NPC:
    """Get a specific NPC by ID."""
    npc = affection_service.get_npc(npc_id)
    if not npc:
        raise HTTPException(status_code=404, detail=f"NPC {npc_id} not found")
    return npc

@router.post("/npcs/update_ap", response_model=APUpdateResponse)
async def update_affection_points(update: APUpdate) -> APUpdateResponse:
    """
    Update an NPC's affection points based on a Geist roll result.
    
    The amount of AP change depends on the roll result:
    - Critical Success: +10 AP
    - Success: +5 AP
    - Failure: -2 AP
    - Critical Failure: -5 AP
    """
    try:
        npc, ap_change, level_up = affection_service.update_ap(
            update.npc_id,
            update.roll_result,
            update.action_type
        )
        
        # Create appropriate message
        message = f"AP changed by {ap_change}"
        if level_up:
            message += f". Relationship advanced to {level_up.value}!"
        
        return APUpdateResponse(
            npc=npc,
            ap_change=ap_change,
            level_up=level_up,
            message=message
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/npcs/{npc_id}/reset", response_model=NPC)
async def reset_affection_points(npc_id: str) -> NPC:
    """Reset an NPC's affection points to 0."""
    try:
        return affection_service.reset_ap(npc_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 