import { defineStore } from 'pinia'
import { APIResponse, ConversationStep } from './types'
import { initAPI, statusAPI } from './api'

export const useStore = defineStore(
  'store', {
    state: () => ({
      connectingToServer: false,
      serverIsAlive: false,
      serverHistoryLength: 0,
      history: [] as ConversationStep[],
      activeResponse: null as null|APIResponse,
      stepIdx: null as null|number,
      evidenceIdx: null as null|number,
      quoteIdx: null as null|number,
      evidenceCache: {} as any,
      goToDoc: null as null|string,
      goToPage: null as null|number,
    }),
    getters: {
      lastDocumentKey(state) {
        const keys = Object.keys(state.evidenceCache)
        if (!keys.length) return
        return keys[keys.length-1]
      },
      lastDocument(state): any {
        if (this.lastDocumentKey) return state.evidenceCache[this.lastDocumentKey]
      },
    },
    actions: {
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
        initAPI()
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
            if (!status.ok) {
              this.serverHistoryLength = 0
            } else {
              const statusJSON = await status.json()
              this.serverHistoryLength = statusJSON["history_length"]
            }
          } catch {
            this.serverIsAlive = false
            this.serverHistoryLength = 0
          }
          if (this.serverIsAlive) break
          await new Promise(r => setTimeout(r, 1000))
        }
        this.connectingToServer = false
      }
    },
  }
)
