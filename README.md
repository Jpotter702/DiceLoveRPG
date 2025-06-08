# Love & Geist: A Dating Sim with AI-Powered NPCs

## Overview
Love & Geist is a unique dating simulation game that combines traditional dating sim mechanics with modern AI technology to create dynamic, engaging character interactions. The game features intelligent NPCs powered by HuggingFace's language models, a sophisticated affection system, and context-aware dialogue choices.

## Features

### Core Mechanics
- **Character Creation**: Create unique characters with primary, secondary, and tertiary traits
- **Geist System**: Dynamic probability-based action resolution system
- **Affection Points (AP)**: Track and evolve relationships with NPCs
- **AI-Generated Images**: Character and scene visualization using Stable Diffusion

### Advanced Interaction System
- **Context Memory**: NPCs remember past interactions and shared experiences
- **Dynamic Dialogue**: 10 distinct dialogue tones with context-aware recommendations
- **Emotional Expression**: NPCs respond with realistic emotions and actions
- **Relationship Progression**: Natural relationship development based on interactions

### AI Integration
- **Smart Responses**: AI-generated dialogue tuned for romantic comedy/drama
- **Contextual Memory**: NPCs reference past conversations and shared interests
- **Personality Consistency**: Characters maintain consistent traits while evolving
- **Emotional Depth**: Realistic emotional responses based on relationship status

## Project Status
- ✅ Phase 1: Core API Structure
- ✅ Phase 2: Game Logic + Rules Engine
- ✅ Phase 3: Roleplay + AI Integration
- ⏳ Phase 4: Frontend Integration (In Progress)

## API Documentation

### Story Interaction
```http
POST /api/story/interact
POST /api/story/dialogue_options
```

### Character Management
```http
POST /api/character/create
POST /api/geist/roll
```

### Image Generation
```http
POST /api/image/generate
```

## Technical Details

### Dependencies
- FastAPI for backend API
- HuggingFace's DialoGPT for dialogue generation
- Stable Diffusion for image generation
- Pydantic for data validation

### Key Components
- Trait-based character system
- Dynamic probability calculation
- Context-aware memory system
- Sophisticated dialogue tone system

## Development Progress

### Completed (Phases 1-3)
- ✅ Basic API structure and endpoints
- ✅ Character creation and trait system
- ✅ Geist roll mechanics
- ✅ Image generation integration
- ✅ Story interaction system
- ✅ Affection point tracking
- ✅ NPC memory and context system
- ✅ Dynamic dialogue tone system
- ✅ Enhanced AI prompts for immersion

### In Progress (Phase 4)
- 🔄 Frontend UI development
- 🔄 Chat interface implementation
- 🔄 Character sheet display
- 🔄 Visual feedback system

## Documentation
- [Phase 1 Summary](docs/PhaseOne.md): Core API Implementation
- [Phase 2 Summary](docs/PhaseTwo.md): Game Logic Development
- [Phase 3 Summary](docs/PhaseThree.md): AI Integration
- [Rulebook](docs/rulebook.md): Game Mechanics
- [API Reference](docs/API_Reference.md): Endpoint Documentation

## Getting Started

### Prerequisites
```bash
python 3.8+
pip
huggingface_hub
fastapi
uvicorn
```

### Installation
```bash
git clone https://github.com/yourusername/loverpg.git
cd loverpg
pip install -r requirements.txt
```

### Configuration
1. Set up environment variables:
```bash
HUGGINGFACE_API_KEY=your_key_here
```

2. Start the server:
```bash
uvicorn main:app --reload
```

## Contributing
Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
