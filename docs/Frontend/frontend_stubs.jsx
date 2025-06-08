// Frontend Project Structure: src/

src/
├── assets/                 // Static files: images, icons, etc.
├── components/             // Reusable UI components
│   ├── Chat/               // Chat UI components
│   │   ├── ChatWindow.tsx  // Main chat window layout
│   │   ├── MessageBubble.tsx // Individual message UI
│   │   ├── InputBar.tsx    // Text input with send button
│   │   └── DiceRoll.tsx    // Visual representation of a dice roll
│   ├── Character/          // Character-related views
│   │   ├── CharacterSheet.tsx
│   │   └── TraitCard.tsx
│   └── Layout/             // Global layout components
│       ├── Header.tsx
│       └── Container.tsx
├── pages/                  // Route-level components
│   ├── Home.tsx            // Landing page
│   └── Play.tsx            // Game interface with chat and stats
├── context/                // React context providers
│   ├── ChatContext.tsx
│   └── CharacterContext.tsx
├── lib/                    // Utility functions and API clients
│   ├── api.ts              // Wrapper around backend requests
│   └── dice.ts             // d100 logic, bonuses, etc.
├── styles/                 // Global styles, Tailwind config, etc.
│   └── globals.css
├── App.tsx                 // App root component
├── main.tsx                // Entry point
└── routes.tsx              // Route configuration
