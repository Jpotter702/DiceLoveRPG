import type { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
}

export function Container({ children }: ContainerProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {children}
    </div>
  )
} 