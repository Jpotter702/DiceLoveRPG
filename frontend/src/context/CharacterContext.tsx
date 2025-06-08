import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

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
    ap: number           // AP threshold for this milestone
    description: string
    achieved: boolean
  }[]
}

/**
 * Main character interface combining stats and relationships
 */
interface Character {
  name: string
  stats: Stats
  relationships: Relationship[]
}

/**
 * Type definition for the Character context value
 */
interface CharacterContextType {
  character: Character | null
  createCharacter: (name: string, stats: Stats) => void
  updateStats: (newStats: Partial<Stats>) => void
  addRelationship: (npcId: string, npcName: string) => void
  updateAP: (npcId: string, amount: number) => void
  addMilestone: (npcId: string, ap: number, description: string) => void
  achieveMilestone: (npcId: string, milestoneId: string) => void
}

// Default starting stats for new characters
const defaultStats: Stats = {
  charisma: 10,
  empathy: 10,
  wit: 10,
  passion: 10
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined)

/**
 * Provider component that wraps app to provide character management
 * Handles character creation, stats, relationships, and milestones
 */
export function CharacterProvider({ children }: { children: ReactNode }) {
  const [character, setCharacter] = useState<Character | null>(null)

  // Create a new character with given name and optional stats
  const createCharacter = useCallback((name: string, stats: Stats = defaultStats) => {
    setCharacter({
      name,
      stats,
      relationships: []
    })
  }, [])

  // Update character stats, maintaining other stats unchanged
  const updateStats = useCallback((newStats: Partial<Stats>) => {
    setCharacter(prev => {
      if (!prev) return null
      return {
        ...prev,
        stats: { ...prev.stats, ...newStats }
      }
    })
  }, [])

  // Add a new NPC relationship if it doesn't exist
  const addRelationship = useCallback((npcId: string, npcName: string) => {
    setCharacter(prev => {
      if (!prev) return null
      if (prev.relationships.some(r => r.npcId === npcId)) return prev
      return {
        ...prev,
        relationships: [
          ...prev.relationships,
          {
            npcId,
            npcName,
            affectionPoints: 0,
            milestones: []
          }
        ]
      }
    })
  }, [])

  // Update Affection Points for a specific NPC
  const updateAP = useCallback((npcId: string, amount: number) => {
    setCharacter(prev => {
      if (!prev) return null
      return {
        ...prev,
        relationships: prev.relationships.map(rel =>
          rel.npcId === npcId
            ? { ...rel, affectionPoints: rel.affectionPoints + amount }
            : rel
        )
      }
    })
  }, [])

  // Add a new milestone to an NPC relationship
  const addMilestone = useCallback((npcId: string, ap: number, description: string) => {
    setCharacter(prev => {
      if (!prev) return null
      return {
        ...prev,
        relationships: prev.relationships.map(rel =>
          rel.npcId === npcId
            ? {
                ...rel,
                milestones: [
                  ...rel.milestones,
                  {
                    id: crypto.randomUUID(),
                    ap,
                    description,
                    achieved: false
                  }
                ]
              }
            : rel
        )
      }
    })
  }, [])

  // Mark a specific milestone as achieved
  const achieveMilestone = useCallback((npcId: string, milestoneId: string) => {
    setCharacter(prev => {
      if (!prev) return null
      return {
        ...prev,
        relationships: prev.relationships.map(rel =>
          rel.npcId === npcId
            ? {
                ...rel,
                milestones: rel.milestones.map(m =>
                  m.id === milestoneId
                    ? { ...m, achieved: true }
                    : m
                )
              }
            : rel
        )
      }
    })
  }, [])

  return (
    <CharacterContext.Provider
      value={{
        character,
        createCharacter,
        updateStats,
        addRelationship,
        updateAP,
        addMilestone,
        achieveMilestone
      }}
    >
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
  if (context === undefined) {
    throw new Error('useCharacter must be used within a CharacterProvider')
  }
  return context
} 