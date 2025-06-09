import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'

export function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // Check if dark mode was previously set
    const darkMode = localStorage.getItem('darkMode') === 'true'
    setIsDarkMode(darkMode)
    document.documentElement.classList.toggle('dark', darkMode)
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    document.documentElement.classList.toggle('dark', newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
  }

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
          onClick={toggleDarkMode}
          className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-foreground" />
          ) : (
            <Moon className="w-5 h-5 text-foreground" />
          )}
        </button>
      </div>
    </header>
  )
} 