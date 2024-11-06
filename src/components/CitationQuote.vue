<template>
  <div v-if="activeResponse" ref="citation" class="inline-block w-max cursor-pointer px-1"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave">
    <div class="px-1 py-0 h-max rounded w-4 h-4 text-xs font-medium text-neutral-700 bg-neutral-200/70 flex items-center justify-center">
      {{ props.evidenceIdx }}
    </div>
    <div v-if="showCitations"
      class="absolute bg-white rounded-lg p-4 shadow-lg max-w-full max-h-[10rem] overflow-auto space-y-3 text-xs transition-opacity duration-300"
      :class="[ isHiding ? 'opacity-0' : 'opacity-100' ]"
      :style="boxPosition">
      <div>
        {{ activeResponse.references[evidenceIdx].value }}
        Page{{ activeResponse.references[evidenceIdx].pages.length > 1 ? 's' : '' }} {{ activeResponse.references[evidenceIdx].pages[0] }}{{ activeResponse.references[evidenceIdx].pages.length > 1 ? `-${activeResponse.references[evidenceIdx].pages[activeResponse.references[evidenceIdx].pages.length-1]}` : '' }}
      </div>
      <div v-if="quoteIdx.length" class="space-y-4">
        <div v-for="i in quoteIdx" class="space-y-2">
          <div class="border-l-4 border-neutral-500 pl-4 italic">
            {{ activeResponse.references[evidenceIdx].quotes[i].quote }}
          </div>
          <div class="flex w-full cursor-pointer underline" 
            @click="findQuote(stepIdx, evidenceIdx, quoteIdx)">
            Find in text
          </div>
        </div>
      </div>
      <div v-else class="cursor-pointer underline"
        @click="goToPage(evidenceIdx)">
        Go to section
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useStore } from '@/utils/store'
import { APIResponse } from '@/utils/types'
import { computed, ref, watch } from 'vue'

const props = defineProps({
  stepIdx: {
    type: String,
    default: "0",
  },
  evidenceIdx: {
    type: String,
    default: "1",
  },
  quoteIdx: {
    type: String,
    default: "",
  },
})

const store = useStore()

const stepIdx = computed(() => {
  return parseInt(props.stepIdx)
})
const evidenceIdx = computed(() => {
  return parseInt(props.evidenceIdx) - 1
})
const quoteIdx = computed(() => {
  if (!props.quoteIdx) return null
  else return JSON.parse(props.quoteIdx)
})
const activeResponse = computed(() => {
  if (store.history.length > stepIdx.value) return store.history[stepIdx.value].value as APIResponse
})

function findQuote(stepIdx: number, evidenceIdx: number, quoteIdx: number) {
  store.stepIdx = stepIdx
  store.evidenceIdx = evidenceIdx
  store.quoteIdx = quoteIdx
}

function goToPage(evidenceIdx: number) {
  if (!activeResponse.value) return
  store.goToDoc = activeResponse.value.references[evidenceIdx].filepath
  store.goToPage = activeResponse.value.references[evidenceIdx].pages[0]
  store.stepIdx = null
  store.evidenceIdx = null
  store.quoteIdx = null
}

const showCitations = ref(false)
const isHiding = ref<null|number>(null)
async function handleMouseEnter() {
  if (isHiding.value) clearTimeout(isHiding.value)
  isHiding.value = null
  showCitations.value = true
}
function handleMouseLeave() {
  isHiding.value = window.setTimeout(() => showCitations.value = false, 300)
}

const citation = ref<null|HTMLDivElement>(null)
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

watch(showCitations, show => {
  if (show) {
    setBoxPosition()
  }
})
</script>
