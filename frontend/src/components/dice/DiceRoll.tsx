import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ActionType } from '../../utils/traitUtils'
import { ActionComplexity } from '../../types/character'
import { Dice1 } from 'lucide-react'

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
  const [rollHistory, setRollHistory] = useState<number[]>([])

  /**
   * Handles the dice rolling animation and final result calculation.
   * The animation shows random numbers before settling on the final roll.
   */
  const rollD100 = useCallback(() => {
    if (isRolling) return

    setIsRolling(true)
    setShowResult(false)
    setRollHistory([])
    
    let rollCount = 0
    const maxRolls = 20 // Number of animated rolls
    const rollInterval = setInterval(() => {
      const newRoll = Math.floor(Math.random() * 100) + 1
      setCurrentRoll(newRoll)
      setRollHistory(prev => [...prev, newRoll])
      rollCount++
      
      if (rollCount >= maxRolls) {
        clearInterval(rollInterval)
        // Final roll
        const finalRoll = Math.floor(Math.random() * 100) + 1
        setCurrentRoll(finalRoll)
        setRollHistory(prev => [...prev, finalRoll])
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
    if (roll <= Math.min(10, totalChance)) {
      return 'text-emerald-500 dark:text-emerald-400' // Critical Success
    }
    if (roll <= totalChance) {
      return 'text-green-500 dark:text-green-400' // Success
    }
    if (roll >= Math.min(190, totalChance * 1.9)) {
      return 'text-red-600 dark:text-red-500' // Critical Failure
    }
    return 'text-red-500 dark:text-red-400' // Regular Failure
  }

  /**
   * Returns the appropriate color for different complexity levels.
   * Provides visual feedback about action difficulty.
   */
  const getComplexityColor = (complexity: ActionComplexity) => {
    switch (complexity) {
      case ActionComplexity.SIMPLE:
        return 'text-emerald-600 dark:text-emerald-400'
      case ActionComplexity.MODERATE:
        return 'text-blue-600 dark:text-blue-400'
      case ActionComplexity.COMPLEX:
        return 'text-amber-600 dark:text-amber-400'
      case ActionComplexity.VERY_COMPLEX:
        return 'text-red-600 dark:text-red-400'
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    }
  }

  const rollVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15
      }
    },
    exit: { 
      scale: 1.2, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center gap-6 p-6 rounded-xl bg-background/50 backdrop-blur-sm shadow-medium"
    >
      {/* Check Information Display */}
      <motion.div variants={itemVariants} className="text-center">
        <h3 className="text-xl font-semibold text-foreground mb-2">{label}</h3>
        <div className="text-sm text-secondary-foreground space-y-2">
          {traitInfo && (
            <motion.p 
              variants={itemVariants}
              className={`${getComplexityColor(traitInfo.complexity)} font-medium`}
            >
              {traitInfo.complexity.replace('_', ' ').toUpperCase()} Action
            </motion.p>
          )}
          <motion.div variants={itemVariants} className="space-y-1">
            <p>Base Chance: {baseChance}%</p>
            <div className="text-primary space-y-0.5">
              <p>Primary Bonus: +{primaryBonus}%</p>
              <p>Secondary Bonus: +{Math.floor(secondaryBonus / 2)}%</p>
              <p className="font-semibold mt-1">
                Total Chance: {totalChance}%
              </p>
            </div>
          </motion.div>
          {traitInfo && (
            <motion.div 
              variants={itemVariants}
              className="text-xs space-y-0.5 mt-2 text-secondary-foreground/80"
            >
              <p>Primary ({traitInfo.actionType}): {traitInfo.primaryValue}</p>
              <p>Secondary: {traitInfo.secondaryValue}</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Roll Button with Animation */}
      <motion.button
        onClick={rollD100}
        disabled={isRolling}
        className={`
          relative px-8 py-4 rounded-lg text-xl font-bold
          ${isRolling 
            ? 'bg-primary/50 cursor-not-allowed' 
            : 'bg-primary hover:bg-primary/90'}
          text-primary-foreground
          shadow-soft hover:shadow-medium
          transition-all duration-200
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <AnimatePresence mode="wait">
          {currentRoll !== null ? (
            <motion.div
              key={currentRoll}
              variants={rollVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 flex items-center justify-center"
            >
              {currentRoll}
            </motion.div>
          ) : (
            <motion.div 
              className="flex items-center gap-2"
              variants={itemVariants}
            >
              <Dice1 className="w-5 h-5" />
              <span>Roll d100</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Roll History Trail */}
      <div className="h-6 flex items-center gap-1 overflow-hidden">
        <AnimatePresence>
          {rollHistory.slice(-5).map((roll, index) => (
            <motion.span
              key={`${roll}-${index}`}
              initial={{ opacity: 0, y: 10, scale: 0.5 }}
              animate={{ opacity: 0.5, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.5 }}
              className="text-sm text-secondary-foreground/50"
            >
              {roll}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {/* Result Display */}
      <AnimatePresence mode="wait">
        {showResult && currentRoll !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 500,
                damping: 25
              }
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center"
          >
            <motion.p 
              className="text-3xl font-bold mb-2"
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <span className={getResultColor(currentRoll)}>
                {currentRoll}
              </span>
            </motion.p>
            <motion.p 
              className={`font-medium ${getResultColor(currentRoll)}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {currentRoll <= Math.min(10, totalChance) ? 'Critical Success!' :
               currentRoll <= totalChance ? 'Success!' :
               currentRoll >= Math.min(190, totalChance * 1.9) ? 'Critical Failure!' : 
               'Failure'}
              {` (Need ${totalChance} or less)`}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
} 