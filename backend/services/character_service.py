# Standard library imports
from typing import Dict
# Local application imports
from models.character import (
    Character,
    CharacterCreateRequest,
    PrimaryTraits,
    SecondaryTraits,
    TertiaryTraits,
)

def calculate_secondary_traits(primary_traits: Dict[PrimaryTraits, int]) -> Dict[SecondaryTraits, int]:
    """
    Calculate secondary traits based on primary traits.
    
    Secondary traits are derived from combinations of primary traits:
    - Impression: Average of Charm and Style
    - Flirtation: Average of Wit and Confidence
    - Chemistry: Average of Empathy and Luck
    
    Args:
        primary_traits: Dictionary of primary trait values
        
    Returns:
        Dictionary of calculated secondary trait values
    """
    return {
        SecondaryTraits.IMPRESSION: (primary_traits[PrimaryTraits.CHARM] + primary_traits[PrimaryTraits.STYLE]) // 2,
        SecondaryTraits.FLIRTATION: (primary_traits[PrimaryTraits.WIT] + primary_traits[PrimaryTraits.CONFIDENCE]) // 2,
        SecondaryTraits.CHEMISTRY: (primary_traits[PrimaryTraits.EMPATHY] + primary_traits[PrimaryTraits.LUCK]) // 2,
    }

def calculate_tertiary_traits(
    primary_traits: Dict[PrimaryTraits, int],
    secondary_traits: Dict[SecondaryTraits, int]
) -> Dict[TertiaryTraits, int]:
    """
    Calculate tertiary traits based on primary and secondary traits.
    
    Tertiary traits represent complex character aspects:
    - Romance: Average of Impression and Flirtation
    - Connection: Average of Chemistry and Empathy
    - Destiny: Average of Luck and Chemistry
    
    Args:
        primary_traits: Dictionary of primary trait values
        secondary_traits: Dictionary of secondary trait values
        
    Returns:
        Dictionary of calculated tertiary trait values
    """
    return {
        TertiaryTraits.ROMANCE: (
            secondary_traits[SecondaryTraits.IMPRESSION] +
            secondary_traits[SecondaryTraits.FLIRTATION]
        ) // 2,
        TertiaryTraits.CONNECTION: (
            secondary_traits[SecondaryTraits.CHEMISTRY] +
            primary_traits[PrimaryTraits.EMPATHY]
        ) // 2,
        TertiaryTraits.DESTINY: (
            primary_traits[PrimaryTraits.LUCK] +
            secondary_traits[SecondaryTraits.CHEMISTRY]
        ) // 2,
    }

def create_character(character_request: CharacterCreateRequest) -> Character:
    """
    Create a complete character profile with all traits calculated.
    
    This function takes the basic character creation request with primary traits
    and generates a full character profile by calculating secondary and tertiary
    traits based on the established formulas.
    
    Args:
        character_request: The initial character creation request with name and primary traits
        
    Returns:
        A complete Character object with all traits calculated
    """
    # Calculate derived traits
    secondary_traits = calculate_secondary_traits(character_request.primary_traits)
    tertiary_traits = calculate_tertiary_traits(character_request.primary_traits, secondary_traits)
    
    # Create and return the complete character profile
    return Character(
        name=character_request.name,
        primary_traits=character_request.primary_traits,
        secondary_traits=secondary_traits,
        tertiary_traits=tertiary_traits,
    ) 