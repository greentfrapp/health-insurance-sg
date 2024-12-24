<template>
  <div
    @click="emit('close')"
    class="w-full h-full bg-black/50 absolute top-0 left-0 flex items-center justify-center">
    <div
      @click.stop
      class="max-h-screen bg-white rounded p-10 flex flex-col gap-4 relative overflow-auto">
      <button class="absolute top-4 right-4" @click="emit('close')">
        <XMarkIcon class="w-6 h-6 text-neutral-600" />
      </button>
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['close'])
</script>
