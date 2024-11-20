<template>
  <div
    ref="citation"
    class="inline-block w-max cursor-pointer px-1"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave">
    <div
      class="px-1 py-0 h-max rounded min-w-4 h-4 text-xs font-medium text-neutral-700 bg-neutral-200/70 flex items-center justify-center">
      {{ idx }}
    </div>
    <div
      v-if="showCitations"
      class="absolute bg-white rounded-lg p-4 shadow-lg max-w-full max-h-[10rem] overflow-auto space-y-3 text-xs transition-opacity duration-300"
      :class="[isHiding ? 'opacity-0' : 'opacity-100']"
      :style="boxPosition">
      <div>
        {{ evidence.citation }}
        Page{{ evidence.pages.length > 1 ? 's' : '' }} {{ evidence.pages[0]
        }}{{
          evidence.pages.length > 1
            ? `-${evidence.pages[evidence.pages.length - 1]}`
            : ''
        }}
      </div>
      <div v-if="evidence.quote" class="space-y-4">
        <div class="border-l-4 border-neutral-500 pl-4 italic">
          {{ evidence.quote }}
        </div>
        <div
          class="flex w-full cursor-pointer underline"
          @click="store.goToEvidence(props.evidenceId)">
          Find in text
        </div>
      </div>
      <div
        v-else
        class="cursor-pointer underline"
        @click="store.goToEvidence(props.evidenceId)">
        Go to section
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useStore } from '@/utils/store'
import { computed, ref, watch } from 'vue'

const props = defineProps({
  evidenceId: {
    type: String,
    default: '',
  },
})

const store = useStore()

const idx = computed(() => {
  return Object.keys(store.evidenceCache).indexOf(props.evidenceId) + 1
})

const evidence = computed(() => {
  return store.evidenceCache[props.evidenceId]
})

const showCitations = ref(false)
const isHiding = ref<null | number>(null)
async function handleMouseEnter() {
  if (isHiding.value) clearTimeout(isHiding.value)
  isHiding.value = null
  showCitations.value = true
}
function handleMouseLeave() {
  isHiding.value = window.setTimeout(() => (showCitations.value = false), 300)
}

const citation = ref<null | HTMLDivElement>(null)
const boxPosition = ref({})
function setBoxPosition() {
  if (citation.value) {
    boxPosition.value = {
      width: `${(citation.value.parentElement as HTMLElement).getBoundingClientRect().width}px`,
      left: `${(citation.value.parentElement as HTMLElement).getBoundingClientRect().left}px`,
      top: `${citation.value.getBoundingClientRect().bottom}px`,
    }
  }
}

watch(showCitations, (show) => {
  if (show) {
    setBoxPosition()
  }
})
</script>
