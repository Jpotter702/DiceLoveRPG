import { useEffect, useRef, useState } from 'react'
import { useChat } from '../../context/ChatContext'
import { MessageBubble } from './MessageBubble'
import { InputBar } from './InputBar'
import { getSystemMessage } from '../../api/api'
import type { Message } from '../../types/chat'

export function ChatWindow() {
  const { messages, addMessage } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize with system message
  useEffect(() => {
    if (!isInitialized && messages.length === 0) {
      const initChat = async () => {
        try {
          const systemMsg = await getSystemMessage()
          addMessage(systemMsg.content, 'npc', systemMsg.role)
        } catch (error) {
          console.error('Failed to initialize chat:', error)
        }
        setIsInitialized(true)
      }
      initChat()
    }
  }, [isInitialized, messages.length, addMessage])

  // Check if user has scrolled up
  const handleScroll = () => {
    if (!scrollContainerRef.current) return
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
    const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 50
    setAutoScroll(isAtBottom)
  }

  const scrollToBottom = () => {
    if (!autoScroll) return
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, autoScroll])

  // Group messages by time (show timestamp if > 5 minutes between messages)
  const shouldShowTimestamp = (message: Message, index: number) => {
    if (index === 0) return true
    const prevMessage = messages[index - 1]
    const timeDiff = message.timestamp.getTime() - prevMessage.timestamp.getTime()
    return timeDiff > 5 * 60 * 1000 // 5 minutes
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 scroll-smooth"
      >
        <div className="container mx-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-secondary-foreground/60">
              <div className="text-center">
                <p className="text-lg mb-2">Welcome to Love & Dice!</p>
                <p className="text-sm">Your adventure begins here...</p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <MessageBubble 
                key={message.id} 
                message={message}
                showTimestamp={shouldShowTimestamp(message, index)}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <InputBar />
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
  )
} 