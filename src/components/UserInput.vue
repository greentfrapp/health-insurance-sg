<template>
  <div class="space-y-2 p-1">
    <div
      class="bg-white flex border-2 border-neutral-300 p-1 rounded-lg relative">
      <div
        class="flex flex-col w-full items-end gap-1"
        :class="[
          store.serverIsAlive && store.serverIsCompatible ? '' : 'invisible',
        ]">
        <textarea
          resizable="false"
          type="text"
          v-model="query"
          ref="inputBox"
          class="w-full inline-block px-2 py-1 max-h-[200px] overflow-auto"
          rows="1"
          placeholder="Press '/' to start typing"
          @keyup.enter="submitQuery"></textarea>
        <div class="flex gap-1">
          <button
            @click="submitQuery"
            :disabled="!query.length || store.streamingResponse"
            class="px-4 py-1 rounded-md bg-neutral-800 text-neutral-50 disabled:bg-neutral-100 disabled:text-neutral-300">
            {{ store.streamingResponse ? 'Loading' : 'Submit' }}
          </button>
          <!-- <SettingsMenu /> -->
        </div>
      </div>
      <div
        v-if="!store.serverIsAlive || !store.serverIsCompatible"
        @click="store.pingStatus"
        class="w-full h-full absolute top-0 left-0 flex items-center justify-center px-4 gap-2 cursor-pointer">
        <ArrowPathIcon
          v-if="store.connectingToServer"
          class="w-4 h-4 animate-spin" />
        <ExclamationCircleIcon v-else class="w-4 h-4 text-red-500" />
        {{ store.connectingToServer ? 'Connecting...' : statusMessage }}
      </div>
    </div>
    <Disclaimer />
  </div>
</template>
<style scoped>
textarea {
  resize: none;
}
</style>
<script setup lang="ts">
import { ArrowPathIcon, ExclamationCircleIcon } from '@heroicons/vue/20/solid'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import Disclaimer from './Disclaimer.vue'
// import SettingsMenu from '@/components/SettingsMenu.vue'
import { useStore } from '@/utils/store'

const store = useStore()

const query = ref('')

async function submitQuery() {
  store.submitQuery(query.value)
  query.value = ''
}

const inputBox = ref<null | HTMLInputElement>(null)
function handleSlash(e: KeyboardEvent) {
  if (e.key === '/' && inputBox.value) {
    if (document.activeElement !== inputBox.value) {
      e.preventDefault()
      inputBox.value.focus()
    }
  }
}

function resize() {
  if (!inputBox.value) return
  inputBox.value.style.height = 'auto'
  inputBox.value.style.height = `${inputBox.value.scrollHeight}px`
}

onMounted(() => {
  document.addEventListener('keypress', handleSlash)
  if (inputBox.value) inputBox.value.addEventListener('input', resize)
})

onUnmounted(() => {
  document.removeEventListener('keypress', handleSlash)
})

const statusMessage = computed(() => {
  if (store.serverIsAlive && store.serverIsCompatible) return 'Connected'
  else if (store.serverIsAlive)
    return `Server v${store.serverVersion} is not compatible with client v${store.version}`
  else return 'Server not found, click to retry'
})
</script>
