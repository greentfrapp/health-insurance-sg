<template>
  <div
    class="border border-red-200 rounded-lg text-sm px-4 py-2 text-neutral-700 bg-red-50 max-w-full overflow-hidden flex flex-col gap-2">
    <p class="flex items-center gap-2">
      <ExclamationTriangleIcon class="w-4 h-4 mt-0.5 text-red-400" />
      Something went wrong. Please try again later.
      <span class="underline cursor-pointer" @click="showDetails = !showDetails"
        >Learn more</span
      >
    </p>
    <div
      v-if="showDetails"
      class="bg-red-100 px-2 py-1 rounded-lg cursor-pointer flex flex-col gap-1 font-mono">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ExclamationTriangleIcon } from '@heroicons/vue/20/solid'
import { ref } from 'vue'

const showDetails = ref(false)
</script>
