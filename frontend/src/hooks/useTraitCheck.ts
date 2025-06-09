import { useCallback } from 'react'
import { useCharacter } from '../context/CharacterContext'
import type { TraitCheck, ActionType } from '../utils/traitUtils'
import { 
  calculateTotalModifier, 
  calculateSecondaryTraits,
  calculateTertiaryTraits
} from '../utils/traitUtils'
import type { ActionComplexity } from '../types/character'

interface UseTraitCheckResult {
  performCheck: (check: TraitCheck) => {
    baseChance: number
    primaryBonus: number
    secondaryBonus: number
    totalChance: number
    label: string
    traitInfo: {
      actionType: ActionType
      complexity: ActionComplexity
      primaryValue: number
      secondaryValue: number
    }
  }
  hasCharacter: boolean
}

export function useTraitCheck(): UseTraitCheckResult {
  const { character } = useCharacter()

  const performCheck = useCallback((check: TraitCheck) => {
    if (!character) {
      throw new Error('Cannot perform trait check without a character')
    }

    // Calculate derived traits
    const secondaryTraits = calculateSecondaryTraits(character.primaryTraits)
    const tertiaryTraits = calculateTertiaryTraits(secondaryTraits, character.primaryTraits)

    // Get modifiers and chances
    const {
      baseChance,
      primaryBonus,
      secondaryBonus,
      totalChance,
      traits
    } = calculateTotalModifier(check, character.primaryTraits, secondaryTraits, tertiaryTraits)

    return {
      baseChance,
      primaryBonus,
      secondaryBonus,
      totalChance,
      label: check.label,
      traitInfo: {
        actionType: check.actionType,
        complexity: check.complexity,
        primaryValue: traits.primary,
        secondaryValue: traits.secondary
      }
    }
  }, [character])

  return {
    performCheck,
    hasCharacter: !!character
  }
} 