<template>
  <div class="bg-white flex border-2 border-neutral-300 p-1 rounded-lg relative">
    <div class="flex w-full" :class="[store.serverIsAlive && store.serverIsCompatible ? '' : 'invisible']">
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
    <div v-if="!store.serverIsAlive || !store.serverIsCompatible" @click="store.pingStatus"
      class="w-full h-full absolute top-0 left-0 flex items-center px-4 gap-2 cursor-pointer">
      <ArrowPathIcon v-if="store.connectingToServer" class="w-4 h-4 animate-spin" />
      <ExclamationCircleIcon v-else class="w-4 h-4 text-red-500" />
      {{ store.connectingToServer ? 'Connecting...' : statusMessage }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useStore } from '@/utils/store'
import { ArrowPathIcon, ExclamationCircleIcon } from '@heroicons/vue/20/solid'
import SettingsMenu from './SettingsMenu.vue'

const store = useStore()

const query = ref('')
const loading = ref(false)

async function submitQuery() {
  loading.value = true
  store.submitQuery(query.value)
  query.value = ''
  loading.value = false
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

const statusMessage = computed(() => {
  if (store.serverIsAlive && store.serverIsCompatible) return 'Connected'
  else if (store.serverIsAlive) return `Server v${store.serverVersion} is not compatible with client v${store.version}`
  else return 'Server not found, click to retry'
})
</script>
