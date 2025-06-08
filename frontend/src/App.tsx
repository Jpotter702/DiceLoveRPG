import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true)
    }

    // Add listener for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    // Update document class when dark mode changes
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="p-4 border-b border-secondary">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Love & Dice RPG</h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80"
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <p className="text-lg">Welcome to Love & Dice RPG!</p>
      </main>
    </div>
  )
}

export default App
