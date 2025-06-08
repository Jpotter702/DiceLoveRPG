# Phase 2: Game Logic + Rules Engine

## Overview
Phase 2 focused on enhancing the core game mechanics, implementing the trait bonus system, and building out the relationship progression framework. This phase brought the dating sim aspects of the game to life through a dynamic action system and affection tracking.

## Key Accomplishments

### 1. Dynamic Action System
- **Custom Action Support**
  - Implemented flexible action creation system
  - Added complexity-based probability calculations
  - Created automatic probability table management
  - Supported user-defined actions with custom traits

- **Action Complexities**
  ```python
  SIMPLE:       70% base  # Easy actions with low risk
  MODERATE:     60% base  # Standard actions with moderate risk
  COMPLEX:      50% base  # Difficult actions with high risk
  VERY_COMPLEX: 40% base  # Challenging actions with very high risk
  ```

- **Trait Integration**
  - Implemented trait bonus calculations
  - Created trait combination system for different actions
  - Added critical success/failure mechanics
  - Developed modular trait modifier system

### 2. Affection System
- **AP (Affection Points) Implementation**
  - Range: 0-100
  - Persistent JSON storage
  - In-memory caching for performance
  - Automatic relationship level updates

- **Relationship Levels**
  ```python
  0-20 AP:   Stranger
  21-40 AP:  Acquaintance
  41-60 AP:  Friend
  61-80 AP:  Close
  81-100 AP: Romantic
  ```

- **AP Modifiers**
  - Roll-based changes:
    ```python
    Critical Success:  +10 AP
    Success:          +5 AP
    Failure:         -2 AP
    Critical Failure: -5 AP
    ```
  - Tone modifiers:
    ```python
    Friendly:  +1 (Safe)
    Flirty:    +2 (Risk/Reward)
    Serious:    0 (Neutral)
    Playful:   +1 (Safe)
    Romantic:  +3 (High Risk/Reward)
    Nervous:   -1 (Penalty)
    ```
  - Mood effects:
    ```python
    Happy:    +1
    Neutral:   0
    Sad:      -1
    Excited:  +2
    Annoyed:  -2
    Smitten:  +3
    Confused:  0
    ```

### 3. Story Integration
- **Enhanced Interaction System**
  - AP-based response generation
  - Mood tracking and updates
  - Context-aware dialogue
  - Relationship progression events

- **Dialogue System**
  - Tone selection
  - Mood influences
  - Relationship status effects
  - Success probability adjustments

### 4. Documentation
- **Comprehensive Rulebook**
  - Game mechanics documentation
  - API specifications
  - Sample interactions
  - System explanations

- **Developer Resources**
  - API reference guide
  - Development setup guide
  - Code style guidelines
  - Common tasks documentation

## Technical Implementation

### Key Files Modified
1. **Geist System**
   - `backend/models/geist.py`: Action and roll models
   - `backend/services/geist_service.py`: Roll mechanics
   - `backend/routes/geist.py`: API endpoints

2. **Affection System**
   - `backend/models/npc.py`: NPC and relationship models
   - `backend/services/affection_service.py`: AP management
   - `backend/routes/npc.py`: NPC endpoints

3. **Story System**
   - `backend/services/story_service.py`: Interaction logic
   - `backend/routes/story.py`: Story endpoints

### Notable Features

#### 1. Dynamic Action Creation
```python
@router.post("/geist/roll")
async def geist_roll(request: GeistRollRequest) -> GeistRollResponse:
    """
    Handles both predefined and custom actions:
    1. Checks if action exists
    2. Creates new action if needed
    3. Applies trait modifiers
    4. Performs probability roll
    5. Returns detailed results
    """
```

#### 2. Trait Bonus Calculation
```python
def get_trait_scores(action_type: str, traits: Dict) -> Tuple[int, int]:
    """
    Calculates primary and secondary trait scores:
    - Simple actions: Charm + Impression
    - Social actions: Flirtation + Romance
    - Emotional actions: Connection + Empathy
    """
```

#### 3. AP Management
```python
def update_ap(npc_id: str, roll_result: RollResult) -> Tuple[NPC, int, Optional[AffectionLevel]]:
    """
    Updates NPC affection points:
    1. Applies roll-based changes
    2. Adds tone modifiers
    3. Considers mood effects
    4. Updates relationship level
    5. Persists changes
    """
```

## Testing

### Test Coverage
- Unit tests for all core systems
- Integration tests for API endpoints
- Validation tests for models
- Edge case handling

### Key Test Cases
1. **Action System**
   - Custom action creation
   - Probability calculations
   - Trait modifier application
   - Critical roll handling

2. **Affection System**
   - AP updates
   - Level transitions
   - Modifier stacking
   - Boundary conditions

3. **Story System**
   - Interaction processing
   - Context handling
   - Response generation
   - State management

## Future Considerations

### Phase 3 Preparation
- AI integration points identified
- Context memory system planned
- Dialogue tone framework ready
- Response generation hooks in place

### Potential Enhancements
1. **Action System**
   - Action chain support
   - Custom complexity formulas
   - Dynamic trait weights
   - Special action events

2. **Affection System**
   - Time-based AP decay
   - Special relationship events
   - Relationship milestones
   - Multi-character interactions

3. **Story System**
   - Extended context memory
   - Dynamic scene generation
   - Mood transition rules
   - Event scheduling

## Conclusion
Phase 2 successfully implemented the core game mechanics and relationship systems. The foundation is now ready for Phase 3's AI integration and enhanced roleplay features. 