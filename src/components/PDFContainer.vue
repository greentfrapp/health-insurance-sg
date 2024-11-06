<template>
  <div class="relative flex flex-col">
    <div class="flex flex-col items-center py-2">
      <div class="text-xs px-3 py-1 bg-neutral-100 rounded-full">
        Page {{ currentPage }} / {{ numPages }}
      </div>
    </div>
    <div ref="container"
      class="grow shrink overflow-auto shadow-lg">
      <div v-for="page in numPages"
        :id="`page${page}`" class="pageContainer">
        <VuePDF ref="vuePDF"
          v-if="activePDF"
          :pdf="store.evidenceCache[activePDF].pdf"
          text-layer
          :highlight-text="evidencePages.includes(page) ? innerQuote : ''"
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
    <div v-if="movingToPage" class="absolute top-0 left-0 w-full h-full bg-white/80 flex items-center justify-center">
      Moving to page {{ store.goToPage }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { useStore } from '@/utils/store'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { VuePDF, usePDF } from '@tato30/vue-pdf'
import '@tato30/vue-pdf/style.css'
import { APIResponse } from '@/utils/types';

const props = defineProps({
  urls: {
    type: Array<string>,
    default: [],
  },
})

const store = useStore()
const activePDF = ref('')

watch(() => props.urls, urls => {
  // Cache PDFs
  urls.forEach(url => {
    if (!(url in store.evidenceCache)) {
      const pdfLoader = usePDF(url)
      store.evidenceCache[url] = pdfLoader
      console.log(`Loaded ${url}`)
    }
  })
  if (urls.length) activePDF.value = urls[0]
  else activePDF.value = store.lastDocumentKey as string
}, { immediate: true })

const innerQuote = ref('')
const evidencePages = ref([] as number[])

// TODO: index with URL as well to support multiple documents
const evidenceId = computed(() => {
  if (store.quoteIdx === null || store.evidenceIdx === null) return null
  else return store.evidenceIdx.toString() + '-' + store.quoteIdx.toString()
})

watch(() => [store.stepIdx, store.evidenceIdx, store.quoteIdx], async (
  [stepIdx, evidenceIdx, quoteIdx],
  [prevStepIdx, prevEvidenceIdx, prevQuoteIdx],
) => {
  if (stepIdx === null || evidenceIdx === null || quoteIdx === null) return
  if (store.history.length <= stepIdx) return
  // Support repeated search since user might have scrolled away
  // This means we first clear evidencePages so that watcher will retrigger
  if (prevStepIdx === null || prevEvidenceIdx === null || prevQuoteIdx === null) {
    evidencePages.value = []
    await nextTick()
  }
  const activeResponse = store.history[stepIdx].value as APIResponse
  if (activePDF.value !== activeResponse.references[evidenceIdx].filepath) {
    activePDF.value = activeResponse.references[evidenceIdx].filepath
    await new Promise(r => setTimeout(r, 1000)) 
  }
  evidencePages.value = activeResponse.references[evidenceIdx].pages
  innerQuote.value = activeResponse.references[evidenceIdx].quotes[quoteIdx].quote
})

const container = ref<null|HTMLDivElement>(null)
async function scrollToEvidence() {
  if (!container.value) return
  if (evidenceId.value === null || !evidenceTopCache[evidenceId.value]) return
  container.value.scrollTo({
    top: evidenceTopCache[evidenceId.value],
    behavior: "smooth",
  })
  store.evidenceIdx = store.quoteIdx = null
}

const evidenceTopCache = {} as any

const padding = 100
const foundQuote = ref(false)
const searchingPages = ref([] as number[])
const movingToBookmark = ref(false)
const searching = computed(() => {
  return !!searchingPages.value.length || movingToBookmark.value
})
watch(() => [innerQuote.value, evidencePages.value], ([innerQuote, evidencePages]) => {
  if (innerQuote && evidencePages.length) {
    foundQuote.value = false
    searchingPages.value = evidencePages as number[]
  }
})
function onHighlight(value: any) {
  searchingPages.value = searchingPages.value.filter(p => p !== value.page)
  if (!container.value) return
  if (!evidenceId.value) return
  if (value.matches) {
    const match = value.matches[0]
    if (match) {
      const startDiv = value.textDivs[match.start.idx] as HTMLDivElement
      const startRect = startDiv.children[0].getBoundingClientRect()
      const endDiv = value.textDivs[match.end.idx] as HTMLDivElement
      const endRect = endDiv.children[0].getBoundingClientRect()
      const newMaxY = Math.max(
        0,
        Math.min(
          container.value.scrollTop + startRect.top - padding,
          container.value.scrollTop + endRect.top - padding,
        )
      )
      if ((!(evidenceId.value in evidenceTopCache)) || evidenceTopCache[evidenceId.value] > newMaxY) {
        evidenceTopCache[evidenceId.value] = newMaxY
      }
      foundQuote.value = true
    }
  }
  // After search is complete, scroll to evidence
  if (!searchingPages.value.length) {
    if (foundQuote.value) {
      scrollToEvidence()
    } else {
      // Quote not found, moving to nearest page instead
      movingToBookmark.value = true
      setTimeout(() => {
        if (!container.value) return
        if (!evidenceId.value) return
        const bookmarkEl = document.getElementById(`page${Math.min(...evidencePages.value)}`) as HTMLDivElement
        const bookmarkRect = bookmarkEl.getBoundingClientRect()
        evidenceTopCache[evidenceId.value] = Math.max(
          0,
          Math.min(
            container.value.scrollTop + bookmarkRect.top - padding,
          )
        )
        scrollToEvidence()
        movingToBookmark.value = false
      }, 1000)
    }
  }
}

const movingToPage = ref(false)
function goToPage(doc: string|null, page: number|null) {
  if (doc === null || page === null) return
  movingToPage.value = true
  activePDF.value = doc
  setTimeout(() => {
    movingToPage.value = false
    if (!container.value) return
    const bookmarkEl = document.getElementById(`page${page}`) as HTMLDivElement
    const bookmarkRect = bookmarkEl.getBoundingClientRect()
    const position = Math.max(
      0,
      Math.min(
        container.value.scrollTop + bookmarkRect.top,
      )
    )
    container.value.scrollTo({
      top: position,
      behavior: "smooth",
    })
    store.goToPage = null
  }, 500)
  // Clear previous highlight
  innerQuote.value = ''
  evidencePages.value = []
}
watch(() => store.goToPage, page => {
  goToPage(store.goToDoc, page)
})
watch(() => store.goToDoc, doc => {
  goToPage(doc, store.goToPage)
})

const currentPage = ref(1)
let pageContainers: HTMLCollectionOf<Element>
function intersectionCallback(entries: any) {
  let maxIntersection = 0
  for (let i=0; i<entries.length; i++) {
    const entry = entries[i]
    if (entry.intersectionRatio > maxIntersection) {
      currentPage.value = parseInt(entry.target.id.replace('page', ''))
      maxIntersection = entry.intersectionRatio
    }
  }
}
const numPages = computed(() => props.urls.length ? store.evidenceCache[props.urls[0]].pages : store.lastDocument.pages)
watch(numPages, async () => {
  await nextTick()
  const observer = new IntersectionObserver(
    intersectionCallback,
    {
      root: container.value,
      rootMargin: '0px',
      threshold: [0.5],
    }
  )
  pageContainers = document.getElementsByClassName('pageContainer')
  for (let i=0; i<pageContainers.length; i++) {
    observer.observe(pageContainers[i])
  }
}, { immediate: true })

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
