import { APIResponse } from './types'

const API_URL = 'http://localhost:8000'

export async function statusAPI() {
  return await fetch(API_URL + '/status')
}

export async function initAPI() {
  const response = await fetch(API_URL + '/init')
  return response.ok
}

export async function queryAPI(query='What am I covered for if I am warded in the hospital?') {
  const body = JSON.stringify({
    query,
  })
  const response = await fetch(API_URL + '/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  })
  const responseJson = await response.json()
  if (!response.ok) {
    throw 'API failed'
  }
  responseJson.url = 'Final IncomeShield policy conditions 1 Sep 2024.pdf'
  return responseJson as APIResponse
}

export async function streamAPI(query='What am I covered for if I am warded in the hospital?') {
  const body = JSON.stringify({
    query,
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
