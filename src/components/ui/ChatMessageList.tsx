import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface ChatMessageListProps {
  children: React.ReactNode
  className?: string
}

export default function ChatMessageList({ children, className }: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  })

  return (
    <div className={cn('flex flex-col overflow-y-auto px-6 py-4', className)}>
      {children}
      <div ref={bottomRef} />
    </div>
  )
}
