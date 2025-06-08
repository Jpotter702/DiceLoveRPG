
Here are prompts organized by file for your frontend scaffold. These will help guide implementation step-by-step:

----------

### 🧩 `index.tsx`

**Prompt**:  
"Initialize the React app using Vite. Render the `<App />` component into the DOM. Import global styles if needed."

----------

### 🧩 `main.tsx`

**Prompt**:  
"Set up the root rendering pipeline using Vite/React. Wrap the app with any suspense or error boundaries if needed."

----------

### 🧩 `App.tsx`

**Prompt**:  
"Create the root component. Import providers (`ChatContext`, `CharacterContext`), and define routing using React Router. Setup layout and global UI elements."

----------

### 🧩 `routes.tsx`

**Prompt**:  
"Define routes: `/` for Home, `/play` for main game loop. Use `react-router-dom`. Export for use in `<App />`."

----------

### 🧩 `api/api.ts`

**Prompt**:  
"Create stub functions for backend API calls: `sendChatMessage`, `generateImage`, `rollDice`, `fetchCharacterTraits`. Use fetch or axios."

----------

### 🧩 `components/Header.tsx`

**Prompt**:  
"Build a responsive navigation bar with the game title. Include optional links: Rules, Gallery, Credits."

----------

### 🧩 `components/Layout.tsx`

**Prompt**:  
"Create a wrapper layout component with `header`, `main`, and optional `footer`. Accept children props."

----------

### 🧩 `components/MessageBubble.tsx`

**Prompt**:  
"Render a message bubble. Accept props for `message`, `sender`, and `timestamp`. Differentiate styling for Player/NPC."

----------

### 🧩 `context/ChatContext.tsx`

**Prompt**:  
"Create a context to manage the message history. Include `sendMessage`, `resetChat`, and store message list."

----------

### 🧩 `context/CharacterContext.tsx`

**Prompt**:  
"Create context to store player character data. Provide hooks to update traits, hobbies, and love language."

----------

### 🧩 `pages/Home.tsx`

**Prompt**:  
"Create a simple welcome page. Show the game name and a ‘Start Game’ button that routes to `/play`."

----------

### 🧩 `pages/Play.tsx`

**Prompt**:  
"Create the main play area. Use `ChatWindow`, `InputBar`, `CharacterSheet`, and `NPCProfile`. Layout for desktop and mobile."

----------

### 🧩 `chat/ChatWindow.tsx`

**Prompt**:  
"Show all messages from ChatContext. Style messages with scroll behavior. Auto-scroll to latest message."

----------

### 🧩 `chat/InputBar.tsx`

**Prompt**:  
"Create a chat input box with text field and send button. On submit, call `sendMessage` from context."

----------

### 🧩 `character/CharacterSheet.tsx`

**Prompt**:  
"Display all character stats. Include Primary, Secondary, Tertiary traits. Add buttons to re-roll or edit."

----------

### 🧩 `character/TraitCard.tsx`

**Prompt**:  
"Show a single trait with icon and value. Useful inside CharacterSheet."

----------

### 🧩 `character/DiceRoll.tsx`

**Prompt**:  
"Create a dice-rolling widget. Accept input for type of roll (e.g., Geist) and target. Display result."

----------

### 🧩 `npc/NPCProfile.tsx`

**Prompt**:  
"Show current NPC's details: name, interests, personality quirk. Useful for narrative cues."

----------

### 🧩 `npc/AffectionMeter.tsx`

**Prompt**:  
"Create a visual bar showing current Affection Points. Show stages like Acquaintance → Dating → Deep Connection."

----------

### 🧩 `utils/dice.ts`

**Prompt**:  
"Write reusable functions: `rollD100()`, `geistCheck(target)`, etc. Return value + success/failure."

----------

### 🧩 `utils/traitUtils.ts`

**Prompt**:  
"Calculate derived traits from primaries. Export helpers for use in character creation logic."