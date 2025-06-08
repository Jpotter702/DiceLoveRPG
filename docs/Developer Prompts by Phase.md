
### 🔧 Developer Prompts by Phase

#### **Phase 1: Static UI & Routing**

**Goal:** Lay out main views and reusable components.

1.  **App Shell**
    
    -   Prompt: _"Implement a minimal `App.tsx` that wraps all routes in a `Container` and shows a `Header` at the top."_
        
2.  **Routing Setup**
    
    -   Prompt: _"Configure React Router in `routes.tsx` to handle `/` (Home) and `/play` routes."_
        
    -   Include: `Home.tsx` with welcome message, `Play.tsx` as placeholder with `ChatWindow`.
        
3.  **Chat UI Stubs**
    
    -   Prompt: _"Create a basic `ChatWindow.tsx` with `MessageBubble` and `InputBar` components for now."_
        
4.  **Character Sheet**
    
    -   Prompt: _"Stub `CharacterSheet.tsx` to display 6 Primary Traits and 3 Secondary Traits in `TraitCard` components."_
        

----------

#### **Phase 2: Interactivity & State**

**Goal:** Local game logic and user input.

1.  **Chat State**
    
    -   Prompt: _"Use `ChatContext` to manage chat history. Add new messages to an array with timestamps and sender metadata."_
        
2.  **Dice Rolling**
    
    -   Prompt: _"In `DiceRoll.tsx`, create a function that simulates a d100 roll and displays it with a brief animation."_
        
3.  **Character Builder**
    
    -   Prompt: _"Allow random rolling of traits in `CharacterSheet.tsx`, store values in `CharacterContext`, and display derived values (like Impression, Flirtation, etc.)."_
        

----------

#### **Phase 3: Backend Integration**

**Goal:** Connect to REST API for AI model and game logic.

1.  **API Hook**
    
    -   Prompt: _"In `api.ts`, create `sendMessageToAI(message: string)` that POSTs to `/api/chat` and returns response."_
        
2.  **Dice System Integration**
    
    -   Prompt: _"Use `dice.ts` to determine success/failure against TN (target number). Allow override if GM logic is applied."_