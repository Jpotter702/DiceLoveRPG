import { useState } from 'react'
import { useChat } from '../../context/ChatContext'
import { NPCMood, DialogueTone } from '../../types/api'

/**
 * Represents a discovered preference for an NPC
 * @interface PreferenceItem
 */
interface PreferenceItem {
  type: 'like' | 'dislike'
  description: string
  discoveredAt: Date
}

/**
 * Complete set of NPC preferences including topics, activities, traits, and dialogue effectiveness
 * @interface NPCPreferences
 */
interface NPCPreferences {
  topics: PreferenceItem[]
  activities: PreferenceItem[]
  traits: PreferenceItem[]
  dialogueTones: {
    tone: DialogueTone
    effectiveness: number // 0-100
    discoveredAt: Date
  }[]
}

/**
 * NPCPanel Component
 * 
 * A collapsible side panel that displays detailed information about the current NPC:
 * - Current mood with emoji visualization
 * - Relationship status and Affection Points (AP)
 * - Known preferences (topics, activities, traits)
 * - Dialogue tone effectiveness
 * - Current context/situation
 * 
 * The panel uses a combination of real-time NPC state from the ChatContext
 * and discovered preferences that persist across interactions.
 */
export function NPCPanel() {
  const { npcState, dialogueTone } = useChat()
  const [isExpanded, setIsExpanded] = useState(false)

  // Mock preferences (in a real app, this would come from the backend)
  const preferences: NPCPreferences = {
    topics: [
      { type: 'like', description: 'Art and creativity', discoveredAt: new Date() },
      { type: 'like', description: 'Travel stories', discoveredAt: new Date() },
      { type: 'dislike', description: 'Gossip', discoveredAt: new Date() }
    ],
    activities: [
      { type: 'like', description: 'Visiting art galleries', discoveredAt: new Date() },
      { type: 'like', description: 'Coffee shops', discoveredAt: new Date() }
    ],
    traits: [
      { type: 'like', description: 'Honesty', discoveredAt: new Date() },
      { type: 'dislike', description: 'Arrogance', discoveredAt: new Date() }
    ],
    dialogueTones: [
      { tone: DialogueTone.FRIENDLY, effectiveness: 85, discoveredAt: new Date() },
      { tone: DialogueTone.PLAYFUL, effectiveness: 75, discoveredAt: new Date() }
    ]
  }

  if (!npcState) {
    return null
  }

  /**
   * Maps NPC mood states to appropriate emoji representations
   * @param mood - The current mood of the NPC
   * @returns Emoji representing the mood
   */
  const getMoodEmoji = (mood: NPCMood) => {
    switch (mood) {
      case NPCMood.HAPPY: return '😊'
      case NPCMood.NEUTRAL: return '😐'
      case NPCMood.SAD: return '😢'
      case NPCMood.EXCITED: return '🤩'
      case NPCMood.ANNOYED: return '😤'
      case NPCMood.SMITTEN: return '🥰'
      case NPCMood.CONFUSED: return '😕'
      default: return '😐'
    }
  }

  return (
    <div className="border-l border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Header - Always visible */}
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-secondary/10"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl" role="img" aria-label={`Mood: ${npcState.mood}`}>
            {getMoodEmoji(npcState.mood)}
          </span>
          <div>
            <h3 className="font-medium">{npcState.name}</h3>
            <p className="text-sm text-secondary-foreground">
              {npcState.relationship_status} • {npcState.affection} AP
            </p>
          </div>
        </div>
        <button 
          className="text-secondary-foreground hover:text-foreground"
          aria-label={isExpanded ? 'Collapse panel' : 'Expand panel'}
        >
          <svg 
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 9l-7 7-7-7" 
            />
          </svg>
        </button>
      </div>

      {/* Expanded Content - Shows detailed NPC information */}
      {isExpanded && (
        <div className="p-4 border-t border-border space-y-6">
          {/* Known Topics - Displays discovered conversation preferences */}
          <section>
            <h4 className="font-medium mb-2">Known Topics</h4>
            <div className="space-y-1">
              {preferences.topics.map((topic, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-2 text-sm"
                >
                  <span role="img" aria-label={topic.type === 'like' ? 'Likes' : 'Dislikes'}>
                    {topic.type === 'like' ? '💚' : '💔'}
                  </span>
                  <span>{topic.description}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Activities - Shows preferred and disliked activities */}
          <section>
            <h4 className="font-medium mb-2">Activities</h4>
            <div className="space-y-1">
              {preferences.activities.map((activity, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-2 text-sm"
                >
                  <span role="img" aria-label={activity.type === 'like' ? 'Likes' : 'Dislikes'}>
                    {activity.type === 'like' ? '💚' : '💔'}
                  </span>
                  <span>{activity.description}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Personality Traits - Displays character values and dislikes */}
          <section>
            <h4 className="font-medium mb-2">Values</h4>
            <div className="space-y-1">
              {preferences.traits.map((trait, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-2 text-sm"
                >
                  <span role="img" aria-label={trait.type === 'like' ? 'Values' : 'Dislikes'}>
                    {trait.type === 'like' ? '💚' : '💔'}
                  </span>
                  <span>{trait.description}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Dialogue Tone Effectiveness - Shows success rates with different approaches */}
          <section>
            <h4 className="font-medium mb-2">Communication Style</h4>
            <div className="space-y-2">
              {preferences.dialogueTones.map((tone, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">
                      {tone.tone.toLowerCase().replace('_', ' ')}
                    </span>
                    <span>{tone.effectiveness}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all"
                      style={{ width: `${tone.effectiveness}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Current Context - Shows active situation and recent events */}
          <section>
            <h4 className="font-medium mb-2">Current Context</h4>
            <div className="space-y-1 text-sm text-secondary-foreground">
              {npcState.context.map((ctx, i) => (
                <p key={i}>{ctx}</p>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
} 