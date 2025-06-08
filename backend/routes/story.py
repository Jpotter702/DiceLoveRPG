from fastapi import APIRouter, HTTPException
from models.story import (
    DialogueRequest,
    DialogueResponse,
    DialogueOptions,
    StoryContext,
    NPCState
)
from services.story_service import story_service

router = APIRouter()

@router.post("/interact", response_model=DialogueResponse)
async def interact_story(request: DialogueRequest) -> DialogueResponse:
    """
    Process a dialogue interaction with an NPC.
    
    Takes the player's dialogue, tone, and game state context.
    Returns the NPC's response along with mood and affection changes.
    
    The response is generated using a Hugging Face language model,
    which considers the NPC's current state, relationship status,
    and interaction history to generate contextually appropriate responses.
    """
    try:
        return await story_service.process_interaction(request)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Failed to process story interaction"
        )

@router.post("/dialogue_options", response_model=DialogueOptions)
async def get_dialogue_options(
    npc_id: str,
    player_name: str,
    story_context: StoryContext,
    npc_state: NPCState
) -> DialogueOptions:
    """
    Get available dialogue options with recommendations.
    
    This endpoint helps players choose appropriate dialogue tones by providing:
    1. Recommended tones based on current context
    2. Success chances for each tone
    3. Risk levels and potential consequences
    4. Reasons for recommendations
    
    The recommendations consider:
    - NPC's current mood
    - Relationship level
    - Location and time
    - Recent interactions
    - Shared interests/topics
    
    Example Response:
    ```json
    {
        "recommended_tones": [
            {
                "tone": "sympathetic",
                "is_recommended": true,
                "reason": "Sakura seems to need emotional support",
                "success_chance": "High",
                "risk_level": "Safe"
            }
        ],
        "other_tones": [
            {
                "tone": "romantic",
                "is_recommended": false,
                "reason": "Need higher affection (currently 30, need 50)",
                "success_chance": "Low",
                "risk_level": "Very Risky"
            }
        ],
        "current_context": {
            "mood": "sad",
            "affection": "30",
            "location": "Park",
            "time": "evening",
            "event": "Regular interaction"
        }
    }
    ```
    """
    try:
        return story_service.get_dialogue_options(
            npc_id,
            player_name,
            story_context,
            npc_state
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Failed to get dialogue options"
        )
