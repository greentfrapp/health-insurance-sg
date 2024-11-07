<template>
  <div class="absolute top-2 right-2 bg-white px-2 py-1 border shadow rounded text-sm flex items-center justify-center gap-2 text-neutral-600 cursor-pointer"
    @click="store.pingStatus">
    <ArrowPathIcon v-if="store.connectingToServer" class="w-4 h-4 animate-spin" />
    <div v-else class="w-2 h-2 rounded-full"
      :class="[ store.serverIsAlive ? 'bg-green-500' : 'bg-red-500' ]"></div>
    {{ store.connectingToServer ? 'Connecting...' : store.serverIsAlive ? 'Connected' : 'Server not found, click to retry' }}
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useStore } from '@/utils/store'
import { ArrowPathIcon } from '@heroicons/vue/20/solid'

const store = useStore()

let interval: number|null = null
onMounted(() => {
  store.pingStatus()
  interval = window.setInterval(store.pingStatus, 60000)
})
onUnmounted(() =>{ 
  if (interval) clearInterval(interval)
})
</script>