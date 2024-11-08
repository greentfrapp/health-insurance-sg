<template>
  <div class="flex p-10 max-h-screen justify-center w-screen">
    <div class="flex w-full gap-4 max-w-full" :style="{width: '1280px'}">
      <div class="shrink-0 flex flex-col w-[65ch] space-y-4">
        <div class="history-container shrink grow space-y-4 overflow-auto px-2" ref="historyContainer">
          <div v-for="step in store.history">
            <div v-if="step.role === 'user'"
              class="flex justify-end">
              <div class="bg-neutral-700 text-white w-[90%] px-4 py-2 rounded-md">
                {{ step.value }}
              </div>
            </div>
            <div v-else>
              <div class="px-4 py-2">
                <component v-if="step.value" :is="parseResponse(step.id)"
                class="max-w-prose space-y-1"></component>
              </div>
            </div>
          </div>
          <div v-if="streamingResponse"
            class="border rounded-lg text-sm px-4 py-2 text-neutral-700 bg-neutral-100">
            {{ streamingResponse }}
          </div>
        </div>
        <div class="flex border-2 border-neutral-300 p-1 rounded-lg relative">
          <div class="flex w-full" :class="[store.serverIsAlive ? '' : 'invisible']">
            <input type="text" v-model="query"
              ref="inputBox"
              class="grow px-2 py-1"
              placeholder="Press '/' to start typing"
              @keyup.enter="submitQuery" />
            <div class="flex gap-1">
              <button @click="submitQuery"
                :disabled="!query.length || loading"
                class="px-4 py-1 rounded-md bg-neutral-800 text-neutral-50 disabled:bg-neutral-100 disabled:text-neutral-300">
                {{ loading ? 'Loading' : 'Submit' }}
              </button>
              <SettingsMenu />
            </div>
          </div>
          <div v-if="!store.serverIsAlive" @click="store.pingStatus"
            class="w-full h-full absolute top-0 left-0 flex items-center px-4 gap-2 cursor-pointer">
            <ArrowPathIcon v-if="store.connectingToServer" class="w-4 h-4 animate-spin" />
            <ExclamationCircleIcon v-else class="w-4 h-4 text-red-500" />
            {{ store.connectingToServer ? 'Connecting...' : store.serverIsAlive ? 'Connected' : 'Server not found, click to retry' }}
          </div>
        </div>
      </div>
      <PDFContainer :urls="documents" class="grow shrink" />
    </div>
  </div>
</template>
<style scoped>
.history-container {
  scroll-behavior: smooth;
}
</style>
<script setup lang="ts">
import { streamAPI } from '@/utils/api'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { parseResponse } from '@/utils/utils'
import { APIResponse } from '@/utils/types'
import { useStore } from '@/utils/store'
import PDFContainer from './PDFContainer.vue'
import { v4 as uuidv4 } from 'uuid'
import SettingsMenu from './SettingsMenu.vue'
import { ArrowPathIcon, ExclamationCircleIcon } from '@heroicons/vue/20/solid'

const store = useStore()

const documents = ref(['Enhanced IncomeShield Brochure.pdf'])
const query = ref('')
const loading = ref(false)

const streamingResponse = ref('')
const finalResponse = ref<null|APIResponse>(null)
const historyContainer = ref<null|HTMLDivElement>(null)
async function submitQuery() {
  const queryStr = query.value
  query.value = ''
  store.history.push({
    id: uuidv4(),
    role: 'user',
    value: queryStr,
  })
  loading.value = true
  const stream = await streamAPI(queryStr)
  while (true) {
    const result = await stream.read()
    if (result?.done) break
    const value = new TextDecoder("utf-8").decode(result?.value)
    const newValue = streamingResponse.value + value
    const parsedResponse = parseStreamResponse(newValue)
    if (typeof parsedResponse === 'string') {
      streamingResponse.value = parsedResponse
      finalResponse.value = null
      store.activeResponse = null
    } else {
      // finalResponse.value = parsedResponse
      store.activeResponse = parsedResponse
      store.history.push({
        id: uuidv4(),
        role: 'agent',
        value: parsedResponse,
      })
      documents.value = parsedResponse.references.map(r => r.filepath).filter((v, i, arr) => arr.indexOf(v) === i)
      streamingResponse.value = ''
    }
    await nextTick()
    if (historyContainer.value) {
      historyContainer.value.scrollTop = historyContainer.value.scrollHeight
      // historyContainer.value.scrollTo({
      //   top: historyContainer.value.clientHeight,
      //   behavior: 'smooth'
      // })
    }
  }
  loading.value = false
}

function parseStreamResponse(stream: string) {
  const patterns = [
    'Answer:',
    'Action Desc:',
    'Action Output:',
    'Final Response:',
    'Thought:',
  ]
  for (let i=0; i<patterns.length; i++) {
    const pattern = patterns[i]
    const rgx = new RegExp(pattern)
    const result = stream.search(rgx)
    if (result >= 0) {
      if (pattern === 'Final Response:') {
        return JSON.parse(stream.slice(result + pattern.length)) as APIResponse
      } else {
        return stream.slice(result + pattern.length)
      }
    }
  }
  return stream
}

const inputBox = ref<null|HTMLInputElement>(null)
function handleSlash(e: KeyboardEvent) {
  if (e.key === '/' && inputBox.value) {
    if (document.activeElement !== inputBox.value) {
      e.preventDefault()
      inputBox.value.focus()
    }
  }
}

onMounted(() => {
  document.addEventListener('keypress', handleSlash)
})

onUnmounted(() => {
  document.removeEventListener('keypress', handleSlash)
})
</script>
