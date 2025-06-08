import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

/**
 * Represents a single message in the chat history
 */
interface Message {
  id: string
  content: string
  sender: 'user' | 'npc'
  timestamp: Date
  npcName?: string  // Optional name for NPC messages
}

/**
 * Type definition for the Chat context value
 */
interface ChatContextType {
  messages: Message[]          // Array of all messages in the chat
  currentInput: string        // Current text in the input field
  setCurrentInput: (input: string) => void
  addMessage: (content: string, sender: 'user' | 'npc', npcName?: string) => void
  clearChat: () => void      // Resets both messages and input
}

// Create context with undefined default value
const ChatContext = createContext<ChatContextType | undefined>(undefined)

/**
 * Provider component that wraps app to provide chat functionality
 * Manages message history and current input state
 */
export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentInput, setCurrentInput] = useState('')

  // Memoized function to add new messages to the chat
  const addMessage = useCallback((content: string, sender: 'user' | 'npc', npcName?: string) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      content,
      sender,
      timestamp: new Date(),
      npcName
    }
    setMessages(prev => [...prev, newMessage])
  }, [])

  // Memoized function to clear the chat history
  const clearChat = useCallback(() => {
    setMessages([])
    setCurrentInput('')
  }, [])

  return (
    <ChatContext.Provider 
      value={{
        messages,
        currentInput,
        setCurrentInput,
        addMessage,
        clearChat
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

/**
 * Custom hook to use the chat context
 * @throws {Error} If used outside of ChatProvider
 */
export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
} 