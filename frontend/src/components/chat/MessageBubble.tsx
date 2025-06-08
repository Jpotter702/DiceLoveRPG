import type { Message } from '../../types/chat'
import { format } from 'date-fns'

interface MessageBubbleProps {
  message: Message
  showTimestamp?: boolean
}

const roleColors = {
  player: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
  npc: 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
  narrator: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
  system: 'bg-gray-500/10 text-gray-700 dark:text-gray-300'
} as const

export function MessageBubble({ message, showTimestamp = true }: MessageBubbleProps) {
  const isUser = message.sender === 'user'
  const isNarrator = message.role === 'narrator'
  const isSystem = message.role === 'system'

  // Center narrator and system messages
  if (isNarrator || isSystem) {
    return (
      <div className="flex flex-col items-center w-full mb-4">
        <div className={`
          max-w-[80%] rounded-lg px-4 py-2
          ${roleColors[message.role]}
          text-center
        `}>
          <div className="text-xs font-semibold uppercase mb-1">
            {message.role}
          </div>
          <div className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </div>
          {showTimestamp && (
            <div className="text-xs mt-1 opacity-70">
              {format(message.timestamp, 'HH:mm')}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`
          max-w-[80%] rounded-2xl px-4 py-2
          ${isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}
          ${isUser ? 'rounded-br-sm' : 'rounded-bl-sm'}
        `}
      >
        <div className="flex items-center gap-2 mb-1">
          {!isUser && message.npcName && (
            <span className="text-sm font-semibold">
              {message.npcName}
            </span>
          )}
          <span className={`
            text-xs px-2 py-0.5 rounded-full
            ${roleColors[message.role]}
          `}>
            {message.role}
          </span>
        </div>
        <div className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </div>
        {showTimestamp && (
          <div className={`
            text-xs mt-1 opacity-70
            ${isUser ? 'text-primary-foreground' : 'text-secondary-foreground'}
          `}>
            {format(message.timestamp, 'HH:mm')}
          </div>
        )}
      </div>
    </div>
  )
} 