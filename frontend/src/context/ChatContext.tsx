import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { Message, MessageRole } from '../types/chat'
import type { NPCState, StoryContext } from '../types/api'
import { DialogueTone } from '../types/api'

/**
 * Type definition for the Chat context value
 */
interface ChatContextType {
  messages: Message[]          // Array of all messages in the chat
  currentInput: string        // Current text in the input field
  npcState: NPCState | null   // Current NPC state
  dialogueTone: DialogueTone  // Current dialogue tone
  storyContext: StoryContext  // Current story context
  setCurrentInput: (input: string) => void
  setDialogueTone: (tone: DialogueTone) => void
  addMessage: (content: string, role: MessageRole, npcName?: string) => void
  clearChat: () => void      // Resets both messages and input
  updateNPCState: (newState: NPCState) => void
  updateStoryContext: (newContext: Partial<StoryContext>) => void
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
  const [dialogueTone, setDialogueTone] = useState<DialogueTone>(DialogueTone.FRIENDLY)
  const [npcState, setNPCState] = useState<NPCState | null>(null)
  const [storyContext, setStoryContext] = useState<StoryContext>({
    location: 'Cafe',
    time_of_day: 'afternoon',
    current_event: 'First Meeting',
    previous_interactions: []
  })

  // Memoized function to add new messages to the chat
  const addMessage = useCallback((
    content: string, 
    role: MessageRole,
    npcName?: string
  ) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      content,
      role,
      timestamp: new Date(),
      npcName
    }
    setMessages(prev => [...prev, newMessage])
  }, [])

  // Memoized function to clear the chat history
  const clearChat = useCallback(() => {
    setMessages([])
    setCurrentInput('')
    setNPCState(null)
  }, [])

  // Memoized function to update NPC state
  const updateNPCState = useCallback((newState: NPCState) => {
    setNPCState(newState)
  }, [])

  // Memoized function to update story context
  const updateStoryContext = useCallback((newContext: Partial<StoryContext>) => {
    setStoryContext(prev => ({ ...prev, ...newContext }))
  }, [])

  return (
    <ChatContext.Provider 
      value={{
        messages,
        currentInput,
        npcState,
        dialogueTone,
        storyContext,
        setCurrentInput,
        setDialogueTone,
        addMessage,
        clearChat,
        updateNPCState,
        updateStoryContext
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