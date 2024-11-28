<template>
  <div class="rounded-md bg-neutral-50 p-4 shadow">
    <div class="flex">
      <div class="shrink-0">
        <ExclamationTriangleIcon
          class="size-5 text-neutral-400"
          aria-hidden="true" />
      </div>
      <div class="ml-3">
        <div class="-mt-0.5 text-sm text-neutral-700">
          <p>{{ disclaimer }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ExclamationTriangleIcon } from '@heroicons/vue/20/solid'

const disclaimer = `
This app does not provide financial advice.
Any information on this site is for informational purposes only.
`
</script>
