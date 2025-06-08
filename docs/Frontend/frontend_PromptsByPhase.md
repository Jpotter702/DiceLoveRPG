
## 🧭 **Frontend Development Prompts by Phase**

----------

### 🔹 **Phase 1: Core UI Framework & Navigation**

**Goal:** Get the base app running with routing, layout, and context setup.

#### Prompts:

1.  **Initialize the React app** using Vite with TypeScript and Tailwind CSS.
    
    > _Prompt:_ “Set up a new Vite + React + TypeScript project with Tailwind. Create `tailwind.config.js`, `postcss.config.js`, and enable dark mode support.”
    
2.  **Create the top-level layout with routing.**
    
    > _Prompt:_ “Implement a `Header` component with navigation between `Home` and `Play`. Use React Router in `routes.tsx` and wrap the app in the `Container` layout component.”
    
3.  **Set up global context for chat and character data.**
    
    > _Prompt:_ “Create `ChatContext.tsx` and `CharacterContext.tsx` using React Context API. Provide state for chat history, current message input, character stats, and AP tracking.”
    

----------

### 🔹 **Phase 2: Chat System UI**

**Goal:** Implement the roleplay chat interface.

#### Prompts:

1.  **Build the chat UI.**
    
    > _Prompt:_ “Create a `ChatWindow` component that uses `MessageBubble` for rendering messages (user, AI, and NPC). Add an `InputBar` for user input and basic enter-to-send logic.”
    
2.  **Implement scroll-to-bottom and chat history features.**
    
    > _Prompt:_ “Add scroll-to-bottom behavior when new messages arrive. Display timestamps and message roles (e.g., 'Player', 'NPC', 'Narrator').”
    
3.  **Mock the backend response for now.**
    
    > _Prompt:_ “Stub `api.ts` to simulate an async reply from the AI assistant. Return a mocked string like ‘You feel a connection spark between you and them.’”
    

----------

### 🔹 **Phase 3: Character Stats + Dice Rolling**

**Goal:** Show character traits and allow dice rolls in the interface.

#### Prompts:

1.  **Build the character sheet components.**
    
    > _Prompt:_ “Create a `CharacterSheet` component that displays primary, secondary, and tertiary traits. Pull data from `CharacterContext`. Use cards for each category.”
    
2.  **Add dice rolling functionality.**
    
    > _Prompt:_ “Implement `DiceRoll.tsx` to simulate a d100 roll. Accept a TN (target number) and show success/failure result. Optional: animate the roll using Framer Motion.”
    
3.  **Integrate trait modifiers and display mechanics.**
    
    > _Prompt:_ “Add trait-based bonuses (e.g., Charisma affects Flirtation). Allow actions from chat to reference these traits and influence rolls.”
    

----------

### 🔹 **Phase 4: AI Interaction and Game Loop**

**Goal:** Connect to backend and process gameplay logic.

#### Prompts:

1.  **Connect to backend REST API.**
    
    > _Prompt:_ “Use Axios in `api.ts` to call the `/interact` endpoint. Send chat input, selected traits, and return the AI-generated response with metadata (e.g., AP gained, NPC reaction).”
    
2.  **Display Affection Points and Relationship Progress.**
    
    > _Prompt:_ “Add AP tracking bar or counter near the chat or sheet. Use visual feedback like heart icons, colors, or level indicators.”
    
3.  **Show NPC profiles or history.**
    
    > _Prompt:_ “Add an NPC tab or toggle to view current relationship stage, AP level, and known preferences.”
    

----------

### 🔹 **Phase 5: Visual Polish & UX**

**Goal:** Improve usability and styling.

#### Prompts:

1.  **Style with Tailwind and responsive design.**
    
    > _Prompt:_ “Use Tailwind classes to apply consistent visual style: soft shadows, rounded corners, spacing, and mobile responsiveness.”
    
2.  **Add animations for dice rolls and chat bubbles.**
    
    > _Prompt:_ “Use Framer Motion to animate chat message appearance and dice roll reveal.”
    
3.  **Design avatars or NPC art placeholders.**
    
    > _Prompt:_ “Use placeholder illustrations for NPCs. Allow image generation from backend or random assignment for variety.”