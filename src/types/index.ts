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
  followers: string
  following: string
  description: string
  systemPrompt: string
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

export interface ScoreResult {
  score: number
  pass: boolean
  strengths: string[]
  improvements: { message: number; issue: string }[]
  summary: string
}
