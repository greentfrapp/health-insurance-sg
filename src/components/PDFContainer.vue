<template>
  <div class="relative flex flex-col overflow-hidden">
    <div
      v-if="store.activeDocument && store.activeDocument.pages"
      class="h-full relative flex flex-col">
      <div class="relative flex justify-center items-center pb-2 gap-4">
        <!-- <router-link
          to="/"
          class="bg-white text-neutral-700 w-6 h-6 flex items-center justify-center rounded-md shadow">
          <HomeIcon class="w-3 h-3" />
        </router-link> -->
        <PageCounter
          :current-page="currentPage"
          :num-pages="numPages"
          @goToPage="scrollToPage" />
        <!-- <PoliciesMenu /> -->
        <div
          class="text-xs px-3 py-1 bg-white rounded-full shadow cursor-pointer flex gap-2">
          <button @click="scale -= increment">
            <MagnifyingGlassMinusIcon class="w-3.5 h-3.5" />
          </button>
          <button @click="scale = 0.8">{{ (scale * 100).toFixed(0) }}%</button>
          <button @click="scale += increment">
            <MagnifyingGlassPlusIcon class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div
        ref="container"
        class="pdf-container grow shrink overflow-auto shadow-lg space-y-2 p-10 rounded-xl border bg-white">
        <div
          v-for="page in store.activeDocument.pages"
          :id="`page${page}`"
          class="pageContainer shadow h-auto mx-auto w-max">
          <VuePDF
            ref="vuePDF"
            :pdf="store.activeDocument.pdf"
            text-layer
            :highlight-text="
              store.selectedEvidence &&
              store.selectedEvidence.pages.includes(page)
                ? innerQuote
                : ''
            "
            :highlight-options="{
              completeWords: false,
              ignoreCase: true,
            }"
            @highlight="onHighlight"
            :page="page"
            :scale="scale" />
        </div>
      </div>
      <div
        v-if="searching"
        class="absolute top-0 left-0 w-full h-full bg-white/80 flex items-center justify-center">
        {{
          movingToBookmark
            ? 'Quote not found, moving to nearest page instead...'
            : 'Searching...'
        }}
      </div>
      <!-- <div v-if="movingToPage" class="absolute top-0 left-0 w-full h-full bg-white/80 flex items-center justify-center">
        Moving to page {{ store.goToPage }}
      </div> -->
    </div>
    <div v-else class="flex flex-col h-screen">
      <div class="invisible relative flex flex-col items-center py-2">
        <PageCounter :current-page="0" :num-pages="0" />
      </div>
      <div
        class="grow shrink overflow-auto shadow-lg rounded-xl border bg-white flex items-center justify-center text-neutral-500 animate-pulse">
        Loading document...
      </div>
    </div>
  </div>
</template>
<style scoped>
.pdf-container {
  scroll-behavior: smooth;
}
</style>
<script setup lang="ts">
// import { HomeIcon } from '@heroicons/vue/24/outline'
import {
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
} from '@heroicons/vue/20/solid'
import { HighlightEventPayload, VuePDF } from '@tato30/vue-pdf'
import '@tato30/vue-pdf/style.css'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import PageCounter from './PageCounter.vue'
// import PoliciesMenu from './PoliciesMenu.vue'
import { usePageCounter } from '@/utils/pageCounter'
import { useStore } from '@/utils/store'

const store = useStore()

const innerQuote = ref('')
const container = ref<null | HTMLDivElement>(null)
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
    Math.min(container.value.scrollTop + bookmarkRect.top - padding),
  )
  scrollToEvidence()
}

let foundQuote = false
const ogScale = 0.8
const increment = 0.1
const scale = ref(ogScale)
const padding = 200
const searchingPages = ref([] as number[])
const movingToBookmark = ref(false)
const searching = computed(() => {
  return searchingPages.value.length > 0 || movingToBookmark.value
})
watch(
  () => store.evidenceKey,
  async () => {
    // scale.value = ogScale
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
      foundQuote = false
      searchingPages.value = pages
      // Give some time for pdf to load before searching
      await new Promise((r) => setTimeout(r, 1000))
      innerQuote.value = store.selectedEvidence.quote
    } else {
      // Scroll to nearest page
      scrollToPage(Math.min(...pages))
    }
  },
)

function onHighlight(payload: HighlightEventPayload) {
  if (!container.value) return
  if (!searchingPages.value.length) return
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
      ),
    )
    if (scrollTop > newMaxY) {
      scrollTop = newMaxY
    }
  }
  searchingPages.value = searchingPages.value.filter((p) => p !== payload.page)
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
const numPages = computed(() =>
  store.activeDocument ? store.activeDocument.pages : 0,
)
watch(
  numPages,
  async () => {
    // scale.value = ogScale
    await nextTick()
    if (!container.value) return
    pageContainers = document.getElementsByClassName('pageContainer')
    usePageCounter(container.value, pageContainers, currentPage)
    getPDFWidth()
  },
  { immediate: true },
)

// Resize PDF if window is resized
const vuePDF = ref<null | typeof VuePDF>(null)
function reloadPDF() {
  if (vuePDF.value) {
    vuePDF.value.map((v: any) => {
      v.reload()
    })
  }
}

function getPDFWidth() {
  const page = document.getElementById('page1')
  if (!page) return
}

onMounted(async () => {
  window.addEventListener('resize', reloadPDF)
})

onUnmounted(() => {
  window.removeEventListener('resize', reloadPDF)
})
</script>
