<template>
  <div class="flex flex-col w-[80%] items-center gap-4">
    <div class="text-xl font-medium">
      <p v-if="store.activePolicy">
        Ask something about {{ store.activePolicy }}
      </p>
      <p v-else>Ask something</p>
    </div>
    <div class="w-full">
      <UserInput />
    </div>
    <div class="grid grid-cols-2 gap-2 text-sm text-neutral-700">
      <button
        v-for="qn in selectedQuestions"
        class="border-2 rounded-lg px-3 py-2 flex text-left hover:bg-neutral-50"
        @click="store.submitQuery(qn)">
        {{ qn }}
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import UserInput from './UserInput.vue'
import sampleQuestions from '@/utils/sampleQuestions.json'
import { useStore } from '@/utils/store'

const store = useStore()

const selectedQuestions = sampleQuestions
  .slice()
  .sort(() => 0.5 - Math.random())
  .slice(0, 4)
</script>
