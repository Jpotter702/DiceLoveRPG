from pydantic import BaseModel, Field, validator
from typing import Dict, Optional
from enum import Enum
from .character import PrimaryTraits, SecondaryTraits, TertiaryTraits

class ActionComplexity(str, Enum):
    SIMPLE = "simple"          # Base 70%
    MODERATE = "moderate"      # Base 60%
    COMPLEX = "complex"        # Base 50%
    VERY_COMPLEX = "very_complex"  # Base 40%

class ActionType(str):
    """
    Custom string type for action types.
    Allows both predefined and custom actions.
    """
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
        
    @classmethod
    def validate(cls, v):
        if not isinstance(v, str):
            raise ValueError('string required')
        if not v.replace('_', '').isalnum():
            raise ValueError('only alphanumeric characters and underscores allowed')
        return v.lower()

class GeistRollRequest(BaseModel):
    action_type: ActionType
    complexity: Optional[ActionComplexity] = None
    primary_traits: Dict[PrimaryTraits, int]
    secondary_traits: Dict[SecondaryTraits, int]
    tertiary_traits: Dict[TertiaryTraits, int]

    @validator("primary_traits", "secondary_traits", "tertiary_traits")
    def validate_traits(cls, v, field):
        for value in v.values():
            if not 1 <= value <= 100:
                raise ValueError(f"All trait values must be between 1 and 100 in {field.name}")
        return v

class RollResult(str, Enum):
    CRITICAL_SUCCESS = "critical_success"  # Roll <= 10% of target
    SUCCESS = "success"                    # Roll <= target
    FAILURE = "failure"                    # Roll > target
    CRITICAL_FAILURE = "critical_failure"  # Roll > 90% above target

class GeistRollResponse(BaseModel):
    action_type: str
    is_new_action: bool = False
    complexity: Optional[ActionComplexity] = None
    base_probability: int
    trait_modifier: int
    final_probability: int
    roll_value: int
    result: RollResult
    
    class Config:
        schema_extra = {
            "example": {
                "action_type": "flirt",
                "is_new_action": False,
                "complexity": "moderate",
                "base_probability": 60,
                "trait_modifier": 15,
                "final_probability": 75,
                "roll_value": 45,
                "result": "success"
            }
        } 