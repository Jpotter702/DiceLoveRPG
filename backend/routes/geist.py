from fastapi import APIRouter, HTTPException
from models.geist import GeistRollRequest, GeistRollResponse, ActionType, ActionComplexity
from services.geist_service import perform_geist_roll, COMMON_ACTIONS, DEFAULT_PROBABILITIES

router = APIRouter()

@router.post("/roll", response_model=GeistRollResponse)
async def geist_roll(request: GeistRollRequest) -> GeistRollResponse:
    """
    Perform a Geist roll for a specific action.
    
    The roll takes into account:
    - Base probability from the probability table
    - Character traits that modify the probability
    - Random roll against the final target number
    
    For new actions:
    - If complexity is not specified, uses MODERATE (60% base)
    - Automatically adds the action to the probability table
    - Returns is_new_action=True in the response
    
    Common action complexities:
    - SIMPLE (70%): Easy actions like compliments
    - MODERATE (60%): Standard actions like flirting
    - COMPLEX (50%): Difficult actions like asking someone out
    - VERY_COMPLEX (40%): Challenging actions like confessing love
    
    Returns:
        Complete roll results including:
        - Base and modified probabilities
        - Whether this was a new action
        - The action's complexity
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

@router.get("/actions")
async def list_actions() -> dict:
    """
    List all available actions and their default complexities.
    
    Returns:
        Dictionary containing:
        - common_actions: Predefined actions and their complexities
        - default_probabilities: Base probabilities for each complexity level
    """
    return {
        "common_actions": {
            action: complexity.value
            for action, complexity in COMMON_ACTIONS.items()
        },
        "default_probabilities": {
            complexity.value: probability
            for complexity, probability in DEFAULT_PROBABILITIES.items()
        }
    }
