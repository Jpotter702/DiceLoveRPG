import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

export function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true)
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Love & Dice</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className={`transition-colors hover:text-foreground/80 ${
                location.pathname === '/' ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/play" 
              className={`transition-colors hover:text-foreground/80 ${
                location.pathname === '/play' ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              Play
            </Link>
          </div>
        </nav>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-lg bg-secondary hover:bg-secondary/80"
          aria-label="Toggle theme"
        >
          {isDarkMode ? '🌞' : '🌙'}
        </button>
      </div>
    </header>
  )
} 