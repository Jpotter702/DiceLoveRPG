from fastapi import APIRouter, HTTPException
from models.geist import GeistRollRequest, GeistRollResponse, ActionType
from services.geist_service import perform_geist_roll

router = APIRouter()

@router.post("/roll", response_model=GeistRollResponse)
async def geist_roll(request: GeistRollRequest) -> GeistRollResponse:
    """
    Perform a Geist roll for a specific action.
    
    The roll takes into account:
    - Base probability from the probability table
    - Character traits that modify the probability
    - Random roll against the final target number
    
    Returns the roll results including:
    - Base and modified probabilities
    - The actual roll value
    - The final result (critical success, success, failure, critical failure)
    """
    try:
        return perform_geist_roll(request)
    except KeyError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid action type or missing probability table entry: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )
