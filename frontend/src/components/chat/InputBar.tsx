import { useChat } from '../../context/ChatContext'
import { useCharacter } from '../../context/CharacterContext'
import { apiClient } from '../../api/api'
import type { KeyboardEvent } from 'react'
import { useState } from 'react'
import { DialogueTone, NPCMood } from '../../types/api'

export function InputBar() {
  const { 
    currentInput, 
    setCurrentInput, 
    addMessage, 
    npcState, 
    dialogueTone,
    setDialogueTone,
    storyContext,
    updateNPCState,
    updateStoryContext
  } = useChat()
  const { character } = useCharacter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    const trimmedInput = currentInput.trim()
    if (!trimmedInput || isLoading || !character || !npcState) return

    // Send user message
    addMessage(trimmedInput, 'player')
    setCurrentInput('')
    
    // Get AI response
    setIsLoading(true)
    try {
      const response = await apiClient.interact({
        npc_id: npcState.name.toLowerCase(),
        player_name: character.name,
        player_dialogue: trimmedInput,
        dialogue_tone: dialogueTone,
        npc_state: npcState,
        story_context: storyContext
      })

      // Update NPC state
      updateNPCState({
        ...npcState,
        mood: response.new_mood,
        affection: npcState.affection + response.affection_change
      })

      // Update story context with the interaction
      updateStoryContext({
        previous_interactions: [
          ...(storyContext.previous_interactions || []),
          `${character.name}: ${trimmedInput}`
        ]
      })

      // Add NPC response
      addMessage(response.response_text, 'npc', response.npc_name)

      // Add narrator message for mood change if significant
      if (response.mood_change_reason && npcState.mood !== response.new_mood) {
        addMessage(response.mood_change_reason, 'narrator')
      }
    } catch (error) {
      console.error('Failed to get AI response:', error)
      addMessage(
        "I apologize, but I'm having trouble processing your message right now.",
        'system'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="border-t border-border bg-background p-4">
      <div className="container mx-auto flex flex-col gap-4">
        {/* Tone selector */}
        <div className="flex gap-2 items-center">
          <label className="text-sm text-secondary-foreground">Tone:</label>
          <select
            value={dialogueTone}
            onChange={(e) => setDialogueTone(e.target.value as DialogueTone)}
            className="text-sm rounded-md border border-border bg-background p-1"
          >
            {Object.entries(DialogueTone).map(([key, value]) => (
              <option key={key} value={value}>
                {key.toLowerCase().replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Input area */}
        <div className="flex gap-4">
          <textarea
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={npcState ? "Type your message..." : "Start a conversation with an NPC first"}
            className="flex-1 resize-none rounded-lg border border-border bg-background p-2 focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px] max-h-[200px]"
            rows={1}
            disabled={isLoading || !npcState}
          />
          <button
            onClick={() => handleSubmit()}
            disabled={!currentInput.trim() || isLoading || !npcState}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending...
              </span>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </div>
    </div>
  )
} 