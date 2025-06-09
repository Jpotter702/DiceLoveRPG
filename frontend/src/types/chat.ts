import type { TraitCheck } from '../utils/traitUtils'

export type MessageRole = 'player' | 'npc' | 'narrator' | 'system'

export interface Message {
  id: string
  content: string
  role: MessageRole
  timestamp: Date
  npcName?: string
  actions?: TraitCheck[]
}

export interface ChatState {
  messages: Message[]
  isTyping: boolean
  error: string | null
} 