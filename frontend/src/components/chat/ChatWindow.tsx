import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from '../../context/ChatContext'
import { MessageBubble } from './MessageBubble'
import { InputBar } from './InputBar'
import { APTracker } from './APTracker'
import { NPCPanel } from '../npc/NPCPanel'
import { NPCMood } from '../../types/api'
import type { Message } from '../../types/chat'
import { format } from 'date-fns'
import { ArrowDown } from 'lucide-react'

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
  const [showScrollButton, setShowScrollButton] = useState(false)

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

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, autoScroll])

  // Handle scroll events
  const handleScroll = () => {
    if (!scrollContainerRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    const isNearBottom = distanceFromBottom < 100

    setAutoScroll(isNearBottom)
    setShowScrollButton(!isNearBottom)
  }

  // Scroll to bottom manually
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      setAutoScroll(true)
    }
  }

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

  // Animation variants for the scroll button
  const scrollButtonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      y: 10,
      transition: {
        duration: 0.2
      }
    }
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <APTracker />
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 scroll-smooth bg-background/50 backdrop-blur-sm"
        >
          <div className="container mx-auto">
            <AnimatePresence mode="popLayout">
              {messages.length === 0 ? (
                // Welcome screen when no messages exist
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center h-full text-secondary-foreground/60"
                >
                  <div className="text-center">
                    <p className="text-lg mb-2">Welcome to Love & Dice!</p>
                    <p className="text-sm">Your adventure begins here...</p>
                  </div>
                </motion.div>
              ) : (
                // Message list with timestamps
                messages.map((message, index) => {
                  const showTimestamp = shouldShowTimestamp(message, index)
                  return (
                    <motion.div
                      key={message.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="mb-4"
                    >
                      {showTimestamp && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center text-xs text-secondary-foreground/60 mb-2"
                        >
                          {format(message.timestamp, 'MMM d, h:mm a')}
                        </motion.div>
                      )}
                      <MessageBubble 
                        role={message.role}
                        content={message.content}
                        timestamp={message.timestamp}
                        actions={message.actions}
                      />
                    </motion.div>
                  )
                })
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </div>
        <InputBar />

        {/* Scroll to bottom button */}
        <AnimatePresence>
          {showScrollButton && (
            <motion.button
              variants={scrollButtonVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={scrollToBottom}
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2
                        p-2 rounded-full bg-primary text-primary-foreground
                        shadow-medium hover:shadow-strong
                        transition-shadow duration-200"
            >
              <ArrowDown className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      {/* NPC Information Panel */}
      <div className="w-80">
        <NPCPanel />
      </div>
    </div>
  )
} 