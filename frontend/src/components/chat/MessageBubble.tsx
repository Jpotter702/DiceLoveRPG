import { useMemo } from 'react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
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

  // Animation variants for the message bubble
  const bubbleVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  }

  // Animation variants for actions
  const actionsVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.3
      }
    }
  }

  return (
    <div className={`flex flex-col gap-2 ${containerClass}`}>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={bubbleVariants}
        layout
        className={`
          max-w-[80%] rounded-lg px-4 py-2
          shadow-soft hover:shadow-medium
          transition-shadow duration-200
          ${bubbleClass}
        `}
      >
        <p className="whitespace-pre-wrap">{content}</p>
        <time className="text-xs opacity-70 mt-1 block">
          {format(timestamp, 'HH:mm')}
        </time>
      </motion.div>
      
      {actions && actions.length > 0 && (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={actionsVariants}
          className="flex flex-wrap gap-2 max-w-[80%]"
        >
          {actions.map((action, index) => (
            <ActionButton
              key={index}
              check={action}
              onResult={(success, roll) => handleActionResult(action, success, roll)}
            />
          ))}
        </motion.div>
      )}
    </div>
  )
} 