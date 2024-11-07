<template>
  <div class="flex flex-col items-center">
    <StreamAPI />
    <ConnectionStatus />
  </div>
</template>
<script setup lang="ts">
import StreamAPI from './components/StreamAPI.vue'
import ConnectionStatus from './components/ConnectionStatus.vue'
</script>
