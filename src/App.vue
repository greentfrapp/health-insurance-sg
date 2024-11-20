<template>
  <div class="flex flex-col items-center">
    <router-view />
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useStore } from './utils/store'

const store = useStore()
onMounted(store.init)
</script>
