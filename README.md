# Love & Dice RPG

A dating simulation RPG with AI-powered interactions, dynamic character development, and image generation.

## Overview

Love & Dice RPG combines traditional dating sim mechanics with tabletop RPG elements and modern AI technology. The game features:

- Character creation with interconnected trait systems
- Dynamic action resolution using the Geist Roll system
- AI-powered NPC interactions with context memory
- Image generation for characters and scenes
- Relationship progression based on player choices

## Architecture

### Backend (FastAPI)

```
backend/
├── models/          # Pydantic models and data structures
├── routes/          # API endpoint handlers
├── services/        # Business logic and external integrations
└── utils/          # Helper functions and utilities
```

### Key Components

1. **Character System**
   - Primary traits (charm, wit, empathy, etc.)
   - Secondary traits (impression, flirtation, chemistry)
   - Tertiary traits (romance, connection, destiny)

2. **Geist Roll System**
   - Dynamic probability calculations
   - Trait-based modifiers
   - Critical success/failure mechanics

3. **Story System**
   - AI-powered dialogue generation
   - Context-aware responses
   - Affection and mood tracking

4. **Image Generation**
   - Style-specific prompting
   - Character and scene visualization
   - Consistent art direction

## Setup

### Prerequisites
- Python 3.8+
- HuggingFace API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/loverpg.git
cd loverpg
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
export HUGGINGFACE_API_KEY=your_key_here  # Linux/Mac
# or
set HUGGINGFACE_API_KEY=your_key_here     # Windows
```

5. Run the development server:
```bash
uvicorn backend.app:app --reload
```

## API Documentation

See [API Documentation](docs/API%20Documentation.md) for detailed endpoint specifications.

## Development Status

### Phase 1 (Complete)
- ✅ Character creation system
- ✅ Geist roll mechanics
- ✅ Story interaction framework
- ✅ Image generation integration

### Phase 2 (Planned)
- 🔄 Game logic enhancement
- 🔄 Trait bonus implementation
- 🔄 AP tracking system
- 🔄 Extended rulebook

### Phase 3 (Planned)
- 📝 Advanced AI integration
- 📝 Context memory system
- 📝 Dialogue tone system

### Phase 4 (Planned)
- 🎨 Frontend development
- 🎨 UI/UX implementation
- 🎨 Asset integration

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
