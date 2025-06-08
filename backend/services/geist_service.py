# Standard library imports
import json
import random
from pathlib import Path
from typing import Dict, Tuple, Optional

# Local application imports
from models.geist import (
    ActionType,
    ActionComplexity,
    GeistRollRequest,
    GeistRollResponse,
    RollResult,
)
from models.character import PrimaryTraits, SecondaryTraits, TertiaryTraits
from utils.modifiers import apply_trait_bonus

# Constants
PROB_TABLE_PATH = Path(__file__).parent.parent / "models" / "probability_table.json"

# Default probabilities for different action complexities
DEFAULT_PROBABILITIES = {
    ActionComplexity.SIMPLE: 70,      # Easy actions with low risk
    ActionComplexity.MODERATE: 60,    # Standard actions with moderate risk
    ActionComplexity.COMPLEX: 50,     # Difficult actions with high risk
    ActionComplexity.VERY_COMPLEX: 40 # Challenging actions with very high risk
}

# Predefined actions with their default complexities
COMMON_ACTIONS = {
    "compliment": ActionComplexity.SIMPLE,
    "flirt": ActionComplexity.MODERATE,
    "ask_out": ActionComplexity.COMPLEX,
    "confess_love": ActionComplexity.VERY_COMPLEX,
}

def load_probability_table() -> Dict[str, int]:
    """
    Load the probability table from disk.
    
    The probability table stores base success chances for different actions.
    If the file doesn't exist, returns an empty dictionary.
    
    Returns:
        Dictionary mapping action names to their base probabilities
    """
    if PROB_TABLE_PATH.exists():
        with open(PROB_TABLE_PATH) as f:
            return json.load(f)
    return {}

def save_probability_table(probabilities: Dict[str, int]) -> None:
    """
    Save the probability table to disk.
    
    Args:
        probabilities: Dictionary mapping action names to their base probabilities
    """
    # Ensure the directory exists
    PROB_TABLE_PATH.parent.mkdir(parents=True, exist_ok=True)
    
    # Save with pretty formatting
    with open(PROB_TABLE_PATH, 'w') as f:
        json.dump(probabilities, f, indent=2)

def get_or_create_action_probability(
    action_type: str,
    complexity: Optional[ActionComplexity] = None
) -> Tuple[int, bool]:
    """
    Get or create a base probability for an action.
    
    If the action exists in the probability table, returns its value.
    If not, creates a new entry based on the action's complexity.
    
    Args:
        action_type: The type of action
        complexity: Optional complexity level for new actions
        
    Returns:
        Tuple of (base_probability, is_new_action)
    """
    # Load current probabilities
    probabilities = load_probability_table()
    
    # Check if action exists
    if action_type in probabilities:
        return probabilities[action_type], False
        
    # Determine complexity for new action
    if complexity is None:
        complexity = COMMON_ACTIONS.get(action_type, ActionComplexity.MODERATE)
    
    # Get default probability for complexity
    base_probability = DEFAULT_PROBABILITIES[complexity]
    
    # Save new action
    probabilities[action_type] = base_probability
    save_probability_table(probabilities)
    
    return base_probability, True

def get_trait_scores(
    action_type: str,
    primary_traits: Dict[PrimaryTraits, int],
    secondary_traits: Dict[SecondaryTraits, int],
    tertiary_traits: Dict[TertiaryTraits, int]
) -> Tuple[int, int]:
    """
    Calculate primary and secondary trait scores for an action.
    
    Different actions are influenced by different combinations of traits:
    - Simple actions: Charm + Impression
    - Social actions: Flirtation + Romance
    - Emotional actions: Connection + Empathy
    
    Args:
        action_type: The type of action being attempted
        primary_traits: Character's primary trait values
        secondary_traits: Character's secondary trait values
        tertiary_traits: Character's tertiary trait values
        
    Returns:
        Tuple of (primary_score, secondary_score)
    """
    # Default trait combinations for unknown actions
    default_scores = {
        "simple": lambda: (
            primary_traits[PrimaryTraits.CHARM],
            secondary_traits[SecondaryTraits.IMPRESSION]
        ),
        "social": lambda: (
            secondary_traits[SecondaryTraits.FLIRTATION],
            tertiary_traits[TertiaryTraits.ROMANCE]
        ),
        "emotional": lambda: (
            tertiary_traits[TertiaryTraits.CONNECTION],
            primary_traits[PrimaryTraits.EMPATHY]
        ),
    }
    
    # Known action trait combinations
    action_scores = {
        "compliment": default_scores["simple"],
        "flirt": default_scores["social"],
        "ask_out": lambda: (
            tertiary_traits[TertiaryTraits.CONNECTION],
            primary_traits[PrimaryTraits.CONFIDENCE]
        ),
        "confess_love": lambda: (
            tertiary_traits[TertiaryTraits.DESTINY],
            tertiary_traits[TertiaryTraits.CONNECTION]
        ),
    }
    
    # Use known scores or default to simple
    score_func = action_scores.get(action_type, default_scores["simple"])
    return score_func()

def determine_roll_result(roll: int, target: int) -> RollResult:
    """
    Determine the result of a roll against a target number.
    
    Critical results are determined by:
    - Critical Success: Roll <= 10% of target
    - Success: Roll <= target
    - Failure: Roll > target
    - Critical Failure: Roll > 190% of target
    
    Args:
        roll: The actual roll value (1-100)
        target: The target number to beat
        
    Returns:
        RollResult indicating the outcome
    """
    if roll <= target * 0.1:  # Critical success: Roll is <= 10% of target
        return RollResult.CRITICAL_SUCCESS
    elif roll <= target:  # Normal success
        return RollResult.SUCCESS
    elif roll > target * 1.9:  # Critical failure: Roll is > 90% above target
        return RollResult.CRITICAL_FAILURE
    else:  # Normal failure
        return RollResult.FAILURE

def perform_geist_roll(request: GeistRollRequest) -> GeistRollResponse:
    """
    Perform a Geist roll and return the results.
    
    The Geist system combines:
    1. Base probability from the action table
    2. Trait modifiers based on character stats
    3. Random roll element
    4. Critical success/failure mechanics
    
    Args:
        request: The roll request containing action type and character traits
        
    Returns:
        Complete roll results including probabilities and outcome
    """
    # Get or create probability for the action
    base_probability, is_new_action = get_or_create_action_probability(
        request.action_type,
        request.complexity
    )
    
    # Get trait scores for the action
    primary_score, secondary_score = get_trait_scores(
        request.action_type,
        request.primary_traits,
        request.secondary_traits,
        request.tertiary_traits
    )
    
    # Apply trait bonuses using modifiers
    with_primary = apply_trait_bonus(base_probability, primary_score)
    final_probability = apply_trait_bonus(with_primary, secondary_score)
    
    # Perform the roll (1-100)
    roll_value = random.randint(1, 100)
    
    # Determine the result
    result = determine_roll_result(roll_value, final_probability)
    
    # Get complexity for response
    complexity = request.complexity or COMMON_ACTIONS.get(request.action_type)
    
    # Calculate total trait modifier
    trait_modifier = final_probability - base_probability
    
    return GeistRollResponse(
        action_type=request.action_type,
        is_new_action=is_new_action,
        complexity=complexity,
        base_probability=base_probability,
        trait_modifier=trait_modifier,
        final_probability=final_probability,
        roll_value=roll_value,
        result=result
    ) 