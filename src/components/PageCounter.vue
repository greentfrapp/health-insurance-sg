<template>
  <div class="relative" ref="menu">
    <div
      class="text-xs px-3 py-1 bg-white rounded-full shadow cursor-pointer"
      @click="showMenu = !showMenu">
      Page {{ props.currentPage }} / {{ props.numPages }}
    </div>
    <div
      v-if="showMenu"
      class="absolute bg-white shadow rounded-md top-full right-0 p-1 translate-y-1 border w-10 text-sm z-10 max-h-40 overflow-auto">
      <button
        v-for="page in props.numPages"
        class="w-full px-2 py-0.5 text-left hover:bg-neutral-100 rounded flex items-center gap-2"
        @click.capture="
          emit('goToPage', page)
          showMenu = false
        ">
        {{ page }}
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { handleMenuClick } from '@/utils/handleMenuClick'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  numPages: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['goToPage'])

const showMenu = ref(false)

const menu = ref<null | HTMLDivElement>(null)
onMounted(() => {
  document.addEventListener('click', (e) =>
    handleMenuClick(e, menu.value, showMenu),
  )
})
onUnmounted(() => {
  document.removeEventListener('click', (e) =>
    handleMenuClick(e, menu.value, showMenu),
  )
})
</script>
