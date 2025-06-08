├── public/
│   └── index.html                # Base HTML
│
├── src/
│   ├── assets/                  # Static assets like logos, icons, dice animations
│   ├── components/              # Reusable UI pieces
│   │   ├── Chat/
│   │   │   ├── ChatWindow.tsx        # Main chat container
│   │   │   ├── MessageBubble.tsx     # Individual messages
│   │   │   └── InputBar.tsx          # User input field
│   │   ├── Traits/
│   │   │   ├── CharacterSheet.tsx    # Display traits
│   │   │   ├── TraitCard.tsx         # Visual trait container
│   │   │   └── DiceRoll.tsx          # Dice animation and logic
│   │   └── Layout/
│   │       ├── Header.tsx            # Top navigation
│   │       └── Container.tsx         # Page wrapper
│   │
│   ├── contexts/                # Global state via context
│   │   ├── ChatContext.tsx
│   │   └── CharacterContext.tsx
│   │
│   ├── pages/                   # Route-specific components
│   │   ├── Home.tsx
│   │   └── Play.tsx
│   │
│   ├── routes.tsx              # React Router setup
│   ├── api.ts                  # Axios/fetch wrapper for REST API
│   ├── dice.ts                 # d100 logic + TN check
│   ├── App.tsx
│   └── main.tsx                # Entry point
│
├── tailwind.config.js         # Styling config
├── postcss.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
