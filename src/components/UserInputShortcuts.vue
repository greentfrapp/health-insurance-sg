<template>
  <div v-if="show" class="grid grid-cols-1 gap-2 text-sm text-neutral-700 pb-2">
    <button
      v-for="suggestion in suggestions"
      class="border shadow rounded-lg px-3 py-2 flex text-left bg-neutral-100 hover:bg-neutral-200"
      @click="store.submitQuery(suggestion)">
      {{ suggestion }}
    </button>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '@/utils/store'
import { APIResponse } from '@/utils/types'

const store = useStore()

const suggestions = computed(() => {
  const userRecentResponses = store.history
    .filter((r) => !r.hidden && r.role === 'user')
    .slice(-5)
    .map((r) => r.content)
  const agentResponses = store.history.filter(
    (r) => !r.hidden && r.role === 'assistant',
  )
  if (agentResponses.length === 0) return []
  const lastResponse = agentResponses[agentResponses.length - 1]
  const apiResponse = lastResponse.formattedContent as APIResponse
  if (apiResponse.suggestedResponses) {
    return apiResponse.suggestedResponses.filter(
      (r) => !userRecentResponses.includes(r),
    )
  } else {
    return []
  }
})

const show = computed(() => {
  return !store.streamingResponse && suggestions.value.length
})
</script>
