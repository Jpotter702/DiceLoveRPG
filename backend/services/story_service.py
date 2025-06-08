from typing import Dict, Optional
from models.story import DialogueRequest, DialogueResponse, NPCMood
from services.huggingface_api import huggingface_client

class StoryService:
    def __init__(self):
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

    def _get_relationship_status(self, affection: int) -> str:
        """Determine relationship status based on affection level."""
        if affection < 20:
            return "stranger"
        elif affection < 40:
            return "acquaintance"
        elif affection < 60:
            return "friend"
        elif affection < 80:
            return "close_friend"
        else:
            return "romantic_interest"

    async def process_interaction(self, request: DialogueRequest) -> DialogueResponse:
        """Process a dialogue interaction and generate a response."""
        # Generate response using HuggingFace
        response_text, new_mood, mood_reason, affection_delta = (
            huggingface_client.generate_dialogue_response(request)
        )
        
        # Update NPC memory
        self._update_npc_memory(
            request.npc_id,
            request.player_name,
            f"Player: {request.player_dialogue} [{request.dialogue_tone}]"
        )
        
        # Create the response
        response = DialogueResponse(
            npc_id=request.npc_id,
            npc_name=request.npc_state.name,
            response_text=response_text,
            new_mood=new_mood,
            mood_change_reason=mood_reason,
            affection_change=affection_delta
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