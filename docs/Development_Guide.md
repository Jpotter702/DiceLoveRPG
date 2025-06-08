# Love & Dice RPG Development Guide

## Table of Contents
1. [Development Setup](#development-setup)
2. [Project Structure](#project-structure)
3. [Code Style](#code-style)
4. [Testing](#testing)
5. [Contributing](#contributing)
6. [Common Tasks](#common-tasks)

## Development Setup

### Prerequisites
- Python 3.8+
- pip
- virtualenv or venv
- Git
- HuggingFace API key

### Initial Setup

1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/loverpg.git
cd loverpg
```

2. **Create Virtual Environment**
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows
```

3. **Install Dependencies**
```bash
pip install -r requirements.txt
```

4. **Environment Variables**
Create a `.env` file in the project root:
```env
HUGGINGFACE_API_KEY=your_key_here
DEBUG=True
ENVIRONMENT=development
```

5. **Initialize Database**
```bash
python scripts/init_db.py
```

## Project Structure

```
loverpg/
├── backend/
│   ├── models/          # Data models
│   │   ├── character.py # Character-related models
│   │   ├── geist.py    # Action system models
│   │   ├── npc.py      # NPC models
│   │   └── story.py    # Story interaction models
│   ├── routes/         # API endpoints
│   │   ├── character.py
│   │   ├── geist.py
│   │   ├── npc.py
│   │   └── story.py
│   ├── services/       # Business logic
│   │   ├── affection_service.py
│   │   ├── geist_service.py
│   │   └── story_service.py
│   └── utils/          # Helper functions
│       └── modifiers.py
├── docs/              # Documentation
├── tests/            # Test suite
└── scripts/          # Utility scripts
```

## Code Style

### Python Style Guide
- Follow PEP 8
- Use type hints
- Document functions with docstrings
- Maximum line length: 88 characters
- Use f-strings for string formatting

### Example Function
```python
def calculate_trait_bonus(
    trait_value: int,
    action_type: str,
    complexity: Optional[str] = None
) -> int:
    """
    Calculate bonus modifier from a trait value.
    
    Args:
        trait_value: The value of the trait (1-100)
        action_type: The type of action being attempted
        complexity: Optional complexity level
        
    Returns:
        Integer bonus value
        
    Raises:
        ValueError: If trait_value is outside valid range
    """
    if not 1 <= trait_value <= 100:
        raise ValueError("Trait value must be between 1 and 100")
        
    return trait_value // 10
```

## Testing

### Running Tests
```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_geist_service.py

# Run with coverage
pytest --cov=backend tests/
```

### Writing Tests
```python
def test_trait_bonus_calculation():
    """Test trait bonus calculation with various inputs."""
    # Arrange
    trait_value = 75
    action_type = "flirt"
    
    # Act
    bonus = calculate_trait_bonus(trait_value, action_type)
    
    # Assert
    assert bonus == 7
```

## Contributing

### Git Workflow
1. Create a feature branch
```bash
git checkout -b feature/new-feature
```

2. Make changes and commit
```bash
git add .
git commit -m "feat: add new feature"
```

3. Push changes
```bash
git push origin feature/new-feature
```

4. Create pull request

### Commit Message Format
Follow the Conventional Commits specification:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- test: Test changes
- chore: Maintenance tasks

## Common Tasks

### Adding a New Action Type
1. Update `backend/models/geist.py`:
```python
COMMON_ACTIONS = {
    "new_action": ActionComplexity.MODERATE,
}
```

2. Add trait calculations in `backend/services/geist_service.py`:
```python
action_scores = {
    "new_action": lambda: (
        primary_traits[PrimaryTraits.CHARM],
        secondary_traits[SecondaryTraits.IMPRESSION]
    ),
}
```

### Adding a New Trait
1. Update `backend/models/character.py`:
```python
class PrimaryTraits(str, Enum):
    NEW_TRAIT = "new_trait"
```

2. Update trait calculations in `backend/services/character_service.py`

### Modifying Roll Mechanics
1. Update `determine_roll_result()` in `geist_service.py`
2. Update probability calculations in `perform_geist_roll()`
3. Update tests in `tests/test_geist_service.py`

### Adding API Endpoints
1. Create route function in appropriate route file
2. Add request/response models if needed
3. Add service logic
4. Update API documentation
5. Add tests

## Troubleshooting

### Common Issues
1. **Missing Dependencies**
```bash
pip install -r requirements.txt
```

2. **Environment Variables**
Check `.env` file exists and has correct values

3. **Database Issues**
```bash
python scripts/reset_db.py
```

4. **Test Failures**
- Check test data setup
- Verify environment variables
- Check mock configurations

### Debug Tools
1. **FastAPI Debug Mode**
```bash
uvicorn backend.app:app --reload --log-level=debug
```

2. **Python Debugger**
```python
import pdb; pdb.set_trace()
```

3. **Logging**
```python
import logging
logging.debug("Debug message")
``` 