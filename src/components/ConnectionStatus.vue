<template>
  <div class="absolute top-2 right-2 bg-white px-2 py-1 border shadow rounded text-sm flex items-center justify-center gap-2 text-neutral-600 cursor-pointer"
    @click="store.pingStatus">
    <ArrowPathIcon v-if="store.connectingToServer" class="w-4 h-4 animate-spin" />
    <div v-else class="w-2 h-2 rounded-full"
      :style="{ background: statusColor }"></div>
    {{ statusMessage }}
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useStore } from '@/utils/store'
import { ArrowPathIcon } from '@heroicons/vue/20/solid'

const store = useStore()

const statusColor = computed(() => {
  if (store.serverIsAlive && store.serverIsCompatible) return '#22c55e'
  else if (store.serverIsAlive) return '#eab308'
  else return '#ef4444'
})

const statusMessage = computed(() => {
  if (store.serverIsAlive && store.serverIsCompatible) return 'Connected'
  else if (store.serverIsAlive) return `Switch server to version ${store.version}`
  else return 'Server not found, click to retry'
})

let interval: number|null = null
onMounted(() => {
  store.pingStatus()
  interval = window.setInterval(store.pingStatus, 60000)
})
onUnmounted(() =>{ 
  if (interval) clearInterval(interval)
})
</script>