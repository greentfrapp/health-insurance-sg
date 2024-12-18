import { ChatMessage } from './types'

const API_URL = 'https://insurance.pebblely.com'

export async function statusAPI() {
  return await fetch(API_URL + '/status')
}

export async function streamAPI(
  query = 'What am I covered for if I am warded in the hospital?',
  history: ChatMessage[] = [],
  current_policy: string | null = null,
  document_ids: string[] = [],
) {
  const body = JSON.stringify({
    query,
    history,
    current_policy,
    document_ids,
  })
  const response = await fetch(API_URL + '/stream_query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  })
  const reader = response.body?.getReader()
  return reader as ReadableStreamDefaultReader<Uint8Array>
}
