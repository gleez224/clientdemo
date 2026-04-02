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
  }, [children])

  return (
    <div className={cn('flex flex-col justify-end overflow-y-auto p-8', className)}>
      {children}
      <div ref={bottomRef} />
    </div>
  )
}
