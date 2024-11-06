export interface Quote {
  quote: string
  point: string
}

export interface Reference {
  id: string
  value: string
  filepath: string
  pages: number[]
  quotes: Quote[]
}

export interface APIResponse {
  question: string
  text: string
  references: Reference[]
}

export interface ConversationStep {
  id: string
  role: 'user' | 'agent'
  value: string | APIResponse
}
