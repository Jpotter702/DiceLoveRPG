import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MessageBubble } from './MessageBubble'

describe('MessageBubble', () => {
  it('renders user message correctly', () => {
    const message = {
      id: '1',
      content: 'Hello world',
      timestamp: new Date(),
      role: 'player' as const,
      sender: 'user' as const
    }

    render(<MessageBubble message={message} showTimestamp={true} />)
    
    expect(screen.getByText('Hello world')).toBeInTheDocument()
    expect(screen.getByTestId('message-bubble')).toHaveClass('justify-end')
  })

  it('renders NPC message correctly', () => {
    const message = {
      id: '2',
      content: 'Hi there!',
      timestamp: new Date(),
      role: 'npc' as const,
      sender: 'npc' as const,
      npcName: 'Sarah'
    }

    render(<MessageBubble message={message} showTimestamp={true} />)
    
    expect(screen.getByText('Hi there!')).toBeInTheDocument()
    expect(screen.getByText('Sarah')).toBeInTheDocument()
    expect(screen.getByTestId('message-bubble')).toHaveClass('justify-start')
  })

  it('renders narrator message correctly', () => {
    const message = {
      id: '3',
      content: 'The evening breeze carries a gentle whisper.',
      timestamp: new Date(),
      role: 'narrator' as const,
      sender: 'npc' as const
    }

    render(<MessageBubble message={message} showTimestamp={true} />)
    
    expect(screen.getByText('The evening breeze carries a gentle whisper.')).toBeInTheDocument()
    expect(screen.getByTestId('message-bubble')).toHaveClass('justify-center')
    // Check for italic styling on narrator messages
    expect(screen.getByText('The evening breeze carries a gentle whisper.').parentElement).toHaveClass('italic')
  })
}) 