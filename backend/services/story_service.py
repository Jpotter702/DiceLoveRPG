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
    DialogueTone.FRIENDLY: 1,        # Safe, small bonus
    DialogueTone.FLIRTY: 2,         # Higher risk/reward
    DialogueTone.SERIOUS: 0,        # Neutral
    DialogueTone.PLAYFUL: 1,        # Safe, small bonus
    DialogueTone.ROMANTIC: 3,       # Highest risk/reward
    DialogueTone.NERVOUS: -1,       # Small penalty
    DialogueTone.SYMPATHETIC: 2,    # Good for emotional support
    DialogueTone.ENTHUSIASTIC: 2,   # Good for shared interests
    DialogueTone.APOLOGETIC: 1,     # Good for recovery
    DialogueTone.CONFIDENT: 2       # Good for impressions
}

# Risk levels for each tone
TONE_RISK_LEVELS = {
    DialogueTone.FRIENDLY: "Safe",
    DialogueTone.FLIRTY: "Risky",
    DialogueTone.SERIOUS: "Safe",
    DialogueTone.PLAYFUL: "Safe",
    DialogueTone.ROMANTIC: "Very Risky",
    DialogueTone.NERVOUS: "Moderate",
    DialogueTone.SYMPATHETIC: "Safe",
    DialogueTone.ENTHUSIASTIC: "Moderate",
    DialogueTone.APOLOGETIC: "Safe",
    DialogueTone.CONFIDENT: "Risky"
}

