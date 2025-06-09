import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ActionType } from '../../utils/traitUtils'
import { ActionComplexity } from '../../types/character'

/**
 * Props for the DiceRoll component.
 * Contains all the necessary information to display and execute a trait check:
 * - Base chance from action complexity
 * - Bonuses from primary and secondary traits
 * - Total calculated chance of success
 * - Optional callback for roll results
 * - Display label
 * - Trait information for UI feedback
 */
interface DiceRollProps {
  baseChance: number
  primaryBonus: number
  secondaryBonus: number
  totalChance: number
  onRollComplete?: (success: boolean, roll: number) => void
  label?: string
  traitInfo?: {
    actionType: ActionType
    complexity: ActionComplexity
    primaryValue: number
    secondaryValue: number
  }
}

/**
 * A component that handles dice rolling for trait checks.
 * Features:
 * - Animated roll sequence
 * - Visual feedback for roll results
 * - Color-coded complexity levels
 * - Clear display of trait bonuses
 * - Success/failure determination
 */
export function DiceRoll({ 
  baseChance,
  primaryBonus,
  secondaryBonus,
  totalChance,
  onRollComplete,
  label = 'Roll Check',
  traitInfo
}: DiceRollProps) {
  // Track rolling state and results
  const [isRolling, setIsRolling] = useState(false)
  const [currentRoll, setCurrentRoll] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  /**
   * Handles the dice rolling animation and final result calculation.
   * The animation shows random numbers before settling on the final roll.
   */
  const rollD100 = useCallback(() => {
    if (isRolling) return

    setIsRolling(true)
    setShowResult(false)
    
    // Animate through random numbers
    let rollCount = 0
    const maxRolls = 20 // Number of animated rolls
    const rollInterval = setInterval(() => {
      setCurrentRoll(Math.floor(Math.random() * 100) + 1)
      rollCount++
      
      if (rollCount >= maxRolls) {
        clearInterval(rollInterval)
        // Final roll
        const finalRoll = Math.floor(Math.random() * 100) + 1
        setCurrentRoll(finalRoll)
        setIsRolling(false)
        setShowResult(true)
        onRollComplete?.(finalRoll <= totalChance, finalRoll)
      }
    }, 50) // 50ms between rolls
  }, [isRolling, totalChance, onRollComplete])

  /**
   * Determines the color for the roll result based on success/failure.
   */
  const getResultColor = (roll: number) => {
    if (roll <= totalChance) {
      return 'text-green-500 dark:text-green-400'
    }
    return 'text-red-500 dark:text-red-400'
  }

  /**
   * Returns the appropriate color for different complexity levels.
   * Provides visual feedback about action difficulty.
   */
  const getComplexityColor = (complexity: ActionComplexity) => {
    switch (complexity) {
      case ActionComplexity.SIMPLE:
        return 'text-green-600 dark:text-green-400'
      case ActionComplexity.MODERATE:
        return 'text-blue-600 dark:text-blue-400'
      case ActionComplexity.COMPLEX:
        return 'text-amber-600 dark:text-amber-400'
      case ActionComplexity.VERY_COMPLEX:
        return 'text-red-600 dark:text-red-400'
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Check Information Display */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-1">{label}</h3>
        <div className="text-sm text-secondary-foreground space-y-1">
          {traitInfo && (
            <p className={getComplexityColor(traitInfo.complexity)}>
              {traitInfo.complexity.replace('_', ' ').toUpperCase()} Action
            </p>
          )}
          <p>Base Chance: {baseChance}%</p>
          <div className="text-primary space-y-0.5">
            <p>Primary Bonus: +{primaryBonus}%</p>
            <p>Secondary Bonus: +{Math.floor(secondaryBonus / 2)}%</p>
            <p className="font-semibold">
              Total Chance: {totalChance}%
            </p>
          </div>
          {traitInfo && (
            <div className="text-xs space-y-0.5 mt-2">
              <p>Primary ({traitInfo.actionType}): {traitInfo.primaryValue}</p>
              <p>Secondary: {traitInfo.secondaryValue}</p>
            </div>
          )}
        </div>
      </div>

      {/* Roll Button with Animation */}
      <motion.button
        onClick={rollD100}
        disabled={isRolling}
        className={`
          relative px-6 py-3 rounded-lg text-lg font-bold
          ${isRolling 
            ? 'bg-primary/50 cursor-not-allowed' 
            : 'bg-primary hover:bg-primary/90'}
          text-primary-foreground transition-colors
        `}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {currentRoll !== null && (
            <motion.div
              key={currentRoll}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {currentRoll}
            </motion.div>
          )}
        </AnimatePresence>
        <span className={currentRoll !== null ? 'opacity-0' : ''}>
          Roll d100
        </span>
      </motion.button>

      {/* Result Display */}
      <AnimatePresence>
        {showResult && currentRoll !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <p className="text-2xl font-bold mb-2">
              <span className={getResultColor(currentRoll)}>
                {currentRoll}
              </span>
            </p>
            <p className={`font-medium ${getResultColor(currentRoll)}`}>
              {currentRoll <= totalChance ? 'Success!' : 'Failure'}
              {` (Need ${totalChance} or less)`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 