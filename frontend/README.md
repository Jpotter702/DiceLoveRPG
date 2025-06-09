# Love & Dice RPG Frontend

A modern web application for an interactive dating simulation RPG built with React, TypeScript, and TailwindCSS.

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Git
- Hugging Face API key

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/loverpg.git
cd loverpg/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```bash
cp .env.example .env
```
Then edit `.env` and add your Hugging Face API key.

## Development

To start the development server:

```bash
npm run dev
```

This will launch the application in development mode on [http://localhost:3000](http://localhost:3000).

## Build for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── api/          # API integration
│   ├── components/   # React components
│   ├── context/      # React context providers
│   ├── styles/       # Global styles
│   └── types/        # TypeScript definitions
├── docs/            # Documentation
├── public/          # Static assets
└── tests/           # Test files
```

## Features

- Interactive chat interface
- Dark mode support
- Responsive design
- Role-based message styling
- Simulated AI responses
- Smooth scrolling
- Loading indicators

## Development Phases

- [Phase One](docs/frontend_PhaseOne.md): Project Setup and Basic Structure
- [Phase Two](docs/frontend_PhaseTwo.md): Chat Interface Implementation

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `npm test`
4. Submit a pull request

## License

MIT License - see LICENSE file for details
