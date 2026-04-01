import { useState, useEffect, useRef, useCallback } from 'react'
import { ArrowLeft } from 'lucide-react'
import type { Persona } from '@/data/personas'
import type { Message, ScoreResult } from '@/types'
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from '@/components/ui/ChatBubble'
import ChatMessageList from '@/components/ui/ChatMessageList'
import { AnimatedAIChat } from '@/components/ui/AIChatInput'
import { VoicePoweredOrb } from '@/components/ui/voice-powered-orb'
import ScoreScreen from '@/components/ui/ScoreScreen'

interface ChatScreenProps {
  persona: Persona
  onBack: () => void
}

type ConversationOutcome = 'closed' | 'walked' | 'ghosted' | null

const CLOSED_PHRASES = [
  "let's set something up", "let's schedule", "book a call", "set something up",
  "let's do it", "i'm in", "sounds good, let's", "we can move forward",
  "let's talk more", "happy to connect", "send me", "set up a time",
]

const WALKED_PHRASES = [
  "i'm done here", "not interested", "wasting my time", "have a good one",
  "good luck with that", "this isn't going anywhere", "i have to go",
  "stop reaching out", "not the right fit", "i'll pass",
]

const GHOSTED_PHRASES = [
  "check my calendar", "get back to you", "over email", "too busy right now",
  "circle back", "let me think", "maybe next month", "not a good time",
]

function detectOutcome(
  content: string,
  isJordan: boolean,
  assistantMessageCount: number
): ConversationOutcome {
  const lower = content.toLowerCase()

  for (const phrase of CLOSED_PHRASES) {
    if (lower.includes(phrase)) return 'closed'
  }
  for (const phrase of WALKED_PHRASES) {
    if (lower.includes(phrase)) return 'walked'
  }
  if (isJordan && assistantMessageCount >= 6) {
    for (const phrase of GHOSTED_PHRASES) {
      if (lower.includes(phrase)) return 'ghosted'
    }
  }
  return null
}

const SCORE_REQUEST =
  `[SCORE_REQUEST] Evaluate this conversation as a sales training coach. Return ONLY valid JSON, no other text:
{
  "score": <number 0-100>,
  "pass": <boolean, true if score >= 70>,
  "strengths": [<string>, ...],
  "improvements": [{ "message": <number>, "issue": <string> }, ...],
  "summary": "<one sentence>"
}`

export default function ChatScreen({ persona, onBack }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const chatHistoryRef = useRef<Message[]>([])
  const assistantCountRef = useRef(0)

  const [isSeeding, setIsSeeding] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversationOutcome, setConversationOutcome] = useState<ConversationOutcome>(null)
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null)
  const [isScoring, setIsScoring] = useState(false)

  // Incrementing this re-triggers the seed useEffect for retry
  const [seedKey, setSeedKey] = useState(0)

  const isJordan = persona.id === 'ghoster'

  const fetchScore = useCallback(async () => {
    setIsScoring(true)
    const scoringMsg: Message = { role: 'user', content: SCORE_REQUEST }
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Temp copy — does not mutate chatHistoryRef
          messages: [...chatHistoryRef.current, scoringMsg],
          system: persona.systemPrompt,
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const raw = data.content[0].text
      // Strip any markdown code fences if the model wrapped the JSON
      const jsonText = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
      const parsed: ScoreResult = JSON.parse(jsonText)
      setScoreResult(parsed)
    } catch (err) {
      console.error('Score fetch failed:', err)
      // Fallback so the screen still appears
      setScoreResult({
        score: 0,
        pass: false,
        strengths: [],
        improvements: [],
        summary: 'Could not load score. Please try again.',
      })
    } finally {
      setIsScoring(false)
    }
  }, [persona.systemPrompt])

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
      assistantCountRef.current += 1
      setMessages(prev => [...prev, assistantMsg])

      // Check for conversation outcome (skip during seeding)
      const outcome = detectOutcome(
        assistantMsg.content,
        isJordan,
        assistantCountRef.current
      )
      if (outcome) {
        setConversationOutcome(outcome)
        fetchScore()
      }
    } catch (err) {
      setError('Something went wrong. Tap Retry to try again.')
    } finally {
      setIsLoading(false)
    }
  }, [persona.systemPrompt, isJordan, fetchScore])

  // Seed on mount, and on retry (seedKey change)
  useEffect(() => {
    let cancelled = false

    const seed = async () => {
      setIsSeeding(true)
      setIsLoading(true)
      setError(null)
      assistantCountRef.current = 0
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
        if (cancelled) return
        chatHistoryRef.current = [trigger, openingLine]
        assistantCountRef.current = 1
        setMessages([openingLine])
      } catch (err) {
        if (!cancelled) setError('Failed to connect. Go back and try again.')
      } finally {
        if (!cancelled) {
          setIsLoading(false)
          setIsSeeding(false)
        }
      }
    }

    seed()
    return () => { cancelled = true }
  }, [seedKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSend = (text: string) => {
    if (isLoading || isSeeding || conversationOutcome) return
    const userMsg: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    chatHistoryRef.current = [...chatHistoryRef.current, userMsg]
    callApi()
  }

  const handleRetry = () => {
    callApi()
  }

  const handleTryAgain = () => {
    setMessages([])
    chatHistoryRef.current = []
    setConversationOutcome(null)
    setScoreResult(null)
    setError(null)
    setSeedKey(k => k + 1)
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 relative">
      {/* Identity bar */}
      <div className="flex flex-col px-6 pt-5 pb-4 border-b border-black/8 dark:border-white/8 bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-medium text-black/40 dark:text-white/40 hover:text-black/70 dark:hover:text-white/70 transition-colors duration-150 w-fit"
        >
          <ArrowLeft size={12} strokeWidth={2} />
          Switch client
        </button>

        <p className="mt-2 text-xl font-bold text-black dark:text-white leading-tight">
          {persona.name}
        </p>

        <p className="mt-0.5 text-[13px] text-black/50 dark:text-white/50">
          {persona.archetype}
          {isSeeding && <span className="ml-2">· Connecting…</span>}
          {isScoring && <span className="ml-2">· Scoring…</span>}
        </p>
      </div>

      {/* Chat column — centered container */}
      <div className="flex-1 min-h-0 flex flex-col px-4 py-3 overflow-hidden">
        <div className="flex-1 min-h-0 flex flex-col w-full max-w-[780px] mx-auto bg-white/[0.02] dark:bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">

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

          {/* Orb — 48×48 ambient indicator, bottom left */}
          <div className="shrink-0 px-4 pt-3 pb-1 flex">
            <div className={`w-12 h-12 rounded-full overflow-hidden opacity-80 ${isLoading ? 'animate-pulse' : ''}`}>
              <VoicePoweredOrb enableVoiceControl={false} />
            </div>
          </div>

          {/* Input */}
          <div className={`shrink-0 border-t border-white/[0.06] ${isLoading || isSeeding || !!conversationOutcome ? 'pointer-events-none opacity-50' : ''}`}>
            <AnimatedAIChat onSend={handleSend} />
          </div>

        </div>
      </div>

      {/* Score screen overlay — renders when scoreResult is ready */}
      {scoreResult && (
        <ScoreScreen
          scoreResult={scoreResult}
          outcome={conversationOutcome!}
          personaName={persona.name}
          onTryAgain={handleTryAgain}
          onSwitchClient={onBack}
        />
      )}
    </div>
  )
}