# Success chance thresholds
SUCCESS_CHANCES = {
    "High": 70,
    "Medium": 50,
    "Low": 30
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
        # npc_id -> player_id -> {interactions: list, topics: set, relationship_milestones: list}
        self.npc_memory: Dict[str, Dict[str, Dict[str, any]]] = {}
        
    def _update_npc_memory(
        self,
        npc_id: str,
        player_name: str,
        interaction: str,
        is_player: bool = True
    ):
        """
        Update the NPC's memory of interactions with a player.
        
        Args:
            npc_id: The ID of the NPC
            player_name: The name of the player
            interaction: The interaction text
            is_player: Whether this is a player's action (True) or NPC's response (False)
        """
        # Initialize memory structure if needed
        if npc_id not in self.npc_memory:
            self.npc_memory[npc_id] = {}
        if player_name not in self.npc_memory[npc_id]:
            self.npc_memory[npc_id][player_name] = {
                "interactions": [],
                "topics": set(),
                "relationship_milestones": []
            }
            
        memory = self.npc_memory[npc_id][player_name]
        
        # Add interaction to history (keep last 10)
        prefix = "Player" if is_player else "NPC"
        memory["interactions"] = memory["interactions"][-9:] + [f"{prefix}: {interaction}"]
        
        # Extract and store topics (simple keyword extraction)
        words = interaction.lower().split()
        topics = {"art", "music", "food", "hobby", "work", "family", "friends", "love"}
        found_topics = topics.intersection(set(words))
        memory["topics"].update(found_topics)
        
    def _get_relevant_context(
        self,
        npc_id: str,
        player_name: str,
        current_location: str,
        current_topic: Optional[str] = None
    ) -> List[str]:
        """
        Get relevant context for the current interaction.
        
        Prioritizes:
        1. Recent interactions in the same location
        2. Previous interactions about the same topic
        3. Important relationship milestones
        4. General recent interactions
        """
        if npc_id not in self.npc_memory or player_name not in self.npc_memory[npc_id]:
            return []
            
        memory = self.npc_memory[npc_id][player_name]
        context = []
        
        # Add location-specific memories
        location_memories = [
            mem for mem in memory["interactions"]
            if current_location.lower() in mem.lower()
        ][-2:]  # Last 2 interactions in this location
        if location_memories:
            context.append(f"Previous at {current_location}:")
            context.extend(location_memories)
        
        # Add topic-specific memories if a topic is detected
        if current_topic and current_topic in memory["topics"]:
            topic_memories = [
                mem for mem in memory["interactions"]
                if current_topic.lower() in mem.lower()
            ][-2:]  # Last 2 interactions about this topic
            if topic_memories:
                context.append(f"Previous about {current_topic}:")
                context.extend(topic_memories)
        
        # Add relationship milestones
        if memory["relationship_milestones"]:
            context.append("Important moments:")
            context.extend(memory["relationship_milestones"][-2:])  # Last 2 milestones
        
        # Add recent general interactions
        recent_interactions = memory["interactions"][-3:]  # Last 3 interactions
        if recent_interactions:
            context.append("Recent interactions:")
            context.extend(recent_interactions)
        
        return context

    def _update_relationship_milestone(
        self,
        npc_id: str,
        player_name: str,
        level_up: Optional[AffectionLevel],
        interaction: str
    ):
        """Record important relationship milestones."""
        if not level_up or npc_id not in self.npc_memory or player_name not in self.npc_memory[npc_id]:
            return
            
        memory = self.npc_memory[npc_id][player_name]
        milestone = f"Relationship deepened to {level_up.value} - {interaction}"
        memory["relationship_milestones"].append(milestone)

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

    def get_dialogue_options(
        self,
        npc_id: str,
        player_name: str,
        story_context: StoryContext,
        npc_state: NPCState
    ) -> DialogueOptions:
        """
        Get available dialogue options with recommendations based on current context.
        
        Considers:
        1. NPC's current mood
        2. Relationship level
        3. Location and time
        4. Recent interactions
        5. Shared interests/topics
        """
        all_choices = []
        current_context = {
            "mood": npc_state.mood.value,
            "affection": str(npc_state.affection),
            "location": story_context.location,
            "time": story_context.time_of_day,
            "event": story_context.current_event or "Regular interaction"
        }
        
        # Get memory context
        memory = self.npc_memory.get(npc_id, {}).get(player_name, {})
        recent_topics = memory.get("topics", set())
        
        for tone in DialogueTone:
            success_chance = self._calculate_success_chance(
                tone,
                npc_state.mood,
                npc_state.affection,
                recent_topics
            )
            
            is_recommended = self._is_tone_recommended(
                tone,
                npc_state,
                story_context,
                recent_topics
            )
            
            reason = self._get_tone_recommendation_reason(
                tone,
                npc_state,
                story_context,
                recent_topics,
                is_recommended
            )
            
            choice = ToneChoice(
                tone=tone,
                is_recommended=is_recommended,
                reason=reason,
                success_chance=success_chance,
                risk_level=TONE_RISK_LEVELS[tone]
            )
            all_choices.append(choice)
        
        # Split into recommended and other choices
        recommended = [c for c in all_choices if c.is_recommended]
        others = [c for c in all_choices if not c.is_recommended]
        
        return DialogueOptions(
            recommended_tones=recommended,
            other_tones=others,
            current_context=current_context
        )

    def _calculate_success_chance(
        self,
        tone: DialogueTone,
        mood: NPCMood,
        affection: int,
        recent_topics: set
    ) -> str:
        """Calculate the success chance category for a tone."""
        base_chance = 50
        
        # Add tone modifier
        base_chance += TONE_MODIFIERS[tone] * 10
        
        # Add mood modifier
        base_chance += MOOD_MODIFIERS[mood] * 10
        
        # Add affection bonus
        if affection >= tone.recommended_affection:
            base_chance += 10
        else:
            base_chance -= 10
        
        # Add context bonuses
        if tone == DialogueTone.ENTHUSIASTIC and recent_topics:
            base_chance += 10
        elif tone == DialogueTone.SYMPATHETIC and mood in [NPCMood.SAD, NPCMood.CONFUSED]:
            base_chance += 15
        
        # Determine chance category
        if base_chance >= SUCCESS_CHANCES["High"]:
            return "High"
        elif base_chance >= SUCCESS_CHANCES["Medium"]:
            return "Medium"
        else:
            return "Low"

    def _is_tone_recommended(
        self,
        tone: DialogueTone,
        npc_state: NPCState,
        story_context: StoryContext,
        recent_topics: set
    ) -> bool:
        """Determine if a tone is recommended for the current context."""
        # Check affection requirement
        if npc_state.affection < tone.recommended_affection:
            return False
            
        # Specific context recommendations
        if tone == DialogueTone.SYMPATHETIC and npc_state.mood in [NPCMood.SAD, NPCMood.CONFUSED]:
            return True
        elif tone == DialogueTone.ENTHUSIASTIC and recent_topics:
            return True
        elif tone == DialogueTone.ROMANTIC and npc_state.affection >= 60:
            return True
        elif tone == DialogueTone.APOLOGETIC and npc_state.mood == NPCMood.ANNOYED:
            return True
        
        # Default recommendations
        return tone in [DialogueTone.FRIENDLY, DialogueTone.PLAYFUL]

    def _get_tone_recommendation_reason(
        self,
        tone: DialogueTone,
        npc_state: NPCState,
        story_context: StoryContext,
        recent_topics: set,
        is_recommended: bool
    ) -> str:
        """Get a contextual reason for the tone recommendation."""
        if not is_recommended:
            if npc_state.affection < tone.recommended_affection:
                return f"Need higher affection (currently {npc_state.affection}, need {tone.recommended_affection})"
            return "Not ideal for current situation"
            
        if tone == DialogueTone.SYMPATHETIC and npc_state.mood in [NPCMood.SAD, NPCMood.CONFUSED]:
            return f"{npc_state.name} seems to need emotional support"
        elif tone == DialogueTone.ENTHUSIASTIC and recent_topics:
            topics_str = ", ".join(recent_topics)
            return f"Good for discussing shared interests: {topics_str}"
        elif tone == DialogueTone.ROMANTIC and npc_state.affection >= 60:
            return "Your relationship has developed enough for romantic gestures"
        elif tone == DialogueTone.APOLOGETIC and npc_state.mood == NPCMood.ANNOYED:
            return f"{npc_state.name} seems annoyed - might be good to apologize"
        
        return tone.description

    async def process_interaction(self, request: DialogueRequest) -> DialogueResponse:
        """
        Process a dialogue interaction and generate a response.
        
        This method:
        1. Gets relevant context from memory
        2. Generates the NPC's response using the LLM
        3. Calculates the roll result based on tone and mood
        4. Updates the NPC's affection points
        5. Updates interaction memory
        """
        # Get current NPC state
        npc = affection_service.get_npc(request.npc_id)
        if not npc:
            npc = affection_service.create_npc(request.npc_state.name)
        
        # Get relevant context
        context = self._get_relevant_context(
            request.npc_id,
            request.player_name,
            request.story_context.location
        )
        request.npc_state.context = context
        
        # Generate initial response using HuggingFace
        response_text, new_mood, mood_reason, base_ap_change = (
            huggingface_client.generate_dialogue_response(request)
        )
        
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
            "dialogue"
        )
        
        # Update NPC memory with player's action
        self._update_npc_memory(
            request.npc_id,
            request.player_name,
            f"{request.player_dialogue} [{request.dialogue_tone}]",
            is_player=True
        )
        
        # Update NPC memory with response
        self._update_npc_memory(
            request.npc_id,
            request.player_name,
            f"{response_text} [{new_mood}]",
            is_player=False
        )
        
        # Record milestone if relationship leveled up
        if level_up:
            self._update_relationship_milestone(
                request.npc_id,
                request.player_name,
                level_up,
                request.player_dialogue
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
        
        return response

# Initialize global story service
story_service = StoryService() 