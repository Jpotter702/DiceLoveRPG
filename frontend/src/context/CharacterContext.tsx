import { createContext, useContext, useState, useCallback } from 'react'
import type { PrimaryTraits } from '../types/character'
import { calculateSecondaryTraits, calculateTertiaryTraits } from '../utils/traitUtils'

/**
 * Character statistics interface
 * Each stat ranges from 1-20 with 10 being average
 */
interface Stats {
  charisma: number    // Influences first impressions and social interactions
  empathy: number     // Affects ability to understand and connect with NPCs
  wit: number         // Determines cleverness in dialogue and problem-solving
  passion: number     // Impacts emotional expression and romantic success
}

/**
 * Represents a relationship with an NPC
 * Tracks affection points and relationship milestones
 */
interface Relationship {
  npcId: string
  npcName: string
  affectionPoints: number
  milestones: {
    id: string
    description: string
    achieved: boolean
  }[]
}

/**
 * Main character interface combining stats and relationships
 */
interface Character {
  name: string
  primaryTraits: PrimaryTraits
  secondaryTraits: {
    impression: number
    flirtation: number
    chemistry: number
  }
  tertiaryTraits: {
    romance: number
    connection: number
    destiny: number
  }
  relationships: Relationship[]
}

/**
 * Type definition for the Character context value
 */
interface CharacterContextType {
  character: Character | null
  setCharacterTraits: (traits: PrimaryTraits) => void
  clearCharacter: () => void
}

const CharacterContext = createContext<CharacterContextType | null>(null)

/**
 * Provider component that wraps app to provide character management
 * Handles character creation, stats, relationships, and milestones
 */
export function CharacterProvider({ children }: { children: React.ReactNode }) {
  const [character, setCharacter] = useState<Character | null>(null)

  const setCharacterTraits = useCallback((primaryTraits: PrimaryTraits) => {
    const secondaryTraits = calculateSecondaryTraits(primaryTraits)
    const tertiaryTraits = calculateTertiaryTraits(secondaryTraits, primaryTraits)

    setCharacter({
      name: 'Player',
      primaryTraits,
      secondaryTraits,
      tertiaryTraits,
      relationships: []
    })
  }, [])

  const clearCharacter = useCallback(() => {
    setCharacter(null)
  }, [])

  return (
    <CharacterContext.Provider value={{ character, setCharacterTraits, clearCharacter }}>
      {children}
    </CharacterContext.Provider>
  )
}

/**
 * Custom hook to use the character context
 * @throws {Error} If used outside of CharacterProvider
 */
export function useCharacter() {
  const context = useContext(CharacterContext)
  if (!context) {
    throw new Error('useCharacter must be used within a CharacterProvider')
  }
  return context
} 