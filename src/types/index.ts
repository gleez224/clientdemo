export type Tab = 'causes' | 'framework' | 'demo'

export type MessageRole = 'user' | 'assistant'

export interface Message {
  role: MessageRole
  content: string
}

export interface Persona {
  id: string
  name: string
  archetype: string
  followers: number
  following: number
  description: string
  systemPrompt: string
  image: string
}

export interface AppState {
  appEntered: boolean
  activeTab: Tab
}

export interface BusinessContext {
  whatYouSell: string
  targetClient: string
  pitch: string
  pricing: string
}

export interface Improvement {
  messageIndex: number
  whatYouSaid: string
  whyItFailed: string
  whatToSayInstead: string
}

export interface ScoreResult {
  score: number
  pass: boolean
  strengths: string[]
  improvements: Improvement[]
  closingSuggestion?: string | null
  summary: string
}
