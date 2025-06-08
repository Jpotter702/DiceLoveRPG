from enum import Enum
from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class DialogueTone(str, Enum):
    FRIENDLY = "friendly"      # Safe, reliable choice
    FLIRTY = "flirty"         # Higher risk/reward
    SERIOUS = "serious"       # Good for important conversations
    PLAYFUL = "playful"       # Safe, good for building rapport
    ROMANTIC = "romantic"     # Highest risk/reward
    NERVOUS = "nervous"       # Shows vulnerability
    SYMPATHETIC = "sympathetic"  # Good for emotional support
    ENTHUSIASTIC = "enthusiastic"  # Good for shared interests
    APOLOGETIC = "apologetic"   # For making amends
    CONFIDENT = "confident"     # Shows assertiveness

    @property
    def description(self) -> str:
        """Get a description of the tone and its typical effects."""
        descriptions = {
            "friendly": "A safe choice that usually gives a small positive bonus. Good for building basic rapport.",
            "flirty": "Playfully romantic. Higher risk but higher reward. Works better with higher affection.",
            "serious": "No bonuses but good for important conversations. NPCs remember serious talks.",
            "playful": "Light and fun. Small positive bonus and good for improving bad moods.",
            "romantic": "Direct expression of romantic interest. Highest risk/reward. Best with high affection.",
            "nervous": "Shows vulnerability. Small penalty but can be endearing to some NPCs.",
            "sympathetic": "Shows emotional support. Very effective when NPC is sad or troubled.",
            "enthusiastic": "Shows excitement. Great when discussing shared interests or hobbies.",
            "apologetic": "For making amends. Can help recover from failed interactions.",
            "confident": "Shows assertiveness. Good for impressing NPCs but can seem arrogant."
        }
        return descriptions[self.value]

    @property
    def recommended_affection(self) -> int:
        """Get the recommended minimum affection level for this tone."""
        minimums = {
            "friendly": 0,      # Always safe
            "flirty": 30,      # Need some rapport first
            "serious": 0,      # Always available
            "playful": 10,     # Need minimal rapport
            "romantic": 50,    # Need strong connection
            "nervous": 0,      # Always available
            "sympathetic": 20, # Need some trust
            "enthusiastic": 0, # Always available
            "apologetic": 0,   # Always available
            "confident": 0     # Always available
        }
        return minimums[self.value]

class ToneChoice(BaseModel):
    """Represents a dialogue tone choice with its current context."""
    tone: DialogueTone
    is_recommended: bool
    reason: str
    success_chance: str  # e.g. "High", "Medium", "Low"
    risk_level: str     # e.g. "Safe", "Risky", "Very Risky"

class DialogueOptions(BaseModel):
    """Available dialogue options for the current interaction."""
    recommended_tones: List[ToneChoice]
    other_tones: List[ToneChoice]
    current_context: Dict[str, str]  # Relevant factors like mood, location, etc.

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