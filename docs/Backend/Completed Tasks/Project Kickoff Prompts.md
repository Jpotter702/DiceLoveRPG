🧭 Project Kickoff Prompts (for AI developer or human team)
🏗️ Phase 1: Core API Structure
Goal: Implement basic API routes for character creation, dice rolls, image generation, and story interaction.

Prompts:

Implement the /character/create endpoint to accept a character's rolled stats and return a completed profile including primary, secondary, and tertiary traits.

Implement the /geist/roll endpoint. This accepts an action type and character traits, pulls the probability from probability_table.json, and rolls against it.

Implement logic in /geist/roll to add new actions with default probabilities if not found in the table.

Implement the /image/generate route that sends a prompt to a Hugging Face image generation model (like Stable Diffusion) and returns the image URL.

Implement /story/interact to send player dialogue and game state to a Hugging Face LLM and return the NPC's reply.

🧠 Phase 2: Game Logic + Rules Engine
Goal: Bring the core dating game mechanics to life.

Prompts:

Integrate trait bonuses in geist rolls using modifiers.py.

Track Affection Points (AP) for each NPC in a simple in-memory or JSON store.

Update /story/interact to adjust AP based on roll results and input tone.

Build out the rulebook.md with API logic, trait calculations, and sample interactions.

🎭 Phase 3: Roleplay + AI Integration
Goal: Enhance immersion using LLMs for dynamic storytelling and realistic NPC reactions.

Prompts:

Tune the Hugging Face LLM prompts to match the tone of romantic comedy/drama.

Add context memory: store prior interactions per NPC to personalize responses.

Let players choose dialogue tone (flirty, serious, playful) and adjust rolls accordingly.

💌 Phase 4: Frontend Integration
Goal: Create a chat-style UI that talks to the backend.

Prompts:

Create a simple web UI (React, Svelte, etc.) that supports chat, stat sheet display, dice roll visuals, and image previews.

Hook into the API endpoints for character creation, geist rolls, and story progression.