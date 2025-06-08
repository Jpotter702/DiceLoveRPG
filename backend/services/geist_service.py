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

def save_probability_table(table: Dict[str, int]) -> None:
    """
    Save the probability table to disk.
    
    Args:
        table: Dictionary mapping action names to their base probabilities
    """
    with open(PROB_TABLE_PATH, 'w') as f:
        json.dump(table, f, indent=2)

def get_or_create_action_probability(
    action_type: str,
    complexity: Optional[ActionComplexity] = None
) -> Tuple[int, bool]:
    """
    Get the probability for an action, creating it if it doesn't exist.
    
    Args:
        action_type: The type of action being attempted
        complexity: Optional complexity level for new actions
        
    Returns:
        Tuple of (base_probability, is_new_action)
    """
    prob_table = load_probability_table()
    
    # Return existing probability if available
    if action_type in prob_table:
        return prob_table[action_type], False
        
    # Determine complexity for new action
    if complexity is None:
        complexity = COMMON_ACTIONS.get(action_type, ActionComplexity.MODERATE)
    
    # Get default probability based on complexity
    probability = DEFAULT_PROBABILITIES[complexity]
    
    # Save new action to probability table
    prob_table[action_type] = probability
    save_probability_table(prob_table)
    
    return probability, True

def get_trait_modifier(
    action_type: str,
    primary_traits: Dict[PrimaryTraits, int],
    secondary_traits: Dict[SecondaryTraits, int],
    tertiary_traits: Dict[TertiaryTraits, int]
) -> int:
    """
    Calculate trait modifier based on action type and character traits.
    
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
        Integer modifier to be added to the base probability
    """
    # Default modifiers for unknown actions
    default_modifiers = {
        "simple": lambda: (
            primary_traits[PrimaryTraits.CHARM] * 0.3 +
            secondary_traits[SecondaryTraits.IMPRESSION] * 0.2
        ),
        "social": lambda: (
            secondary_traits[SecondaryTraits.FLIRTATION] * 0.3 +
            tertiary_traits[TertiaryTraits.ROMANCE] * 0.2
        ),
        "emotional": lambda: (
            tertiary_traits[TertiaryTraits.CONNECTION] * 0.3 +
            primary_traits[PrimaryTraits.EMPATHY] * 0.2
        ),
    }
    
    # Known action modifiers
    action_modifiers = {
        "compliment": default_modifiers["simple"],
        "flirt": default_modifiers["social"],
        "ask_out": lambda: (
            tertiary_traits[TertiaryTraits.CONNECTION] * 0.3 +
            primary_traits[PrimaryTraits.CONFIDENCE] * 0.2
        ),
        "confess_love": lambda: (
            tertiary_traits[TertiaryTraits.DESTINY] * 0.3 +
            tertiary_traits[TertiaryTraits.CONNECTION] * 0.2
        ),
    }
    
    # Use known modifier or default to simple
    modifier_func = action_modifiers.get(action_type, default_modifiers["simple"])
    return int(modifier_func())

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
    
    # Calculate trait modifier
    trait_modifier = get_trait_modifier(
        request.action_type,
        request.primary_traits,
        request.secondary_traits,
        request.tertiary_traits
    )
    
    # Calculate final probability (capped at 95 for critical success possibility)
    final_probability = min(95, base_probability + trait_modifier)
    
    # Perform the roll (1-100)
    roll_value = random.randint(1, 100)
    
    # Determine the result
    result = determine_roll_result(roll_value, final_probability)
    
    # Get complexity for response
    complexity = request.complexity or COMMON_ACTIONS.get(request.action_type)
    
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