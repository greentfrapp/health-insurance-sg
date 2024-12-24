<template>
  <div class="flex pb-4 px-10 h-full justify-center w-screen overflow-hidden">
    <div class="flex w-full gap-4 max-w-full" :style="{ width: '1280px' }">
      <div class="shrink-0 flex flex-col w-[65ch] space-y-4">
        <div
          v-if="store.history.filter((s) => !s.hidden).length === 0"
          class="shrink grow flex items-center justify-center">
          <ConversationPlaceholder />
        </div>
        <div v-else class="shrink grow flex flex-col overflow-auto">
          <div
            class="history-container shrink grow space-y-4 overflow-auto px-2 pb-16"
            ref="historyContainer">
            <div v-for="step in store.history.filter((s) => !s.hidden)">
              <div v-if="step.role === 'user'" class="flex justify-end">
                <div
                  class="bg-neutral-700 text-white w-[90%] px-4 py-2 rounded-md">
                  {{ step.content }}
                </div>
              </div>
              <div v-else>
                <div class="px-4 py-2">
                  <component
                    v-if="step.formattedContent"
                    :is="parseResponse(step.formattedContent as APIResponse)"
                    class="max-w-prose space-y-1"></component>
                </div>
              </div>
            </div>
            <div
              v-if="store.streamBuffer"
              class="border rounded-lg text-sm px-4 py-2 text-neutral-700 bg-neutral-100 max-w-full overflow-hidden">
              {{ store.streamBuffer }}
            </div>
            <ErrorMessage v-else-if="store.apiError">
              {{ store.apiError }}
            </ErrorMessage>
          </div>
          <UserInputShortcuts />
          <UserInput />
        </div>
      </div>
      <PDFContainer class="grow shrink" />
    </div>
  </div>
</template>
<style scoped>
.history-container {
  scroll-behavior: smooth;
}
</style>
<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import ConversationPlaceholder from './ConversationPlaceholder.vue'
import ErrorMessage from './ErrorMessage.vue'
import PDFContainer from '@/components/PDFContainer.vue'
import UserInput from '@/components/UserInput.vue'
import UserInputShortcuts from '@/components/UserInputShortcuts.vue'
import { useStore } from '@/utils/store'
import { APIResponse } from '@/utils/types'
import { parseResponse } from '@/utils/utils'

const store = useStore()

const historyContainer = ref<null | HTMLDivElement>(null)

watch(
  () => [store.streamBuffer, store.history.length],
  async () => {
    // Wait a tick for container height to update
    await nextTick()
    if (historyContainer.value) {
      historyContainer.value.scrollTop = historyContainer.value.scrollHeight
    }
  },
)
</script>
