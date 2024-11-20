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
          <p>
            This app does not provide financial advice.
            <br />
            Any information on this site is for informational purposes only.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ExclamationTriangleIcon } from '@heroicons/vue/20/solid'
</script>
