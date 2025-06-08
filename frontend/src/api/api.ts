import type { MessageRole } from '../types/chat'

/**
 * Interface defining the structure of AI responses
 * Includes message content, role type, and optional NPC name
 */
interface AIResponse {
  content: string
  role: MessageRole
  npcName?: string
}

/**
 * Collection of pre-defined responses to simulate AI interaction
 * Includes a mix of narrator descriptions, NPC dialogue, and system messages
 */
const mockResponses: AIResponse[] = [
  {
    content: "You feel a connection spark between you and them, like electricity in the air.",
    role: 'narrator'
  },
  {
    content: "I appreciate your honesty. It's refreshing to meet someone so direct.",
    role: 'npc',
    npcName: 'Sarah'
  },
  {
    content: "The evening breeze carries the faint scent of cherry blossoms as you both share a moment of comfortable silence.",
    role: 'narrator'
  },
  {
    content: "That's an interesting perspective. Tell me more about how you see things.",
    role: 'npc',
    npcName: 'Alex'
  },
  {
    content: "Your words seem to have struck a chord, and you notice a subtle change in their expression.",
    role: 'narrator'
  }
]

/**
 * Generates a random delay between 500-1500ms to simulate network latency
 * @returns Number of milliseconds to delay
 */
const randomDelay = () => Math.random() * 1000 + 500

/**
 * Simulates an AI response to user input with realistic delay and contextual responses
 * @param message The user's message to respond to
 * @returns Promise resolving to an AI response object
 */
export async function getAIResponse(message: string): Promise<AIResponse> {
  await new Promise(resolve => setTimeout(resolve, randomDelay()))
  
  // Handle special case responses based on message content
  if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
    return {
      content: "Hello! It's wonderful to meet you. How are you today?",
      role: 'npc',
      npcName: 'Sarah'
    }
  }

  if (message.toLowerCase().includes('goodbye') || message.toLowerCase().includes('bye')) {
    return {
      content: "The conversation draws to a close, leaving a lingering warmth in the air.",
      role: 'narrator'
    }
  }

  // Return random response for general messages
  return mockResponses[Math.floor(Math.random() * mockResponses.length)]
}

/**
 * Generates initial system message when chat starts
 * @returns Promise resolving to system message response
 */
export async function getSystemMessage(): Promise<AIResponse> {
  await new Promise(resolve => setTimeout(resolve, randomDelay()))
  
  return {
    content: "Connection established. Your adventure awaits...",
    role: 'system'
  }
}

/**
 * Simulates AI typing delay for more natural conversation flow
 * @returns Promise that resolves after 1-3 seconds
 */
export async function simulateTyping(): Promise<void> {
  const typingDuration = Math.random() * 2000 + 1000
  await new Promise(resolve => setTimeout(resolve, typingDuration))
} 