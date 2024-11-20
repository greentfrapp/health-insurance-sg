<template>
  <div class="flex p-10 max-h-screen justify-center w-screen">
    <div class="flex w-full gap-4 max-w-full" :style="{ width: '1280px' }">
      <div class="shrink-0 flex flex-col w-[65ch] space-y-4">
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
            class="border rounded-lg text-sm px-4 py-2 text-neutral-700 bg-neutral-100">
            {{ store.streamBuffer }}
          </div>
        </div>
        <UserInput />
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
import { parseResponse } from '@/utils/utils'
import { useStore } from '@/utils/store'
import PDFContainer from './PDFContainer.vue'
import UserInput from './UserInput.vue'
import { APIResponse } from '@/utils/types'

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
