
### ✅ Breakdown of Key Components

#### 📦 `components/`

-   **Header.tsx**: Navigation and title.
    
-   **Layout.tsx**: Wrapper for consistent UI layout.
    
-   **MessageBubble.tsx**: Renders individual chat messages (player/AI).
    

#### 💬 `chat/`

-   **ChatWindow.tsx**: Scrollable message area for chat history.
    
-   **InputBar.tsx**: Chat input and send button.
    

#### 🧑‍🎤 `character/`

-   **CharacterSheet.tsx**: Full breakdown of traits and stats.
    
-   **TraitCard.tsx**: Displays individual stats like Charisma or Passion.
    
-   **DiceRoll.tsx**: Dice roll UI and result handler.
    

#### 🧠 `context/`

-   **ChatContext.tsx**: Manages message state.
    
-   **CharacterContext.tsx**: Stores character info and state.
    

#### 🎭 `npc/`

-   **NPCProfile.tsx**: Render NPC details.
    
-   **AffectionMeter.tsx**: Visual AP bar with milestone markers.
    

#### 📜 `pages/`

-   **Home.tsx**: Landing/start screen.
    
-   **Play.tsx**: Active roleplay screen.
    

#### ⚙️ `utils/`

-   **dice.ts**: Functions for d100 rolls and custom Geist rolls.
    
-   **traitUtils.ts**: Math for secondary/tertiary trait calcs.