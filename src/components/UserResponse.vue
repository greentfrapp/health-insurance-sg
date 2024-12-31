<template>
  <div
    class="user-response bg-neutral-700 text-white min-w-[30%] max-w-[90%] px-4 py-2 rounded-md">
    <div v-html="parsed"></div>
  </div>
</template>
<script setup lang="ts">
import showdown from 'showdown'
import { computed } from 'vue'

const converter = new showdown.Converter()

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
})

const parsed = computed(() => {
  return converter.makeHtml(
    props.content.replaceAll('\n', '\n\n').replaceAll('|\n\n', '|\n'),
  )
})
</script>
