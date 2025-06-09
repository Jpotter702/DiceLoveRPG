import { useChat } from '../../context/ChatContext'
import { useCharacter } from '../../context/CharacterContext'
import { apiClient } from '../../api/api'
import type { KeyboardEvent } from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DialogueTone, NPCMood } from '../../types/api'
import { Send, Loader2 } from 'lucide-react'

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
        ...storyContext,
        previous_interactions: [
          ...(storyContext.previous_interactions || []),
          `${character.name}: ${trimmedInput}`
        ]
      })
      
      // Add NPC response
      addMessage(response.response_text, 'npc')

      // Add narrator message for mood change if significant
      if (response.mood_change_reason && npcState.mood !== response.new_mood) {
        addMessage(response.mood_change_reason, 'narrator')
      }
    } catch (error) {
      console.error('Failed to get NPC response:', error)
      addMessage('Something went wrong...', 'system')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25
      }
    }
  }

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="border-t border-border bg-background/80 backdrop-blur-sm p-4 shadow-medium"
    >
      <div className="container mx-auto flex flex-col gap-4">
        {/* Tone selector */}
        <div className="flex gap-2 items-center">
          <label className="text-sm text-secondary-foreground">Tone:</label>
          <select
            value={dialogueTone}
            onChange={(e) => setDialogueTone(e.target.value as DialogueTone)}
            className="text-sm rounded-lg border border-border bg-background p-1
                     focus:outline-none focus:ring-2 focus:ring-primary/50
                     transition-shadow duration-200"
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
            className="flex-1 resize-none rounded-lg border border-border bg-background p-2 
                     focus:outline-none focus:ring-2 focus:ring-primary/50
                     shadow-soft hover:shadow-medium
                     transition-all duration-200
                     min-h-[44px] max-h-[200px]"
            rows={1}
            disabled={isLoading || !npcState}
          />
          <motion.button
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={handleSubmit}
            disabled={!currentInput.trim() || isLoading || !npcState}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg 
                     hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed
                     shadow-soft hover:shadow-medium transition-all duration-200"
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, rotate: 0 }}
                  animate={{ opacity: 1, rotate: 360 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                  className="flex items-center gap-2"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending...</span>
                </motion.div>
              ) : (
                <motion.div
                  key="send"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
} 