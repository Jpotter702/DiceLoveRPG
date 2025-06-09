import { useMemo } from 'react'
import type { NPCState } from '../../types/api'

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

interface RelationshipCardProps {
  npc: NPCState
}

export function RelationshipCard({ npc }: RelationshipCardProps) {
  const { level, color, hearts } = useMemo(() => {
    return getRelationshipInfo(npc.affection)
  }, [npc.affection])

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-card-foreground">{npc.name}</h3>
        <span className={`text-sm font-medium ${color}`}>
          {level}
        </span>
      </div>

      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <HeartIcon 
            key={i} 
            filled={i < hearts}
            color={color}
          />
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-card-foreground/60">Affection</span>
          <span className="font-medium">{npc.affection} AP</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all ${color} bg-current opacity-20`}
            style={{ width: `${Math.min(100, (npc.affection / 100) * 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex justify-between items-center text-sm">
          <span className="text-card-foreground/60">Current Mood</span>
          <span className={`font-medium capitalize`}>
            {npc.mood.toLowerCase()}
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