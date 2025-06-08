# Love & Dice RPG API Reference

## Table of Contents
1. [Character API](#character-api)
2. [Geist API](#geist-api)
3. [Story API](#story-api)
4. [Image API](#image-api)
5. [Common Models](#common-models)

## Character API

### Create Character
Create a new character with primary traits.

**Endpoint:** `POST /api/character/create`

**Request Body:**
```json
{
    "name": "Alex",
    "primary_traits": {
        "charm": 70,
        "wit": 65,
        "empathy": 80,
        "style": 75,
        "confidence": 60,
        "luck": 50
    }
}
```

**Response:**
```json
{
    "name": "Alex",
    "primary_traits": {
        "charm": 70,
        "wit": 65,
        "empathy": 80,
        "style": 75,
        "confidence": 60,
        "luck": 50
    },
    "secondary_traits": {
        "impression": 72,
        "flirtation": 62,
        "chemistry": 67
    },
    "tertiary_traits": {
        "romance": 67,
        "connection": 73,
        "destiny": 61
    }
}
```

## Geist API

### Perform Roll
Execute a Geist roll for an action.

**Endpoint:** `POST /api/geist/roll`

**Request Body:**
```json
{
    "action_type": "flirt",
    "complexity": "moderate",
    "primary_traits": {
        "charm": 75,
        "wit": 65,
        "empathy": 80
    },
    "secondary_traits": {
        "impression": 70,
        "flirtation": 65
    },
    "tertiary_traits": {
        "romance": 67,
        "connection": 73
    }
}
```

**Response:**
```json
{
    "action_type": "flirt",
    "is_new_action": false,
    "complexity": "moderate",
    "base_probability": 60,
    "trait_modifier": 15,
    "final_probability": 75,
    "roll_value": 45,
    "result": "success"
}
```

### List Actions
Get available actions and their complexities.

**Endpoint:** `GET /api/geist/actions`

**Response:**
```json
{
    "common_actions": {
        "compliment": "simple",
        "flirt": "moderate",
        "ask_out": "complex",
        "confess_love": "very_complex"
    },
    "default_probabilities": {
        "simple": 70,
        "moderate": 60,
        "complex": 50,
        "very_complex": 40
    }
}
```

## Story API

### Process Interaction
Handle a dialogue interaction with an NPC.

**Endpoint:** `POST /api/story/interact`

**Request Body:**
```json
{
    "npc_id": "sakura",
    "player_name": "Alex",
    "player_dialogue": "I really enjoyed our time together",
    "dialogue_tone": "friendly",
    "npc_state": {
        "name": "Sakura",
        "affection": 65,
        "mood": "happy",
        "context": ["Previous interactions..."],
        "relationship_status": "friend"
    },
    "story_context": {
        "location": "Park",
        "time_of_day": "evening",
        "current_event": "Evening walk"
    }
}
```

**Response:**
```json
{
    "response_text": "I had a wonderful time too! The evening light makes everything so magical.",
    "new_mood": "happy",
    "mood_change_reason": "Enjoyed the shared experience",
    "affection_change": 5
}
```

## Image API

### Generate Image
Generate an image based on a prompt.

**Endpoint:** `POST /api/image/generate`

**Request Body:**
```json
{
    "prompt": "A young woman with short black hair in a casual dress, standing in a park at sunset",
    "style": "anime",
    "context": {
        "character": "Sakura",
        "location": "Park",
        "time_of_day": "evening"
    }
}
```

**Response:**
```json
{
    "image_url": "https://storage.example.com/images/generated/123.png",
    "prompt_used": "anime style, young woman with short black hair...",
    "generation_params": {
        "style": "anime",
        "seed": 12345
    }
}
```

## Common Models

### Action Complexity
```python
class ActionComplexity(str, Enum):
    SIMPLE = "simple"          # 70% base
    MODERATE = "moderate"      # 60% base
    COMPLEX = "complex"        # 50% base
    VERY_COMPLEX = "very_complex"  # 40% base
```

### Roll Result
```python
class RollResult(str, Enum):
    CRITICAL_SUCCESS = "critical_success"   # Roll <= 10% of target
    SUCCESS = "success"                     # Roll <= target
    FAILURE = "failure"                     # Roll > target
    CRITICAL_FAILURE = "critical_failure"   # Roll > 190% of target
```

### Dialogue Tone
```python
class DialogueTone(str, Enum):
    FRIENDLY = "friendly"    # +1 AP mod
    FLIRTY = "flirty"       # +2 AP mod
    SERIOUS = "serious"     # +0 AP mod
    PLAYFUL = "playful"     # +1 AP mod
    ROMANTIC = "romantic"   # +3 AP mod
    NERVOUS = "nervous"     # -1 AP mod
```

### NPC Mood
```python
class NPCMood(str, Enum):
    HAPPY = "happy"         # +1 mod
    NEUTRAL = "neutral"     # +0 mod
    SAD = "sad"            # -1 mod
    EXCITED = "excited"    # +2 mod
    ANNOYED = "annoyed"    # -2 mod
    SMITTEN = "smitten"    # +3 mod
    CONFUSED = "confused"  # +0 mod
``` 