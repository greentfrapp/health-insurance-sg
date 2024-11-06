<template>
  <div class="flex p-10 max-h-screen justify-center">
    <div class="flex w-full gap-4">
      <div class="flex flex-col w-[65ch]">
        <div class="grow">
          <component v-if="response" :is="parseResponse('')"
            class="max-w-prose space-y-1"></component>
        </div>
        <div class="flex border-2 border-neutral-300 p-1 rounded-lg">
          <input type="text" v-model="query"
            class="grow px-2 py-1"
            placeholder="What am I covered for if I am warded in the hospital?"
            @keyup.enter="submitQuery" />
          <button @click="submitQuery"
            :disabled="!query.length || loading"
            class="px-4 py-1 rounded-md bg-neutral-800 text-neutral-50 disabled:bg-neutral-100 disabled:text-neutral-300">
            {{ loading ? 'Loading' : 'Submit' }}
          </button>
        </div>
      </div>
      <PDFContainer :urls="documents" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { initAPI, queryAPI } from '@/utils/api'
import { onMounted, ref } from 'vue'
import { parseResponse } from '@/utils/utils'
import { APIResponse } from '@/utils/types'
import { useStore } from '@/utils/store'
import PDFContainer from './PDFContainer.vue'
import sampleAPIResponse from '@/utils/sampleAPIResponse_EnhancedIncomeShield.json'

const store = useStore()

const documents = ref(['Enhanced IncomeShield Brochure.pdf'])
const query = ref('What is NTUC IncomeShield\'s coverage for non-standard rooms in a private hospital?')
const loading = ref(false)
const response = ref<null|APIResponse>(null)

async function submitQuery() {
  loading.value = true
  response.value = await queryAPI(query.value)
  console.log(response.value)
  // response.value = sampleAPIResponse
  // response.value = sample
  documents.value = response.value.references.map(r => r.filepath).filter((v, i, arr) => arr.indexOf(v) === i)
  store.activeResponse = response.value
  loading.value = false
}

onMounted(() => {
  initAPI()
  response.value = sampleAPIResponse
  documents.value = response.value.references.map(r => r.filepath).filter((v, i, arr) => arr.indexOf(v) === i)
  store.activeResponse = response.value
})
</script>
