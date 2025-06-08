# Love & Geist RPG Rulebook

## Table of Contents
1. [Character System](#character-system)
2. [Trait System](#trait-system)
3. [Affection System](#affection-system)
4. [Interaction System](#interaction-system)
5. [API Reference](#api-reference)
6. [Sample Interactions](#sample-interactions)

## Character System

### Character Creation
Characters are defined by three tiers of traits:
- **Primary Traits**: Core attributes that define basic capabilities
- **Secondary Traits**: Derived attributes that combine primary traits
- **Tertiary Traits**: Complex attributes that represent deeper characteristics

### Primary Traits
- **Charm** (1-100): Natural charisma and appeal
- **Wit** (1-100): Quick thinking and humor
- **Empathy** (1-100): Understanding of others' emotions
- **Style** (1-100): Personal presentation and aesthetic
- **Confidence** (1-100): Self-assurance and poise
- **Luck** (1-100): Fortune and serendipity

### Secondary Traits
Secondary traits are calculated from primary traits:
```
Impression = (Charm + Style) / 2
Flirtation = (Wit + Confidence) / 2
Chemistry = (Empathy + Luck) / 2
```

### Tertiary Traits
Tertiary traits combine secondary traits:
```
Romance = (Impression + Flirtation) / 2
Connection = (Chemistry + Empathy) / 2
Destiny = (Luck + Chemistry) / 2
```

## Trait System

### Trait Bonuses
Traits provide bonuses to various actions based on their values:
```python
Bonus = trait_score // 10  # Integer division by 10
```

Example:
- Trait Score 75 = +7 bonus
- Trait Score 32 = +3 bonus

### Action System
The game uses a dynamic action system that supports both predefined and custom actions.

#### Action Complexities
Each action has a complexity level that determines its base probability of success:
```
SIMPLE:       70% base (Easy actions with low risk)
MODERATE:     60% base (Standard actions with moderate risk)
COMPLEX:      50% base (Difficult actions with high risk)
VERY_COMPLEX: 40% base (Challenging actions with very high risk)
```

#### Predefined Actions
Common actions with their default complexities:
- **Compliment** (Simple, 70%): Basic friendly interaction
- **Flirt** (Moderate, 60%): Casual romantic interaction
- **Ask Out** (Complex, 50%): Direct romantic proposal
- **Confess Love** (Very Complex, 40%): Deep emotional expression

#### Custom Actions
Players can create custom actions by:
1. Providing a new action name (alphanumeric + underscores)
2. Optionally specifying a complexity level
3. If no complexity is specified, defaults to MODERATE (60%)

Example custom actions:
- `tell_joke` (Simple): Light-hearted humor
- `share_secret` (Complex): Personal revelation
- `give_gift` (Moderate): Material expression of affection
- `propose_marriage` (Very Complex): Ultimate romantic gesture

#### Trait Combinations
Different actions use different trait combinations:

##### Simple Actions
- Primary: Charm
- Secondary: Impression
Example: Complimenting someone

##### Social Actions
- Primary: Flirtation
- Secondary: Romance
Example: Flirting or casual conversation

##### Emotional Actions
- Primary: Connection
- Secondary: Empathy
Example: Deep conversations or emotional support

## Affection System

### Affection Points (AP)
- Range: 0-100
- Determines relationship status with NPCs
- Modified by interaction results

### Relationship Levels
```
0-20 AP:   Stranger
21-40 AP:  Acquaintance
41-60 AP:  Friend
61-80 AP:  Close
81-100 AP: Romantic
```

### AP Changes
Based on Geist roll results:
```
Critical Success:  +10 AP
Success:          +5 AP
Failure:         -2 AP
Critical Failure: -5 AP
```

### Tone Modifiers
Different dialogue tones affect AP gains/losses:
```
Friendly:  +1 (Safe)
Flirty:    +2 (Risk/Reward)
Serious:    0 (Neutral)
Playful:   +1 (Safe)
Romantic:  +3 (High Risk/Reward)
Nervous:   -1 (Penalty)
```

### Mood Modifiers
NPC moods affect interaction success:
```
Happy:    +1
Neutral:   0
Sad:      -1
Excited:  +2
Annoyed:  -2
Smitten:  +3
Confused:  0
```

## Interaction System

### Dialogue System
Each interaction involves:
1. Player dialogue
2. Dialogue tone
3. Current context
4. NPC state
5. Roll calculation
6. Response generation

### Success Calculation
```python
base_ap_change = llm_response_value  # From -10 to +10
tone_mod = TONE_MODIFIERS[tone]      # From -1 to +3
mood_mod = MOOD_MODIFIERS[mood]      # From -2 to +3

total_score = base_ap_change + tone_mod + mood_mod

# For Strangers
if total_score >= 8:    Critical Success
elif total_score >= 4:  Success
elif total_score <= -6: Critical Failure
else:                   Failure

# For Established Relationships
if total_score >= 6:    Critical Success
elif total_score >= 2:  Success
elif total_score <= -4: Critical Failure
else:                   Failure
```

## API Reference

### Character Creation
```http
POST /api/character/create
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

### Geist Roll
```http
POST /api/geist/roll
{
    "action_type": "flirt",
    "complexity": "moderate",  # Optional for custom actions
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

Response:
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

### List Available Actions
```http
GET /api/geist/actions
```

Response:
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

### Story Interaction
```http
POST /api/story/interact
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

## Sample Interactions

### Example 1: First Meeting
```http
POST /api/story/interact
{
    "npc_id": "sakura",
    "player_dialogue": "Hi, I couldn't help but notice you like art too",
    "dialogue_tone": "friendly",
    "npc_state": {
        "name": "Sakura",
        "affection": 0,
        "mood": "neutral",
        "relationship_status": "stranger"
    }
}
```
Response:
```json
{
    "response_text": "Oh! Yes, I love art. Are you interested in modern art as well?",
    "new_mood": "excited",
    "mood_change_reason": "Found shared interest",
    "affection_change": 5
}
```

### Example 2: Custom Action
```http
POST /api/geist/roll
{
    "action_type": "share_art_knowledge",
    "complexity": "complex",
    "primary_traits": {
        "wit": 75,
        "empathy": 70
    },
    "secondary_traits": {
        "impression": 72
    },
    "tertiary_traits": {
        "connection": 71
    }
}
```
Response:
```json
{
    "action_type": "share_art_knowledge",
    "is_new_action": true,
    "complexity": "complex",
    "base_probability": 50,
    "trait_modifier": 12,
    "final_probability": 62,
    "roll_value": 58,
    "result": "success"
}
```

### Example 3: Failed Interaction
```http
POST /api/story/interact
{
    "npc_id": "sakura",
    "player_dialogue": "Want to go out sometime?",
    "dialogue_tone": "nervous",
    "npc_state": {
        "name": "Sakura",
        "affection": 15,
        "mood": "annoyed",
        "relationship_status": "stranger"
    }
}
```
Response:
```json
{
    "response_text": "Oh, um... I'm actually quite busy these days...",
    "new_mood": "uncomfortable",
    "mood_change_reason": "Too forward too soon",
    "affection_change": -5
}
```