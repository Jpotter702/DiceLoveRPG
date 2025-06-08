from fastapi import APIRouter, HTTPException
from models.character import Character, CharacterCreateRequest
from services.character_service import create_character

router = APIRouter()

@router.post("/create", response_model=Character)
async def create_character_endpoint(request: CharacterCreateRequest) -> Character:
    """
    Create a new character with calculated traits.
    
    Takes primary traits as input and returns a complete character profile
    with calculated secondary and tertiary traits.
    """
    try:
        return create_character(request)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
