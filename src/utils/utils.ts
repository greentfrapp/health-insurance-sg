import { shallowRef } from 'vue'
import showdown from 'showdown'
import CitationQuote from '@/components/CitationQuote.vue'
import { APIResponse } from './types'
import { useStore } from './store'

export function parseResponse(stepId: string) {
  const store = useStore()
  const stepIdx = store.history.findIndex(s => s.id === stepId)
  if (stepIdx < 0) return null
  const response = store.history[stepIdx].value as APIResponse
  const converter = new showdown.Converter()
  // let parsed = response.text
  let parsed = converter.makeHtml(response.text.replaceAll('\n', '\n\n'))
  parsed = parsed.replaceAll("<p>", "<p class=\"mb-2\">")
  const reCite = new RegExp('<cite>(.*?)</cite>', 'g')
  const reDoc = new RegExp('<doc>(.*?)</doc>', 'g')
  const reQuote = new RegExp('<quote>quote(.*?)</quote>', 'g')
  parsed = parsed.replace(reCite, (_: string, citation: string) => {
    const docComponents = [...citation.matchAll(reDoc)].map(match => {
      const citationString = match[1].replace(reQuote, '')
      const quotes = [...match[1].matchAll(reQuote)].map(q => parseInt(q[1]) - 1)
      const refIndex = response.references.findIndex((r: any) => citationString.startsWith(r.id))
      return `<component v-bind:is="CitationQuote" stepIdx="${stepIdx}" evidenceIdx="${refIndex + 1}" quoteIdx="${JSON.stringify(quotes)}" />`
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
    components: {}
  }
}
