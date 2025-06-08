# 🎭 Phase 3: Roleplay + AI Integration

## Overview
Phase 3 focused on enhancing the game's immersion through advanced AI integration and dynamic storytelling. The key achievements were:
1. Enhanced LLM prompts for romantic comedy/drama tone
2. Sophisticated context memory system
3. Dynamic dialogue tone system

## Features Implemented

### 1. Enhanced LLM Prompts
- Tuned HuggingFace prompts for romantic comedy/drama style
- Added emotional expression through actions (e.g., *blushes*, *smiles warmly*)
- Contextual response generation based on relationship status
- Personality consistency with relationship growth

### 2. Context Memory System
- **Structured Memory Storage**:
  - Recent interactions history
  - Topic tracking
  - Relationship milestones
  - Location-specific memories

- **Smart Context Retrieval**:
  - Prioritizes relevant past interactions
  - Remembers shared interests and topics
  - Tracks important relationship moments
  - Location and time-aware context

### 3. Dynamic Dialogue Tone System
- **10 Distinct Tones**:
  ```python
  FRIENDLY     # Safe, reliable choice
  FLIRTY      # Higher risk/reward
  SERIOUS     # Good for important talks
  PLAYFUL     # Safe, good for rapport
  ROMANTIC    # Highest risk/reward
  NERVOUS     # Shows vulnerability
  SYMPATHETIC # For emotional support
  ENTHUSIASTIC# For shared interests
  APOLOGETIC  # For making amends
  CONFIDENT   # Shows assertiveness
  ```

- **Smart Tone Recommendations**:
  - Context-aware suggestions
  - Success chance predictions
  - Risk/reward explanations
  - Affection requirements

- **Tone Effects System**:
  - Mood-based modifiers
  - Relationship-dependent outcomes
  - Context-specific bonuses
  - Risk/reward balancing

### 4. API Endpoints

#### Get Dialogue Options
```http
POST /api/story/dialogue_options
```
Returns available tones with recommendations based on:
- NPC's current mood
- Relationship level
- Location and time
- Recent interactions
- Shared interests

Example Response:
```json
{
    "recommended_tones": [
        {
            "tone": "sympathetic",
            "is_recommended": true,
            "reason": "Sakura seems to need emotional support",
            "success_chance": "High",
            "risk_level": "Safe"
        }
    ],
    "other_tones": [
        {
            "tone": "romantic",
            "is_recommended": false,
            "reason": "Need higher affection (currently 30, need 50)",
            "success_chance": "Low",
            "risk_level": "Very Risky"
        }
    ],
    "current_context": {
        "mood": "sad",
        "affection": "30",
        "location": "Park",
        "time": "evening",
        "event": "Regular interaction"
    }
}
```

#### Process Interaction
```http
POST /api/story/interact
```
Enhanced with:
- Contextual memory integration
- Tone-aware response generation
- Relationship milestone tracking
- Emotional expression in responses

Example Response:
```json
{
    "npc_id": "sakura",
    "npc_name": "Sakura",
    "response_text": "*looks up with grateful eyes* You noticed... *sighs softly* I've been having a tough time with my art lately...",
    "new_mood": "neutral",
    "mood_change_reason": "Felt understood and supported",
    "affection_change": 5
}
```

## Technical Implementation

### Memory Management
```python
class StoryService:
    def __init__(self):
        # npc_id -> player_id -> {interactions, topics, milestones}
        self.npc_memory: Dict[str, Dict[str, Dict[str, any]]] = {}
```

### Success Calculation
```python
def _calculate_success_chance(self, tone, mood, affection, topics):
    base_chance = 50
    base_chance += TONE_MODIFIERS[tone] * 10
    base_chance += MOOD_MODIFIERS[mood] * 10
    
    if affection >= tone.recommended_affection:
        base_chance += 10
    else:
        base_chance -= 10
        
    # Context bonuses
    if tone == DialogueTone.ENTHUSIASTIC and topics:
        base_chance += 10
    elif tone == DialogueTone.SYMPATHETIC and mood in [NPCMood.SAD]:
        base_chance += 15
```

## Future Enhancements
Potential areas for future development:
1. Persistent memory storage
2. More sophisticated topic detection
3. Special event/location-based tone recommendations
4. Enhanced success chance calculations
5. Tone-specific dialogue templates

## Conclusion
Phase 3 significantly enhanced the game's immersion through:
- Smarter AI responses
- Context-aware interactions
- Dynamic tone system
- Realistic relationship progression

The system now provides players with meaningful choices while maintaining natural character development and emotional depth. 