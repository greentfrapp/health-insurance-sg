<template>
  <div class="rounded-md bg-neutral-100 p-2">
    <div class="flex">
      <div class="text-xs text-neutral-700 text-center w-full">
        <p>{{ disclaimer }}</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const disclaimer = `
This app is for education only. Consult a financial advisor before making decisions.
`
</script>
