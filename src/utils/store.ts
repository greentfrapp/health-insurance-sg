import { defineStore } from 'pinia'
import { APIResponse, ChatMessage, Evidence } from './types'
import { statusAPI, streamAPI } from './api'
import { v4 as uuidv4 } from 'uuid'
import { parseStreamResponse } from './utils'
import { usePDF } from '@tato30/vue-pdf'

export const useStore = defineStore(
  'store', {
    state: () => ({
      version: '0.0.2',
      connectingToServer: false,
      serverIsAlive: false,
      serverVersion: '',
      history: [] as ChatMessage[],
      streamBuffer: '',
      documentCache: {} as {[k: string]: any},
      evidenceCache: {} as {[k: string]: Evidence},
      selectedEvidenceId: null as null | string,
      evidenceKey: null as null | string, // A random key for resetting evidence state
    }),
    getters: {
      activeDocument(state): any {
        if (this.selectedEvidence) {
          return state.documentCache[this.selectedEvidence.filepath]
        }
        const docs = Object.values(state.documentCache)
        if (!docs.length) return null
        return docs[0]
      },
      selectedEvidence(state) {
        if (state.selectedEvidenceId === null) return null
        return state.evidenceCache[state.selectedEvidenceId]
      },
      serverIsCompatible(state) {
        return state.version === state.serverVersion
      },
    },
    actions: {
      init() {
        this.addDocument('./Enhanced IncomeShield Brochure.pdf')
      },
      exportHistory() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.history))
        const el = document.createElement('a')
        el.setAttribute('href', dataStr)
        el.setAttribute('download', 'test.json')
        el.click()
      },
      loadHistory() {
        const el = document.createElement('input')
        el.setAttribute('type', 'file')
        el.setAttribute('accept', 'application/JSON')
        el.onchange = async (e: Event) => {
          const target = e.target as HTMLInputElement
          if (target.files && target.files.length > 0) {
            const file = target.files[0]
            const reader = new FileReader()
            reader.onload = async (e) => {
              this.history = JSON.parse(e.target?.result as string)
            }
            reader.readAsText(file)
          }
        }
        el.click()
      },
      resetHistory() {
        this.history = []
      },
      async pingStatus() {
        if (this.serverIsAlive) return
        this.connectingToServer = true
        const tries = 3
        for (let i=0; i<tries; i++) {
          try {
            const status = await statusAPI()
            this.serverIsAlive = status.ok
            const response = await status.json()
            this.serverVersion = response.version
          } catch {
            this.serverIsAlive = false
          }
          if (this.serverIsAlive) break
          await new Promise(r => setTimeout(r, 1000))
        }
        this.connectingToServer = false
      },
      addDocument(url: string) {
        if (url in this.documentCache) return
        const pdfLoader = usePDF(url)
        this.documentCache[url] = pdfLoader
        console.log(`Loaded ${url}`)
      },
      addUserResponse(response: string) {
        this.history.push({
          role: 'user',
          content: response,
          formattedContent: response,
        })
      },
      addAgentResponse(response: string, formattedResponse: APIResponse) {
        formattedResponse.references.forEach(r => {
          // TODO: Check for conflicting r.id
          this.evidenceCache[r.id] = r
        })
        this.history.push({
          role: 'assistant',
          content: response,
          formattedContent: formattedResponse,
        })
      },
      async submitQuery(query: string) {
        this.addUserResponse(query)
        const stream = await streamAPI(query, this.history)
        while (true) {
          const result = await stream.read()
          if (!result) throw 'API Error'
          if (result.done) break
          const value = new TextDecoder("utf-8").decode(result?.value)
          const newValue = this.streamBuffer + value
          const parsedResponse = parseStreamResponse(newValue)
          if (typeof parsedResponse === 'string') {
            this.streamBuffer = parsedResponse
          } else {
            parsedResponse.forEach(m => {
              this.history.push(m)
            })
            this.streamBuffer = ''
            // Load PDFs
            const finalFormattedResponse = parsedResponse[parsedResponse.length-1].formattedContent as APIResponse
            finalFormattedResponse.references
              .map(r => r.filepath)
              .filter((v, i, arr) => arr.indexOf(v) === i)
              .forEach(this.addDocument)
            finalFormattedResponse.references.forEach(r => {
              // TODO: Check for conflicting r.id
              this.evidenceCache[r.id] = r
            })
          }
        }
      },
      goToEvidence(evidenceId: string) {
        this.selectedEvidenceId = evidenceId
        this.evidenceKey = uuidv4()
      }
    },
  }
)
