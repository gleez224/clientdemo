import { useState, useEffect, useRef, useCallback } from 'react'
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
  // Display messages — never includes the hidden seed trigger
  const [messages, setMessages] = useState<Message[]>([])

  // Full API history (trigger + all turns) — ref is source of truth in async callbacks
  const chatHistoryRef = useRef<Message[]>([])

  const [isSeeding, setIsSeeding] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calls the API with the current chatHistoryRef and appends the assistant reply
  const callApi = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistoryRef.current,
          system: persona.systemPrompt,
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const assistantMsg: Message = {
        role: 'assistant',
        content: data.content[0].text,
      }
      chatHistoryRef.current = [...chatHistoryRef.current, assistantMsg]
      setMessages(prev => [...prev, assistantMsg])
    } catch (err) {
      setError('Something went wrong. Tap Retry to try again.')
    } finally {
      setIsLoading(false)
    }
  }, [persona.systemPrompt])

  // Seed the conversation on mount: send hidden trigger, store both sides, show only opening line
  useEffect(() => {
    const seed = async () => {
      setIsSeeding(true)
      setIsLoading(true)
      setError(null)
      const trigger: Message = {
        role: 'user',
        content: `Start the conversation. Open with your first line as ${persona.name}. Be in character immediately.`,
      }
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [trigger],
            system: persona.systemPrompt,
          }),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        const openingLine: Message = {
          role: 'assistant',
          content: data.content[0].text,
        }
        // Store trigger + opening in history — trigger is hidden from display
        chatHistoryRef.current = [trigger, openingLine]
        // Only the assistant opening line goes into display messages
        setMessages([openingLine])
      } catch (err) {
        setError('Failed to connect. Check your connection and go back to retry.')
      } finally {
        setIsLoading(false)
        setIsSeeding(false)
      }
    }
    seed()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSend = (text: string) => {
    if (isLoading || isSeeding) return
    const userMsg: Message = { role: 'user', content: text }
    // Append to display immediately
    setMessages(prev => [...prev, userMsg])
    // Append to ref before the async call — prevents stale closure on retry
    chatHistoryRef.current = [...chatHistoryRef.current, userMsg]
    callApi()
  }

  const handleRetry = () => {
    // chatHistoryRef already ends with the failed user message — just re-call the API
    callApi()
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

        {isSeeding && (
          <span className="text-xs text-black/40 dark:text-white/40 shrink-0">
            Connecting…
          </span>
        )}
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

        {error && !isLoading && (
          <div className="flex flex-col items-center gap-2 py-4">
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
            {/* Only show retry if there is a pending user message to re-send */}
            {chatHistoryRef.current.length > 0 &&
              chatHistoryRef.current[chatHistoryRef.current.length - 1].role === 'user' && (
                <button
                  onClick={handleRetry}
                  className="text-sm font-semibold text-black dark:text-white underline underline-offset-2 hover:opacity-70 transition-opacity"
                >
                  Retry
                </button>
              )}
          </div>
        )}
      </ChatMessageList>

      {/* Input — pointer-events disabled while loading or seeding */}
      <div className={`shrink-0 border-t border-black/8 dark:border-white/8 ${isLoading || isSeeding ? 'pointer-events-none opacity-50' : ''}`}>
        <AnimatedAIChat onSend={handleSend} />
      </div>
    </div>
  )
}
