import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { DiceRoll } from './DiceRoll'

describe('DiceRoll', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders with target number', () => {
    render(<DiceRoll targetNumber={50} />)
    expect(screen.getByText('Target Number: 50')).toBeInTheDocument()
  })

  it('shows custom label when provided', () => {
    render(<DiceRoll targetNumber={50} label="Charm Check" />)
    expect(screen.getByText('Charm Check')).toBeInTheDocument()
  })

  it('disables button while rolling', () => {
    render(<DiceRoll targetNumber={50} />)
    const button = screen.getByRole('button')
    
    fireEvent.click(button)
    expect(button).toBeDisabled()

    // Fast-forward through animation
    act(() => {
      vi.advanceTimersByTime(1100) // 20 rolls * 50ms + buffer
    })

    expect(button).not.toBeDisabled()
  })

  it('calls onRollComplete with result', () => {
    const onRollComplete = vi.fn()
    render(<DiceRoll targetNumber={50} onRollComplete={onRollComplete} />)
    
    fireEvent.click(screen.getByRole('button'))

    // Fast-forward through animation
    act(() => {
      vi.advanceTimersByTime(1100)
    })

    expect(onRollComplete).toHaveBeenCalledTimes(1)
    const [success, roll] = onRollComplete.mock.calls[0]
    expect(typeof success).toBe('boolean')
    expect(typeof roll).toBe('number')
    expect(roll).toBeGreaterThanOrEqual(1)
    expect(roll).toBeLessThanOrEqual(100)
  })
}) 