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

export interface Evidence {
  id: string
  citation: string
  filepath: string
  pages: number[]
  quote?: string
}

export interface APIResponse {
  question: string
  text: string
  references: Evidence[]
}

export interface ChatMessage {
  // id: string
  role: 'user' | 'assistant'
  content: string
  formattedContent: string | APIResponse
  hidden?: boolean
}
