import { shallowRef } from 'vue'
import showdown from 'showdown'
import CitationQuote from '@/components/CitationQuote.vue'
import { APIResponse, ChatMessage } from './types'

export function parseResponse(response: APIResponse) {
  const converter = new showdown.Converter({ tables: true })
  // let parsed = response.text
  let parsed = converter.makeHtml(
    response.text.replaceAll('\n', '\n\n').replaceAll('|\n\n', '|\n'),
  )
  parsed = parsed.replaceAll('<p>', '<p class="mb-2">')
  const reCite = new RegExp('<cite>(.*?)</cite>', 'g')
  const reDoc = new RegExp('<doc>(.*?)</doc>', 'g')
  // const reQuote = new RegExp('<quote>quote(.*?)</quote>', 'g')
  parsed = parsed.replace(reCite, (_: string, citation: string) => {
    const docComponents = [...citation.matchAll(reDoc)].map((match) => {
      // const citationString = match[1].replace(reQuote, '')
      return `<component v-bind:is="CitationQuote" evidenceId="${match[1]}" />`
    })
    return docComponents.join('')
  })
  return {
    template: `<div>${parsed}</div>`,
    data() {
      return {
        CitationQuote: shallowRef(CitationQuote),
      }
    },
    components: {},
  }
}

export function parseStreamResponse(stream: string) {
  const patterns = [
    'Final Response:',
    'Answer:',
    'Action Desc:',
    'Action Output:',
    'Thought:',
  ]
  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i]
    const rgx = new RegExp(pattern)
    const result = stream.search(rgx)
    if (result >= 0) {
      if (pattern === 'Final Response:') {
        const output = JSON.parse(stream.slice(result + pattern.length))
        return output as ChatMessage[]
        // return output.final_response as APIResponse
      } else {
        return stream.slice(result + pattern.length)
      }
    }
  }
  return stream
}
