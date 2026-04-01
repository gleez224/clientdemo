import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import type { Persona } from '@/data/personas'
import type { Message } from '@/types'
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from '@/components/ui/ChatBubble'
import ChatMessageList from '@/components/ui/ChatMessageList'
import { AnimatedAIChat } from '@/components/ui/AIChatInput'
import { VoicePoweredOrb } from '@/components/ui/voice-powered-orb'

interface ChatScreenProps {
  persona: Persona
  onBack: () => void
}

export default function ChatScreen({ persona, onBack }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = (text: string) => {
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Identity bar */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-black/8 dark:border-white/8 bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-black/45 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors duration-150"
        >
          <ArrowLeft size={16} strokeWidth={1.75} />
          Switch client
        </button>

        <div className="h-4 w-[1px] bg-black/10 dark:bg-white/10" />

        <div className="flex items-center gap-3 flex-1">
          <div className={`w-10 h-10 shrink-0 rounded-full overflow-hidden ${isLoading ? 'animate-pulse' : ''}`}>
            <VoicePoweredOrb enableVoiceControl={false} />
          </div>

          <div>
            <span className="text-base font-bold text-black dark:text-white">
              {persona.name}
            </span>
            <span className="ml-2 text-sm text-black/45 dark:text-white/50">
              {persona.archetype}
            </span>
          </div>
        </div>
      </div>

      {/* Message list */}
      <ChatMessageList className="flex-1">
        {messages.map((msg, i) => (
          <ChatBubble key={i} variant={msg.role === 'user' ? 'sent' : 'received'}>
            {msg.role === 'assistant' && (
              <ChatBubbleAvatar src={persona.image} fallback={persona.name[0]} />
            )}
            <ChatBubbleMessage variant={msg.role === 'user' ? 'sent' : 'received'}>
              {msg.content}
            </ChatBubbleMessage>
          </ChatBubble>
        ))}

        {isLoading && (
          <ChatBubble variant="received">
            <ChatBubbleAvatar src={persona.image} fallback={persona.name[0]} />
            <ChatBubbleMessage isLoading={true} />
          </ChatBubble>
        )}
      </ChatMessageList>

      {/* Input bar */}
      <div className="shrink-0 border-t border-black/8 dark:border-white/8">
        <AnimatedAIChat onSend={handleSend} />
      </div>
    </div>
  )
}
