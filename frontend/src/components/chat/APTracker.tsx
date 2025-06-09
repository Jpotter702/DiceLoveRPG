import { useMemo } from 'react'
import { useChat } from '../../context/ChatContext'

/**
 * Get relationship level and color based on AP value
 */
function getRelationshipInfo(ap: number) {
  if (ap <= 20) {
    return { level: 'Stranger', color: 'text-gray-400', hearts: 1 }
  } else if (ap <= 40) {
    return { level: 'Acquaintance', color: 'text-blue-400', hearts: 2 }
  } else if (ap <= 60) {
    return { level: 'Friend', color: 'text-green-400', hearts: 3 }
  } else if (ap <= 80) {
    return { level: 'Close', color: 'text-purple-400', hearts: 4 }
  } else {
    return { level: 'Romantic', color: 'text-rose-400', hearts: 5 }
  }
}

export function APTracker() {
  const { npcState } = useChat()

  const { level, color, hearts } = useMemo(() => {
    if (!npcState) {
      return { level: 'No NPC', color: 'text-gray-400', hearts: 0 }
    }
    return getRelationshipInfo(npcState.affection)
  }, [npcState])

  if (!npcState) {
    return null
  }

  return (
    <div className="flex items-center gap-4 p-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col">
        <span className="text-sm text-secondary-foreground">
          {npcState.name}
        </span>
        <span className={`text-xs font-medium ${color}`}>
          {level}
        </span>
      </div>

      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <HeartIcon 
            key={i} 
            filled={i < hearts}
            color={color}
          />
        ))}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <span className="text-xs text-secondary-foreground">AP</span>
        <div className="w-12 h-6 bg-secondary rounded-full relative">
          <div 
            className={`absolute left-0 top-0 h-full rounded-full transition-all ${color} bg-current opacity-20`}
            style={{ width: `${Math.min(100, (npcState.affection / 100) * 100)}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
            {npcState.affection}
          </span>
        </div>
      </div>
    </div>
  )
}

function HeartIcon({ filled, color }: { filled: boolean; color: string }) {
  return (
    <svg 
      className={`w-4 h-4 transition-colors ${filled ? color : 'text-secondary'}`}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
      />
    </svg>
  )
} 