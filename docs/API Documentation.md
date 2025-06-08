# Love & Dice RPG API Documentation

## Overview
This document describes the API endpoints for the Love & Dice RPG game, a dating simulation with RPG elements. The API provides functionality for character creation, action resolution through the Geist system, story interactions, and image generation.

## Base URL
```
http://localhost:8000/
```

## Authentication
Currently using environment variables for API keys (HuggingFace). Authentication system for players to be implemented in future phases.

## Endpoints

### 1. Character Creation
#### `POST /character/create`
Creates a new character with calculated primary, secondary, and tertiary traits.

**Request Body:**
```json
{
    "name": "Alex",
    "primary_traits": {
        "charm": 75,
        "wit": 65,
        "empathy": 80,
        "style": 70,
        "confidence": 60,
        "luck": 55
    }
}
```

**Response:**
```json
{
    "name": "Alex",
    "primary_traits": {
        "charm": 75,
        "wit": 65,
        "empathy": 80,
        "style": 70,
        "confidence": 60,
        "luck": 55
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

### 2. Geist Roll System
#### `POST /geist/roll`
Performs a probability check for character actions, incorporating traits and base probabilities.

**Request Body:**
```json
{
    "action_type": "flirt",
    "primary_traits": {
        "charm": 75,
        "wit": 65,
        "empathy": 80,
        "style": 70,
        "confidence": 60,
        "luck": 55
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

### 3. Story Interaction
#### `POST /story/interact`
Handles dialogue interactions with NPCs using AI-generated responses.

**Request Body:**
```json
{
    "npc_id": "sakura",
    "player_name": "Alex",
    "player_dialogue": "I really enjoyed our time at the cafe today.",
    "dialogue_tone": "friendly",
    "npc_state": {
        "name": "Sakura",
        "affection": 65,
        "mood": "happy",
        "context": [
            "Met at the local cafe",
            "Shared interest in art"
        ],
        "relationship_status": "friend"
    },
    "story_context": {
        "location": "Park",
        "time_of_day": "evening",
        "current_event": "Evening walk",
        "previous_interactions": [
            "Had coffee together",
            "Discussed favorite artists"
        ]
    }
}
```

**Response:**
```json
{
    "npc_id": "sakura",
    "npc_name": "Sakura",
    "response_text": "I had a wonderful time too! Your insights about modern art were fascinating.",
    "new_mood": "happy",
    "mood_change_reason": "Player showed genuine interest in shared hobby",
    "affection_change": 5
}
```

### 4. Image Generation
#### `POST /image/generate`
Generates character and scene images using Stable Diffusion.

**Request Body:**
```json
{
    "base_prompt": "A young woman sitting in a cozy cafe",
    "style": "anime",
    "mood": "peaceful",
    "character_name": "Sakura",
    "location": "Downtown cafe",
    "time_of_day": "afternoon",
    "additional_details": [
        "warm lighting",
        "coffee cup on table",
        "gentle smile"
    ]
}
```

**Response:**
```json
{
    "prompt_used": "anime style illustration, Studio Ghibli inspired, character named Sakura, A young woman sitting in a cozy cafe, in Downtown cafe, during afternoon, peaceful atmosphere, warm lighting, coffee cup on table, gentle smile, masterpiece, best quality, highly detailed, beautiful composition, sharp focus",
    "image_url": "https://storage.example.com/images/generated/123456.png",
    "style": "anime",
    "seed": 123456
}
```

## Error Handling
All endpoints follow a consistent error response format:

```json
{
    "detail": "Error message describing what went wrong"
}
```

Common HTTP status codes:
- 200: Success
- 400: Bad Request (invalid input)
- 500: Internal Server Error

## Rate Limiting
To be implemented in future phases.

## Development Setup
1. Set environment variables:
   ```bash
   HUGGINGFACE_API_KEY=your_key_here
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the server:
   ```bash
   uvicorn app:app --reload
   ``` 