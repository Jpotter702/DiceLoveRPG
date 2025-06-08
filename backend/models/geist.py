from pydantic import BaseModel, Field, validator
from typing import Dict, Optional
from enum import Enum
from .character import PrimaryTraits, SecondaryTraits, TertiaryTraits

class ActionComplexity(str, Enum):
    """
    Complexity levels for actions, determining base probability of success.
    
    Each complexity level has an associated default probability:
    - SIMPLE: 70% (Easy actions with low risk)
    - MODERATE: 60% (Standard actions with moderate risk)
    - COMPLEX: 50% (Difficult actions with high risk)
    - VERY_COMPLEX: 40% (Challenging actions with very high risk)
    """
    SIMPLE = "simple"
    MODERATE = "moderate"
    COMPLEX = "complex"
    VERY_COMPLEX = "very_complex"

class ActionType(str):
    """
    Custom string type for action types.
    Allows both predefined and custom actions.
    
    Rules:
    - Must be a string
    - Only alphanumeric characters and underscores allowed
    - Automatically converted to lowercase
    
    Examples:
    - "flirt"
    - "tell_joke"
    - "share_secret"
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
    """
    Request model for performing a Geist roll.
    
    Fields:
    - action_type: The type of action being attempted (predefined or custom)
    - complexity: Optional complexity level for new actions
    - primary_traits: Character's primary trait values
    - secondary_traits: Character's secondary trait values
    - tertiary_traits: Character's tertiary trait values
    """
    action_type: ActionType
    complexity: Optional[ActionComplexity] = None
    primary_traits: Dict[str, int]
    secondary_traits: Dict[str, int]
    tertiary_traits: Dict[str, int]
    
    @validator("primary_traits", "secondary_traits", "tertiary_traits")
    def validate_traits(cls, v):
        """Ensure all trait values are between 1 and 100."""
        for value in v.values():
            if not 1 <= value <= 100:
                raise ValueError("All trait values must be between 1 and 100")
        return v
    
    class Config:
        schema_extra = {
            "example": {
                "action_type": "flirt",
                "complexity": "moderate",
                "primary_traits": {
                    "charm": 75,
                    "wit": 65,
                    "empathy": 80
                },
                "secondary_traits": {
                    "impression": 70,
                    "flirtation": 65
                },
                "tertiary_traits": {
                    "romance": 67,
                    "connection": 73
                }
            }
        }

class RollResult(str, Enum):
    """
    Possible outcomes of a Geist roll.
    
    Determined by comparing roll value to target probability:
    - CRITICAL_SUCCESS: Roll <= 10% of target
    - SUCCESS: Roll <= target
    - FAILURE: Roll > target
    - CRITICAL_FAILURE: Roll > 190% of target
    """
    CRITICAL_SUCCESS = "critical_success"
    SUCCESS = "success"
    FAILURE = "failure"
    CRITICAL_FAILURE = "critical_failure"

class GeistRollResponse(BaseModel):
    """
    Response model for a Geist roll.
    
    Fields:
    - action_type: The type of action attempted
    - is_new_action: Whether this was a newly created action
    - complexity: The action's complexity level
    - base_probability: Initial probability before trait modifiers
    - trait_modifier: Total bonus from character traits
    - final_probability: Target number after all modifiers
    - roll_value: The actual dice roll (1-100)
    - result: The outcome of the roll
    """
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