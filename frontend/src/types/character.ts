/**
 * Primary traits (1-100) represent the core attributes of a character.
 * These are the base values that players can directly assign and modify.
 * Each trait ranges from 1-100, with 10 being average for a typical person.
 */
export interface PrimaryTraits {
  charm: number      // Natural charisma and appeal
  wit: number        // Quick thinking and humor
  empathy: number    // Understanding of others' emotions
  style: number      // Personal presentation and aesthetic
  confidence: number // Self-assurance and poise
  luck: number       // Fortune and serendipity
}

/**
 * Secondary traits are derived from combinations of primary traits.
 * These represent more complex social and emotional capabilities.
 * Values are calculated as averages of their component primary traits.
 */
export interface SecondaryTraits {
  impression: number  // (Charm + Style) / 2 - Overall impact on others
  flirtation: number // (Wit + Confidence) / 2 - Romantic interaction skill
  chemistry: number  // (Empathy + Luck) / 2 - Natural compatibility
}

/**
 * Tertiary traits are the most complex attributes, derived from combinations
 * of secondary traits and sometimes primary traits. These represent deep
 * emotional and social dynamics.
 */
export interface TertiaryTraits {
  romance: number    // (Impression + Flirtation) / 2 - Romantic capability
  connection: number // (Chemistry + Empathy) / 2 - Emotional bonding
  destiny: number    // (Luck + Chemistry) / 2 - Fateful encounters
}

/**
 * Action complexity levels determine the base probability of success.
 * Each level has a predefined base chance that is modified by traits.
 */
export enum ActionComplexity {
  SIMPLE = 'simple',         // 70% base - Easy actions with low risk
  MODERATE = 'moderate',     // 60% base - Standard actions with moderate risk
  COMPLEX = 'complex',       // 50% base - Difficult actions with high risk
  VERY_COMPLEX = 'very_complex' // 40% base - Challenging actions with very high risk
}

/**
 * Base probabilities for each complexity level.
 * These values are used as the starting point before trait bonuses.
 */
export const BASE_PROBABILITIES: Record<ActionComplexity, number> = {
  [ActionComplexity.SIMPLE]: 70,
  [ActionComplexity.MODERATE]: 60,
  [ActionComplexity.COMPLEX]: 50,
  [ActionComplexity.VERY_COMPLEX]: 40
}

/**
 * Represents a milestone in a relationship with an NPC.
 * Milestones track significant events and achievements.
 */
export interface Relationship {
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
 * Main character interface combining all trait levels and relationships.
 * This is the core data structure for managing character state.
 */
export interface Character {
  name: string
  primaryTraits: PrimaryTraits
  secondaryTraits: SecondaryTraits
  tertiaryTraits: TertiaryTraits
  relationships: Relationship[]
} 