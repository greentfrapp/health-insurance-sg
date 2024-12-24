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
  store.history = []
  if (route.query.doc) {
    store.openDocument(route.query.doc as string)
  }
})
</script>
