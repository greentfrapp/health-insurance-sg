<template>
  <div class="relative" ref="settingsMenu">
    <button class="bg-neutral-800 text-neutral-50 w-8 h-8 flex items-center justify-center rounded-md"
      @click="showMenu = !showMenu">
      <Cog6ToothIcon class="w-4 h-4" />
    </button>
    <div v-if="showMenu" class="absolute bg-white shadow rounded-md bottom-full right-0 p-1 -translate-y-1 border space-y-1 w-32">
      <button v-for="feature in features" class="w-full px-2 py-1 text-left hover:bg-neutral-100 rounded flex items-center gap-2"
        @click.capture="feature.action">
        <component :is="feature.icon" class="w-3 h-3" />
        {{ feature.label }}
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
// Support export and loading of convos
// Loading need to also load on server-side
// Support reset convo
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ArrowUpTrayIcon,
  Cog6ToothIcon,
} from '@heroicons/vue/20/solid'
import { onMounted, ref } from 'vue'
import { useStore } from '@/utils/store'

const showMenu = ref(false)

const store = useStore()

const features = [
  {
    label: 'Export',
    action: () => { store.exportHistory(); showMenu.value = false },
    icon: ArrowDownTrayIcon,
  },
  {
    label: 'Load',
    action: () => { store.loadHistory(); showMenu.value = false },
    icon: ArrowUpTrayIcon,
  },
  {
    label: 'Reset',
    action: () => { store.resetHistory(); showMenu.value = false },
    icon: ArrowPathIcon,
  }
]

const settingsMenu = ref<null|HTMLDivElement>(null)
onMounted(() => {
  document.addEventListener('click', e => {
    if (!settingsMenu.value) return
    const target = e.target as HTMLElement
    if (!settingsMenu.value.contains(target)) showMenu.value = false 
  })
})
</script>