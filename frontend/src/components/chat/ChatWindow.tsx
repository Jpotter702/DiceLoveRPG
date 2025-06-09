import { useEffect, useRef, useState } from 'react'
import { useChat } from '../../context/ChatContext'
import { MessageBubble } from './MessageBubble'
import { InputBar } from './InputBar'
import { APTracker } from './APTracker'
import { NPCPanel } from '../npc/NPCPanel'
import { NPCMood } from '../../types/api'
import type { Message } from '../../types/chat'
import { format } from 'date-fns'

/**
 * ChatWindow Component
 * 
 * The main interface for player-NPC interactions in Love & Dice RPG.
 * Features:
 * - Real-time message display with role-based styling
 * - Automatic scrolling with manual override
 * - Timestamp grouping for message clarity
 * - Affection Points (AP) tracking
 * - NPC information panel
 * - System message initialization
 * 
 * Layout:
 * - Main chat area with message bubbles
 * - Input bar for player messages
 * - AP tracker at the top
 * - Collapsible NPC information panel on the right
 * - Scroll-to-bottom button when viewing history
 */
export function ChatWindow() {
  const { messages, addMessage, updateNPCState } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  /**
   * Initialize chat with welcome message and default NPC
   * This runs once when the component first mounts
   */
  useEffect(() => {
    if (!isInitialized && messages.length === 0) {
      const initChat = async () => {
        try {
          // Initialize with a welcome message
          addMessage(
            "Welcome to Love & Dice! Your romantic adventure awaits. Start by approaching an NPC to begin a conversation.",
            'system'
          )

          // Initialize with a default NPC for testing
          updateNPCState({
            name: 'Sarah',
            affection: 0,
            mood: NPCMood.NEUTRAL,
            context: ['First meeting'],
            relationship_status: 'stranger'
          })
        } catch (error) {
          console.error('Failed to initialize chat:', error)
        }
        setIsInitialized(true)
      }
      initChat()
    }
  }, [isInitialized, messages.length, addMessage, updateNPCState])

  /**
   * Handles scroll events to determine if auto-scroll should be enabled
   * Auto-scroll is disabled when user manually scrolls up to view history
   */
  const handleScroll = () => {
    if (!scrollContainerRef.current) return
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
    const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 50
    setAutoScroll(isAtBottom)
  }

  /**
   * Scrolls to the bottom of the chat if auto-scroll is enabled
   * This is called after new messages are added
   */
  const scrollToBottom = () => {
    if (!autoScroll) return
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Auto-scroll when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [messages, autoScroll])

  /**
   * Determines if a timestamp should be shown above a message
   * Shows timestamp if:
   * - It's the first message
   * - More than 5 minutes have passed since the previous message
   * 
   * @param message - The current message
   * @param index - Index of the message in the messages array
   * @returns boolean indicating if timestamp should be shown
   */
  const shouldShowTimestamp = (message: Message, index: number) => {
    if (index === 0) return true
    const prevMessage = messages[index - 1]
    const timeDiff = message.timestamp.getTime() - prevMessage.timestamp.getTime()
    return timeDiff > 5 * 60 * 1000 // 5 minutes
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <APTracker />
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 scroll-smooth"
        >
          <div className="container mx-auto">
            {messages.length === 0 ? (
              // Welcome screen when no messages exist
              <div className="flex items-center justify-center h-full text-secondary-foreground/60">
                <div className="text-center">
                  <p className="text-lg mb-2">Welcome to Love & Dice!</p>
                  <p className="text-sm">Your adventure begins here...</p>
                </div>
              </div>
            ) : (
              // Message list with timestamps
              messages.map((message, index) => {
                const showTimestamp = shouldShowTimestamp(message, index)
                return (
                  <div key={message.id} className="mb-4">
                    {showTimestamp && (
                      <div className="text-center text-xs text-secondary-foreground/60 mb-2">
                        {format(message.timestamp, 'MMM d, h:mm a')}
                      </div>
                    )}
                    <MessageBubble 
                      role={message.role}
                      content={message.content}
                      timestamp={message.timestamp}
                      actions={message.actions}
                    />
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <InputBar />
        {/* Scroll to bottom button - shown when viewing history */}
        {!autoScroll && messages.length > 0 && (
          <button
            onClick={() => {
              setAutoScroll(true)
              scrollToBottom()
            }}
            className="absolute bottom-20 right-8 bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:bg-primary/90"
            aria-label="Scroll to bottom"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </button>
        )}
      </div>
      {/* NPC Information Panel */}
      <div className="w-80">
        <NPCPanel />
      </div>
    </div>
  )
} 