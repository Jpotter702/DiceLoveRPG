from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from enum import Enum

class DialogueTone(str, Enum):
    FRIENDLY = "friendly"
    FLIRTY = "flirty"
    SERIOUS = "serious"
    PLAYFUL = "playful"
    ROMANTIC = "romantic"
    NERVOUS = "nervous"

class NPCMood(str, Enum):
    HAPPY = "happy"
    NEUTRAL = "neutral"
    SAD = "sad"
    EXCITED = "excited"
    ANNOYED = "annoyed"
    SMITTEN = "smitten"
    CONFUSED = "confused"

class NPCState(BaseModel):
    name: str
    affection: int = Field(..., ge=0, le=100)
    mood: NPCMood
    context: List[str] = Field(default_factory=list, description="Recent interaction history")
    relationship_status: str = "stranger"

class StoryContext(BaseModel):
    location: str
    time_of_day: str
    current_event: Optional[str] = None
    previous_interactions: List[str] = Field(default_factory=list, max_items=5)

class DialogueRequest(BaseModel):
    npc_id: str
    player_name: str
    player_dialogue: str
    dialogue_tone: DialogueTone
    npc_state: NPCState
    story_context: StoryContext
    
    class Config:
        schema_extra = {
            "example": {
                "npc_id": "sakura",
                "player_name": "Alex",
                "player_dialogue": "I really enjoyed our time at the cafe today.",
                "dialogue_tone": "friendly",
                "npc_state": {
                    "name": "Sakura",
                    "affection": 65,
                    "mood": "happy",
                    "context": [
                        "Met at the local cafe",
                        "Shared interest in art"
                    ],
                    "relationship_status": "friend"
                },
                "story_context": {
                    "location": "Park",
                    "time_of_day": "evening",
                    "current_event": "Evening walk",
                    "previous_interactions": [
                        "Had coffee together",
                        "Discussed favorite artists"
                    ]
                }
            }
        }

class DialogueResponse(BaseModel):
    npc_id: str
    npc_name: str
    response_text: str
    new_mood: NPCMood
    mood_change_reason: str
    affection_change: int = Field(..., ge=-10, le=10)
    
    class Config:
        schema_extra = {
            "example": {
                "npc_id": "sakura",
                "npc_name": "Sakura",
                "response_text": "I had a wonderful time too! Your insights about modern art were fascinating.",
                "new_mood": "happy",
                "mood_change_reason": "Player showed genuine interest in shared hobby",
                "affection_change": 5
            }
        } 