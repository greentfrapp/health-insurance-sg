<template>
  <div class="flex flex-col h-screen">
    <Navbar />
    <div class="grow flex items-center justify-center">
      <OnboardingMessage />
    </div>
  </div>
</template>
<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import OnboardingMessage from '@/components/OnboardingMessage.vue'
</script>
