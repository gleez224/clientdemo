import { useState, useEffect, useRef, useCallback } from 'react'
import { ArrowLeft, Flag } from 'lucide-react'
import type { Persona } from '@/data/personas'
import type { Message, ScoreResult, BusinessContext } from '@/types'
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from '@/components/ui/ChatBubble'
import ChatMessageList from '@/components/ui/ChatMessageList'
import { AnimatedAIChat } from '@/components/ui/AIChatInput'
import ScoreScreen from '@/components/ui/ScoreScreen'

interface ChatScreenProps {
  persona: Persona
  businessContext: BusinessContext
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

function extractOutcomeTag(content: string): { outcome: ConversationOutcome | null; clean: string } {
  // Allow optional whitespace around the keyword: [OUTCOME: CLOSED] or [OUTCOME:CLOSED]
  const match = content.match(/\[OUTCOME:\s*(CLOSED|WALKED|GHOSTED)\s*\]/i)
  if (!match) return { outcome: null, clean: content }
  const outcome = match[1].toUpperCase()
  console.log('[OUTCOME TAG] Detected in raw response:', outcome)
  return {
    outcome: match[1].toLowerCase() as ConversationOutcome,
    clean: content.replace(/\[OUTCOME:\s*(CLOSED|WALKED|GHOSTED)\s*\]/gi, '').trim(),
  }
}

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
  "improvements": [
    {
      "messageIndex": <1-based index of the user message being reviewed>,
      "whatYouSaid": "<exact quote of what the user said in that message>",
      "whyItFailed": "<one sentence, direct — why this hurt the sale>",
      "whatToSayInstead": "<the exact alternative message they should have sent — real, direct, human — Jagged Writing Protocol: short sentences, no fluff, specific>"
    }
  ],
  "closingSuggestion": <if score < 70: a persona-specific closing line the user could have used to turn this conversation around, written in Jagged Writing Protocol style — real attitude, short sentences, references the persona's specific objections. If score >= 70: null>,
  "summary": "<one sentence>"
}`

export default function ChatScreen({ persona, businessContext, onBack }: ChatScreenProps) {
  const fullSystemPrompt =
    `The person pitching you sells ${businessContext.whatYouSell} to ${businessContext.targetClient}. ` +
    `Their offer is: ${businessContext.pitch}. Their pricing: ${businessContext.pricing}. ` +
    `React to THIS specifically — not generic sales pitches.\n\n` +
    persona.systemPrompt

  const [messages, setMessages] = useState<Message[]>([])
  const chatHistoryRef = useRef<Message[]>([])
  const assistantCountRef = useRef(0)

  const [isSeeding, setIsSeeding] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversationOutcome, setConversationOutcome] = useState<ConversationOutcome>(null)
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null)
  const [isScoring, setIsScoring] = useState(false)

  const [seedKey, setSeedKey] = useState(0)

  const isJordan = persona.id === 'ghoster'

  const fetchScore = useCallback(async () => {
    console.log('[SCORE] fetchScore fired — history length:', chatHistoryRef.current.length)
    setIsScoring(true)
    const scoringMsg: Message = { role: 'user', content: SCORE_REQUEST }
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatHistoryRef.current, scoringMsg],
          system: fullSystemPrompt,
          maxTokens: 2048,
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const raw = data.content[0].text
      console.log('[SCORE] Raw response length:', raw.length)
      const jsonText = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
      const parsed: ScoreResult = JSON.parse(jsonText)
      console.log('[SCORE] Parsed successfully — score:', parsed.score)
      setScoreResult(parsed)
    } catch (err) {
      console.error('[SCORE] fetchScore failed:', err)
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
  }, [fullSystemPrompt])

  const callApi = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistoryRef.current,
          system: fullSystemPrompt,
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()

      // Extract and strip any [OUTCOME:X] tag before displaying
      const { outcome: tagOutcome, clean } = extractOutcomeTag(data.content[0].text)

      const assistantMsg: Message = {
        role: 'assistant',
        content: clean,
      }
      chatHistoryRef.current = [...chatHistoryRef.current, assistantMsg]
      assistantCountRef.current += 1
      setMessages(prev => [...prev, assistantMsg])

      // Tag-based detection first, fall back to phrase matching
      const outcome = tagOutcome ?? detectOutcome(clean, isJordan, assistantCountRef.current)
      console.log('[OUTCOME] tag:', tagOutcome, '| phrase:', detectOutcome(clean, isJordan, assistantCountRef.current), '| final:', outcome)
      if (outcome) {
        console.log('[OUTCOME] Setting conversationOutcome →', outcome, '— firing fetchScore')
        setConversationOutcome(outcome)
        fetchScore()
      }
    } catch (err) {
      setError('Something went wrong. Tap Retry to try again.')
    } finally {
      setIsLoading(false)
    }
  }, [persona.systemPrompt, isJordan, fetchScore])

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
            system: fullSystemPrompt,
          }),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        const { clean } = extractOutcomeTag(data.content[0].text)
        const openingLine: Message = {
          role: 'assistant',
          content: clean,
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

  const handleEndAndScore = () => {
    setConversationOutcome('walked')
    fetchScore()
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

      {/* Chat column — unified container with header inside */}
      <div className="flex-1 min-h-0 flex flex-col px-4 py-3 overflow-hidden">
        <div className="flex-1 min-h-0 flex flex-col w-full max-w-[780px] mx-auto bg-white/[0.02] dark:bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden relative">

          {/* Pinned ambient blobs — dark mode only */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none opacity-0 dark:opacity-[0.012] bg-gradient-to-br from-violet-500 to-fuchsia-500 blur-[96px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full pointer-events-none opacity-0 dark:opacity-[0.012] bg-gradient-to-tr from-fuchsia-500 to-indigo-500 blur-[96px] translate-y-1/2 -translate-x-1/2" />

          {/* Unified header — inside container */}
          <div className="shrink-0 relative z-10 flex items-center justify-between px-4 h-16 border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
            {/* Left: avatar + name + archetype */}
            <div className="flex items-center gap-3">
              <img
                src={persona.image}
                alt={persona.name}
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
              <div className="flex flex-col">
                <p className="text-sm font-bold text-black dark:text-white leading-tight">
                  {persona.name}
                </p>
                <p className="text-xs text-black/45 dark:text-white/40 leading-tight">
                  {persona.archetype}
                  {isSeeding && <span className="ml-1.5">· Connecting…</span>}
                  {isScoring && <span className="ml-1.5">· Scoring…</span>}
                </p>
              </div>
            </div>

            {/* Right: End & Score + Switch client */}
            <div className="flex items-center gap-2">
              {messages.length >= 4 && !conversationOutcome && (
                <button
                  onClick={handleEndAndScore}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                  style={{
                    background: 'linear-gradient(#08080a, #08080a) padding-box, linear-gradient(90deg, #5e2e88, #de3582) border-box',
                    border: '1px solid transparent',
                  }}
                >
                  <Flag size={11} />
                  End & Score
                </button>
              )}
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-black/50 dark:text-white/40 hover:text-black/80 dark:hover:text-white/70 border border-black/10 dark:border-white/10 transition-colors"
              >
                <ArrowLeft size={11} strokeWidth={2} />
                Switch client
              </button>
            </div>
          </div>

          {/* Message list */}
          <ChatMessageList className="flex-1">
            {/* Empty state watermark */}
            {messages.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center select-none pointer-events-none">
                <p
                  className="text-[72px] font-black uppercase tracking-tight opacity-[0.04] text-black dark:text-white leading-none text-center"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {persona.name}
                </p>
                <p
                  className="text-base font-bold uppercase tracking-widest opacity-[0.03] text-black dark:text-white mt-2 text-center"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {persona.archetype}
                </p>
              </div>
            )}

            {/* Spacer — anchors messages to bottom when list is short */}
            {messages.length > 0 && <div className="flex-1" />}

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

          {/* Input */}
          <div className={`shrink-0 border-t border-white/[0.06] ${isLoading || isSeeding || !!conversationOutcome ? 'pointer-events-none opacity-50' : ''}`}>
            <AnimatedAIChat onSend={handleSend} />
          </div>

        </div>
      </div>

      {/* Score screen overlay */}
      {(() => {
        const showScoreScreen = !!scoreResult
        if (conversationOutcome && !showScoreScreen) {
          console.error('[SCORE] Outcome set but ScoreScreen not showing:', conversationOutcome, '— scoreResult:', scoreResult)
        }
        return showScoreScreen ? (
          <ScoreScreen
            scoreResult={scoreResult!}
            outcome={conversationOutcome!}
            personaName={persona.name}
            onTryAgain={handleTryAgain}
            onSwitchClient={onBack}
          />
        ) : null
      })()}
    </div>
  )
}
