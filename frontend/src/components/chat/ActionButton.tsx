import { useState } from 'react'
import { useTraitCheck } from '../../hooks/useTraitCheck'
import { DiceRoll } from '../dice/DiceRoll'
import type { TraitCheck } from '../../utils/traitUtils'

interface ActionButtonProps {
  check: TraitCheck
  onResult?: (success: boolean, roll: number) => void
  className?: string
}

export function ActionButton({ check, onResult, className = '' }: ActionButtonProps) {
  const [showRoll, setShowRoll] = useState(false)
  const { performCheck, hasCharacter } = useTraitCheck()

  if (!hasCharacter) {
    return null
  }

  const handleClick = () => {
    setShowRoll(true)
  }

  const handleRollComplete = (success: boolean, roll: number) => {
    onResult?.(success, roll)
  }

  if (showRoll) {
    const checkProps = performCheck(check)
    return (
      <div className="my-4">
        <DiceRoll
          {...checkProps}
          onRollComplete={handleRollComplete}
        />
      </div>
    )
  }

  return (
    <button
      onClick={handleClick}
      className={`
        px-4 py-2 rounded-lg
        bg-primary/10 hover:bg-primary/20
        text-primary font-medium
        transition-colors
        ${className}
      `}
    >
      {check.label}
    </button>
  )
} 