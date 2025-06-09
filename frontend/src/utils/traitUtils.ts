import { 
  ActionComplexity,
  BASE_PROBABILITIES,
  type PrimaryTraits, 
  type SecondaryTraits, 
  type TertiaryTraits,
} from '../types/character'

/**
 * Action types determine which traits are used for a check.
 * Each type uses a specific combination of traits that best represents
 * the nature of the action being attempted.
 */
export enum ActionType {
  SIMPLE = 'simple',     // Uses Charm + Impression for basic social interactions
  SOCIAL = 'social',     // Uses Flirtation + Romance for romantic endeavors
  EMOTIONAL = 'emotional' // Uses Connection + Empathy for deep emotional bonds
}

/**
 * Defines the structure of a trait check, combining the type of action,
 * its complexity, and a descriptive label for UI display.
 */
export interface TraitCheck {
  actionType: ActionType
  complexity: ActionComplexity
  label: string
}

/**
 * Calculates secondary traits from primary traits using the rulebook formulas.
 * Secondary traits represent more complex social capabilities derived from
 * combinations of basic attributes.
 * 
 * @param primary The character's primary trait values
 * @returns Calculated secondary trait values
 */
export function calculateSecondaryTraits(primary: PrimaryTraits): SecondaryTraits {
  return {
    impression: (primary.charm + primary.style) / 2,
    flirtation: (primary.wit + primary.confidence) / 2,
    chemistry: (primary.empathy + primary.luck) / 2
  }
}

/**
 * Calculates tertiary traits from secondary traits and primary traits.
 * Tertiary traits represent the deepest level of social and emotional capabilities,
 * derived from both secondary traits and sometimes primary traits.
 * 
 * @param secondary The character's secondary trait values
 * @param primary The character's primary trait values (needed for some calculations)
 * @returns Calculated tertiary trait values
 */
export function calculateTertiaryTraits(
  secondary: SecondaryTraits,
  primary: PrimaryTraits
): TertiaryTraits {
  return {
    romance: (secondary.impression + secondary.flirtation) / 2,
    connection: (secondary.chemistry + primary.empathy) / 2,
    destiny: (primary.luck + secondary.chemistry) / 2
  }
}

/**
 * Calculates the bonus provided by a trait value.
 * As per the rulebook, this is a simple division by 10 (rounded down).
 * 
 * @param traitValue The value of the trait (1-100)
 * @returns The bonus value (trait_value // 10)
 */
export function calculateTraitBonus(traitValue: number): number {
  return Math.floor(traitValue / 10)
}

/**
 * Determines which traits to use for a given action type.
 * Each action type has a specific primary and secondary trait combination
 * that best represents the skills needed for that type of action.
 * 
 * @param actionType The type of action being attempted
 * @param primary The character's primary traits
 * @param secondary The character's secondary traits
 * @param tertiary The character's tertiary traits
 * @returns The relevant trait values for the action
 */
export function getTraitsForAction(
  actionType: ActionType,
  primary: PrimaryTraits,
  secondary: SecondaryTraits,
  tertiary: TertiaryTraits
): { primary: number, secondary: number } {
  switch (actionType) {
    case ActionType.SIMPLE:
      return {
        primary: primary.charm,
        secondary: secondary.impression
      }
    case ActionType.SOCIAL:
      return {
        primary: secondary.flirtation,
        secondary: tertiary.romance
      }
    case ActionType.EMOTIONAL:
      return {
        primary: tertiary.connection,
        secondary: primary.empathy
      }
  }
}

/**
 * Calculates the total modifier and chances for a trait check.
 * This function combines:
 * 1. Base probability from action complexity
 * 2. Primary trait bonus
 * 3. Secondary trait bonus (at half value)
 * 
 * @param check The trait check configuration
 * @param primary The character's primary traits
 * @param secondary The character's secondary traits
 * @param tertiary The character's tertiary traits
 * @returns Complete check calculation including base chance, bonuses, and total
 */
export function calculateTotalModifier(
  check: TraitCheck,
  primary: PrimaryTraits,
  secondary: SecondaryTraits,
  tertiary: TertiaryTraits
): {
  baseChance: number
  primaryBonus: number
  secondaryBonus: number
  totalChance: number
  traits: { primary: number, secondary: number }
} {
  const baseChance = BASE_PROBABILITIES[check.complexity]
  const traits = getTraitsForAction(check.actionType, primary, secondary, tertiary)
  
  const primaryBonus = calculateTraitBonus(traits.primary)
  const secondaryBonus = calculateTraitBonus(traits.secondary)
  
  return {
    baseChance,
    primaryBonus,
    secondaryBonus,
    totalChance: baseChance + primaryBonus + Math.floor(secondaryBonus / 2),
    traits
  }
}

/**
 * Predefined trait checks for common actions in the game.
 * Each check is configured with:
 * - Appropriate action type for trait selection
 * - Complexity level for base probability
 * - Descriptive label for UI display
 */
export const TRAIT_CHECKS = {
  COMPLIMENT: {
    actionType: ActionType.SIMPLE,
    complexity: ActionComplexity.SIMPLE,
    label: 'Compliment'
  },
  FLIRT: {
    actionType: ActionType.SOCIAL,
    complexity: ActionComplexity.MODERATE,
    label: 'Flirt'
  },
  ASK_OUT: {
    actionType: ActionType.SOCIAL,
    complexity: ActionComplexity.COMPLEX,
    label: 'Ask Out'
  },
  CONFESS_LOVE: {
    actionType: ActionType.EMOTIONAL,
    complexity: ActionComplexity.VERY_COMPLEX,
    label: 'Confess Love'
  },
  EMPATHIZE: {
    actionType: ActionType.EMOTIONAL,
    complexity: ActionComplexity.MODERATE,
    label: 'Show Empathy'
  }
} as const 