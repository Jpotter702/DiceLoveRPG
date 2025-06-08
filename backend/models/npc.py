from pydantic import BaseModel, Field, validator
from typing import Dict, Optional
from enum import Enum

class AffectionLevel(str, Enum):
    STRANGER = "stranger"           # 0-20 AP
    ACQUAINTANCE = "acquaintance"   # 21-40 AP
    FRIEND = "friend"               # 41-60 AP
    CLOSE = "close"                 # 61-80 AP
    ROMANTIC = "romantic"           # 81-100 AP

class NPC(BaseModel):
    id: str
    name: str
    affection_points: int = Field(default=0, ge=0, le=100)
    level: AffectionLevel = Field(default=AffectionLevel.STRANGER)
    
    @validator("affection_points")
    def validate_ap(cls, v):
        if not 0 <= v <= 100:
            raise ValueError("Affection points must be between 0 and 100")
        return v
    
    @validator("level", always=True)
    def set_level_from_ap(cls, v, values):
        ap = values.get("affection_points", 0)
        if ap <= 20:
            return AffectionLevel.STRANGER
        elif ap <= 40:
            return AffectionLevel.ACQUAINTANCE
        elif ap <= 60:
            return AffectionLevel.FRIEND
        elif ap <= 80:
            return AffectionLevel.CLOSE
        else:
            return AffectionLevel.ROMANTIC
    
    class Config:
        schema_extra = {
            "example": {
                "id": "npc_1",
                "name": "Alice",
                "affection_points": 35,
                "level": "acquaintance"
            }
        } 