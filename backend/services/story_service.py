import json
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from models.story import DialogueRequest, DialogueResponse, NPCMood, DialogueTone
from models.npc import AffectionLevel
from services.huggingface_api import huggingface_client
from services.affection_service import affection_service
from models.geist import RollResult

# Tone-based AP modifiers
TONE_MODIFIERS = {
    DialogueTone.FRIENDLY: 1,    # Safe, small bonus
    DialogueTone.FLIRTY: 2,      # Higher risk/reward
    DialogueTone.SERIOUS: 0,     # Neutral
    DialogueTone.PLAYFUL: 1,     # Safe, small bonus
    DialogueTone.ROMANTIC: 3,    # Highest risk/reward
    DialogueTone.NERVOUS: -1     # Small penalty
}

# Mood-based response modifiers
MOOD_MODIFIERS = {
    NPCMood.HAPPY: 1,
    NPCMood.NEUTRAL: 0,
    NPCMood.SAD: -1,
    NPCMood.EXCITED: 2,
    NPCMood.ANNOYED: -2,
    NPCMood.SMITTEN: 3,
    NPCMood.CONFUSED: 0
}

class StoryService:
    def __init__(self):
        """Initialize the story service with interaction memory."""
        self.npc_memory: Dict[str, Dict[str, list]] = {}  # npc_id -> player_id -> interaction history
        
    def _update_npc_memory(self, npc_id: str, player_name: str, interaction: str):
        """Update the NPC's memory of interactions with a player."""
        if npc_id not in self.npc_memory:
            self.npc_memory[npc_id] = {}
        if player_name not in self.npc_memory[npc_id]:
            self.npc_memory[npc_id][player_name] = []
            
        # Keep last 10 interactions
        self.npc_memory[npc_id][player_name] = (
            self.npc_memory[npc_id][player_name][-9:] + [interaction]
        )

    def _calculate_roll_result(
        self,
        base_ap_change: int,
        tone: DialogueTone,
        current_mood: NPCMood,
        relationship_level: AffectionLevel
    ) -> RollResult:
        """
        Calculate the roll result based on AP change and modifiers.
        
        The roll result determines how well the interaction went, which affects
        both the NPC's response and future AP calculations.
        """
        # Get modifiers
        tone_mod = TONE_MODIFIERS[tone]
        mood_mod = MOOD_MODIFIERS[current_mood]
        
        # Calculate total score
        total_score = base_ap_change + tone_mod + mood_mod
        
        # Adjust thresholds based on relationship level
        if relationship_level == AffectionLevel.STRANGER:
            # Harder to succeed with strangers
            if total_score >= 8:
                return RollResult.CRITICAL_SUCCESS
            elif total_score >= 4:
                return RollResult.SUCCESS
            elif total_score <= -6:
                return RollResult.CRITICAL_FAILURE
            else:
                return RollResult.FAILURE
        else:
            # Easier with established relationships
            if total_score >= 6:
                return RollResult.CRITICAL_SUCCESS
            elif total_score >= 2:
                return RollResult.SUCCESS
            elif total_score <= -4:
                return RollResult.CRITICAL_FAILURE
            else:
                return RollResult.FAILURE

    async def process_interaction(self, request: DialogueRequest) -> DialogueResponse:
        """
        Process a dialogue interaction and generate a response.
        
        This method:
        1. Generates the NPC's response using the LLM
        2. Calculates the roll result based on tone and mood
        3. Updates the NPC's affection points
        4. Updates interaction memory
        """
        # Generate initial response using HuggingFace
        response_text, new_mood, mood_reason, base_ap_change = (
            huggingface_client.generate_dialogue_response(request)
        )
        
        # Get current NPC state
        npc = affection_service.get_npc(request.npc_id)
        if not npc:
            # Create NPC if they don't exist
            npc = affection_service.create_npc(request.npc_state.name)
        
        # Calculate roll result
        roll_result = self._calculate_roll_result(
            base_ap_change,
            request.dialogue_tone,
            request.npc_state.mood,
            npc.level
        )
        
        # Update NPC's affection points based on roll result
        npc, ap_change, level_up = affection_service.update_ap(
            request.npc_id,
            roll_result,
            "dialogue"  # Using generic dialogue type
        )
        
        # Update NPC memory with interaction
        self._update_npc_memory(
            request.npc_id,
            request.player_name,
            f"Player: {request.player_dialogue} [{request.dialogue_tone}]"
        )
        
        # Create response message
        message = mood_reason
        if level_up:
            message += f" Your relationship has deepened to {level_up.value}!"
        
        # Create the response
        response = DialogueResponse(
            npc_id=request.npc_id,
            npc_name=request.npc_state.name,
            response_text=response_text,
            new_mood=new_mood,
            mood_change_reason=message,
            affection_change=ap_change
        )
        
        # Update NPC memory with response
        self._update_npc_memory(
            request.npc_id,
            request.player_name,
            f"NPC ({request.npc_state.name}): {response_text} [{new_mood}]"
        )
        
        return response

# Initialize global story service
story_service = StoryService() 