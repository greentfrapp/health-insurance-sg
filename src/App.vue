<template>
  <div class="flex flex-col items-center">
    <router-view />
  </div>
</template>
<script setup lang="ts">
import StreamAPI from './components/StreamAPI.vue'
import ConnectionStatus from './components/ConnectionStatus.vue'
import { useStore } from './utils/store'
import { onMounted } from 'vue'

const store = useStore()
onMounted(store.init)
</script>
