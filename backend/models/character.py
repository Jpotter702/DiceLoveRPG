from pydantic import BaseModel, Field, validator
from typing import Dict, Optional
from enum import Enum

class PrimaryTraits(str, Enum):
    CHARM = "charm"
    WIT = "wit"
    EMPATHY = "empathy"
    STYLE = "style"
    CONFIDENCE = "confidence"
    LUCK = "luck"

class SecondaryTraits(str, Enum):
    IMPRESSION = "impression"  # Charm + Style
    FLIRTATION = "flirtation"  # Wit + Confidence
    CHEMISTRY = "chemistry"    # Empathy + Luck

class TertiaryTraits(str, Enum):
    ROMANCE = "romance"        # (Impression + Flirtation) / 2
    CONNECTION = "connection"  # (Chemistry + Empathy) / 2
    DESTINY = "destiny"        # (Luck + Chemistry) / 2

class CharacterCreateRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    primary_traits: Dict[PrimaryTraits, int] = Field(
        ...,
        description="Dictionary of primary traits and their values (1-100)"
    )

    @validator("primary_traits")
    def validate_primary_traits(cls, v):
        required_traits = set(PrimaryTraits)
        if set(v.keys()) != required_traits:
            raise ValueError(f"All primary traits must be provided: {required_traits}")
        for trait, value in v.items():
            if not 1 <= value <= 100:
                raise ValueError(f"Trait values must be between 1 and 100, got {value} for {trait}")
        return v

class Character(CharacterCreateRequest):
    secondary_traits: Dict[SecondaryTraits, int]
    tertiary_traits: Dict[TertiaryTraits, int]
    
    class Config:
        schema_extra = {
            "example": {
                "name": "Alex",
                "primary_traits": {
                    "charm": 75,
                    "wit": 65,
                    "empathy": 80,
                    "style": 70,
                    "confidence": 60,
                    "luck": 55
                },
                "secondary_traits": {
                    "impression": 72,
                    "flirtation": 62,
                    "chemistry": 67
                },
                "tertiary_traits": {
                    "romance": 67,
                    "connection": 73,
                    "destiny": 61
                }
            }
        } 