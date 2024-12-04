<template>
  <div class="flex flex-col items-center">
    <StreamAPI />
    <!-- <ConnectionStatus /> -->
  </div>
</template>
<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// import ConnectionStatus from '@/components/ConnectionStatus.vue'
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
  if (route.query.doc) {
    store.openDocument(route.query.doc as string)
  }
})
</script>
