import { useMemo } from 'react'
import { format } from 'date-fns'
import { ActionButton } from './ActionButton'
import type { TraitCheck } from '../../utils/traitUtils'
import { TRAIT_CHECKS } from '../../utils/traitUtils'

export type MessageRole = 'player' | 'npc' | 'narrator' | 'system'

interface MessageBubbleProps {
  role: MessageRole
  content: string
  timestamp: Date
  actions?: TraitCheck[]
  onActionResult?: (action: TraitCheck, success: boolean, roll: number) => void
}

export function MessageBubble({ 
  role, 
  content, 
  timestamp,
  actions,
  onActionResult
}: MessageBubbleProps) {
  const bubbleClass = useMemo(() => {
    switch (role) {
      case 'player':
        return 'ml-auto bg-primary text-primary-foreground'
      case 'npc':
        return 'mr-auto bg-secondary'
      case 'narrator':
        return 'mx-auto bg-muted italic'
      case 'system':
        return 'mx-auto bg-destructive/10 text-destructive'
      default:
        return 'bg-background'
    }
  }, [role])

  const containerClass = useMemo(() => {
    switch (role) {
      case 'player':
        return 'items-end'
      case 'npc':
        return 'items-start'
      default:
        return 'items-center'
    }
  }, [role])

  const handleActionResult = (action: TraitCheck, success: boolean, roll: number) => {
    onActionResult?.(action, success, roll)
  }

  return (
    <div className={`flex flex-col gap-2 ${containerClass}`}>
      <div className={`
        max-w-[80%] rounded-lg px-4 py-2
        ${bubbleClass}
      `}>
        <p className="whitespace-pre-wrap">{content}</p>
        <time className="text-xs opacity-70 mt-1 block">
          {format(timestamp, 'HH:mm')}
        </time>
      </div>
      
      {actions && actions.length > 0 && (
        <div className="flex flex-wrap gap-2 max-w-[80%]">
          {actions.map((action, index) => (
            <ActionButton
              key={index}
              check={action}
              onResult={(success, roll) => handleActionResult(action, success, roll)}
            />
          ))}
        </div>
      )}
    </div>
  )
} 