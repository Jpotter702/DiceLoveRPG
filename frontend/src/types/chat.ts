export type MessageRole = 'player' | 'npc' | 'narrator' | 'system'

export interface Message {
  id: string
  content: string
  sender: 'user' | 'npc'
  role: MessageRole
  timestamp: Date
  npcName?: string
} 