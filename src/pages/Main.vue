<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <Navbar class="shrink-0" />
    <StreamAPI class="grow" />
    <ConnectionStatus />
  </div>
</template>
<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ConnectionStatus from '@/components/ConnectionStatus.vue'
import Navbar from '@/components/Navbar.vue'
import StreamAPI from '@/components/StreamAPI.vue'
import MediShieldLifeResponse from '@/utils/medishieldLifeResponse.json'
import { useStore } from '@/utils/store'

const store = useStore()
const route = useRoute()
const router = useRouter()

watch(
  () => store.activeDocumentPath,
  (activeDocumentPath) => {
    if (!activeDocumentPath) return
    router.push({
      path: '/app',
      query: {
        doc: activeDocumentPath,
      },
    })
  },
  { immediate: true },
)

onMounted(() => {
  if (store.activePolicy === 'MediShield Life') {
    MediShieldLifeResponse.references
      .map((r) => r.filepath)
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .forEach(store.addDocument)
    MediShieldLifeResponse.references.forEach((r) => {
      store.evidenceCache[r.id] = r
      const documentId = r.id.split(' ')[0]
      if (!store.documentIds.includes(documentId)) {
        store.documentIds.push(documentId)
      }
    })
    store.history = [
      {
        role: 'user',
        content: 'What is MediShield Life?',
        formattedContent: 'What is MediShield Life?',
      },
      {
        role: 'assistant',
        content:
          'MediShield Life is a basic health insurance plan for all Singapore Citizens and Permanent Residents, protecting against large medical bills regardless of age or pre-existing conditions (bb3bc5b3Ministry2024 pages 1-3 quote1, pages 1-5 quote1).  Even with pre-existing conditions, coverage is provided, though an additional premium may apply for the first ten years (bb3bc5b3Ministry2024 pages 1-3 quote2, quote3).  MediSave funds can be used to pay premiums, including any additional amounts (bb3bc5b3Ministry2024 pages 1-3 quote4).\n\nThis basic plan covers hospitalizations and selected outpatient treatments (bb3bc5b3Ministry2024 pages 1-5 quote3).  While it covers both subsidized and non-subsidized treatments, the latter will have a smaller portion covered (bb3bc5b3Ministry2024 pages 1-5 quote4, quote5).  Claims involve deductibles and co-insurance (bb3bc5b3Ministry2024 pages 1-5 quote7, quote8).  To enhance coverage, Integrated Shield Plans (IPs) can supplement MediShield Life (bb3bc5b3Ministry2024 pages 1-5 quote9).  The government provides subsidies to keep premiums affordable (bb3bc5b3Ministry2024 pages 1-5 quote2).  No one loses coverage due to inability to pay premiums (bb3bc5b3Ministry2024 pages 1-5 quote10).',
        formattedContent: MediShieldLifeResponse,
      },
    ]
  } else {
    store.history = []
  }
  if (route.query.doc) {
    store.openDocument(route.query.doc as string)
  }
})
</script>
