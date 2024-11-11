<template>
  <div class="relative flex flex-col">
    <div class="flex flex-col items-center py-2">
      <div class="text-xs px-3 py-1 bg-neutral-100 rounded-full">
        Page {{ currentPage }} / {{ numPages }}
      </div>
    </div>
    <div ref="container"
      class="pdf-container grow shrink overflow-auto shadow-lg"
      v-if="store.activeDocument">
      <div v-for="page in store.activeDocument.pages"
        :id="`page${page}`" class="pageContainer">
        <VuePDF ref="vuePDF"
          :pdf="store.activeDocument.pdf"
          text-layer
          :highlight-text="store.selectedEvidence && store.selectedEvidence.pages.includes(page) ? innerQuote : ''"
          :highlight-options="{
            completeWords: false,
            ignoreCase: true,
          }"
          fit-parent
          @highlight="onHighlight"
          :page="page" />
      </div>
    </div>
    <div v-if="searching" class="absolute top-0 left-0 w-full h-full bg-white/80 flex items-center justify-center">
      {{ movingToBookmark ? 'Quote not found, moving to nearest page instead...' : 'Searching...' }}
    </div>
    <!-- <div v-if="movingToPage" class="absolute top-0 left-0 w-full h-full bg-white/80 flex items-center justify-center">
      Moving to page {{ store.goToPage }}
    </div> -->
  </div>
</template>
<style scoped>
.pdf-container {
  scroll-behavior: smooth;
}
</style>
<script setup lang="ts">
import { useStore } from '@/utils/store'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { VuePDF, HighlightEventPayload } from '@tato30/vue-pdf'
import '@tato30/vue-pdf/style.css'
import { usePageCounter } from '@/utils/pageCounter'

const store = useStore()

const innerQuote = ref('')
const container = ref<null|HTMLDivElement>(null)
let scrollTop = 0

function scrollToEvidence() {
  if (!container.value) return
  container.value.scrollTop = scrollTop
}

function scrollToPage(page: number) {
  if (!container.value) return
  const bookmarkEl = document.getElementById(`page${page}`) as HTMLDivElement
  const bookmarkRect = bookmarkEl.getBoundingClientRect()
  scrollTop = Math.max(
    0,
    Math.min(
      container.value.scrollTop + bookmarkRect.top - padding,
    )
  )
  scrollToEvidence()
}

let foundQuote = false
const padding = 200
let searchingPages = ref([] as number[])
const movingToBookmark = ref(false)
const searching = computed(() => {
  return !!searchingPages.value.length || movingToBookmark.value
})
watch(() => store.evidenceKey, async () => {
  if (store.selectedEvidenceId === null) return
  // Reset highlights
  innerQuote.value = ''
  await nextTick()
  // Search new quote or section
  if (!store.selectedEvidence) return
  if (!container.value) return
  // Reset scrollTop
  scrollTop = container.value.scrollHeight
  const pages = store.selectedEvidence.pages
  if (store.selectedEvidence.quote) {
    // Trigger search and highlight
    searchingPages.value = pages
    innerQuote.value = store.selectedEvidence.quote
    foundQuote = false
  } else {
    // Scroll to nearest page
    scrollToPage(Math.min(...pages))
  }
})

function onHighlight(payload: HighlightEventPayload) {
  if (!container.value) return
  searchingPages.value = searchingPages.value.filter(p => p !== payload.page)
  if (payload.matches && payload.matches[0]) {
    foundQuote = true
    const match = payload.matches[0]
    const startDiv = payload.textDivs[match.start.idx] as HTMLDivElement
    const startRect = startDiv.children[0].getBoundingClientRect()
    const endDiv = payload.textDivs[match.end.idx] as HTMLDivElement
    const endRect = endDiv.children[0].getBoundingClientRect()
    const newMaxY = Math.max(
      0,
      Math.min(
        container.value.scrollTop + startRect.top - padding,
        container.value.scrollTop + endRect.top - padding,
      )
    )
    if (scrollTop > newMaxY) {
      scrollTop = newMaxY
    }
  }
  // If no more pages to search, start scrolling
  if (!searchingPages.value.length) {
    if (foundQuote) {
      scrollToEvidence()
    } else {
      // Quote not found, moving to nearest page instead
      movingToBookmark.value = true
      setTimeout(() => {
        movingToBookmark.value = false
        if (!store.selectedEvidence) return
        scrollToPage(Math.min(...store.selectedEvidence.pages))
      }, 1000)
    }
  }
}

// Logic for counting page number
const currentPage = ref(0)
let pageContainers: HTMLCollectionOf<Element>
const numPages = computed(() => store.activeDocument ? store.activeDocument.pages : 0)
watch(numPages, async () => {
  await nextTick()
  if (!container.value) return
  pageContainers = document.getElementsByClassName('pageContainer')
  usePageCounter(container.value, pageContainers, currentPage)
}, { immediate: true })

// Resize PDF if window is resized
const vuePDF = ref<null|typeof VuePDF>(null)
function reloadPDF() {
  if (vuePDF.value) vuePDF.value.map((v: any) => {
    v.reload()
  })
}

onMounted(() => {
  window.addEventListener('resize', reloadPDF)
})

onUnmounted(() => {
  window.removeEventListener('resize', reloadPDF)
})
</script>
