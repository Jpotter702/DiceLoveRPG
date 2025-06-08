import { useChat } from '../../context/ChatContext'
import { getAIResponse, simulateTyping } from '../../api/api'
import type { KeyboardEvent } from 'react'
import { useState } from 'react'

export function InputBar() {
  const { currentInput, setCurrentInput, addMessage } = useChat()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    const trimmedInput = currentInput.trim()
    if (!trimmedInput || isLoading) return

    // Send user message
    addMessage(trimmedInput, 'user', 'player')
    setCurrentInput('')
    
    // Get AI response
    setIsLoading(true)
    try {
      await simulateTyping()
      const response = await getAIResponse(trimmedInput)
      addMessage(response.content, 'npc', response.role, response.npcName)
    } catch (error) {
      console.error('Failed to get AI response:', error)
      addMessage(
        "I apologize, but I'm having trouble processing your message right now.",
        'npc',
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
      <div className="container mx-auto flex gap-4">
        <textarea
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 resize-none rounded-lg border border-border bg-background p-2 focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px] max-h-[200px]"
          rows={1}
          disabled={isLoading}
        />
        <button
          onClick={() => handleSubmit()}
          disabled={!currentInput.trim() || isLoading}
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
  )
} 