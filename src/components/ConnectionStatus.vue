<template>
  <div class="absolute top-2 right-2 bg-white px-2 py-1 border shadow rounded text-sm flex items-center justify-center gap-2 text-neutral-600 cursor-pointer"
    @click="pingStatus">
    <ArrowPathIcon v-if="connecting" class="w-4 h-4 animate-spin" />
    <div v-else class="w-2 h-2 rounded-full"
      :class="[ store.serverIsAlive ? 'bg-green-500' : 'bg-red-500' ]"></div>
    {{ connecting ? 'Connecting...' : store.serverIsAlive ? 'Connected' : 'Server not found, click to retry' }}
  </div>
</template>
<script setup lang="ts">
import { statusAPI } from '@/utils/api'
import { onMounted, ref } from 'vue'
import { useStore } from '@/utils/store'
import { ArrowPathIcon } from '@heroicons/vue/20/solid'

const store = useStore()

const connecting = ref(false)
async function pingStatus() {
  if (store.serverIsAlive) return
  connecting.value = true
  const tries = 3
  for (let i=0; i<tries; i++) {
    try {
      const status = await statusAPI()
      store.serverIsAlive = status.ok
      if (!status.ok) {
        store.serverHistoryLength = 0
      } else {
        const statusJSON = await status.json()
        store.serverHistoryLength = statusJSON["history_length"]
      }
    } catch {
      store.serverIsAlive = false
      store.serverHistoryLength = 0
    }
    if (store.serverIsAlive) break
    await new Promise(r => setTimeout(r, 1000))
  }
  connecting.value = false
}

onMounted(pingStatus)
</script>