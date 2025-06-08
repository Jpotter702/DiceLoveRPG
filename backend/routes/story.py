from fastapi import APIRouter, HTTPException
from models.story import DialogueRequest, DialogueResponse
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
