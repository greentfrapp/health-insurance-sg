<template>
  <div class="relative" ref="menu">
    <button
      class="bg-white text-neutral-700 w-6 h-6 flex items-center justify-center rounded-md shadow"
      @click="showMenu = !showMenu">
      <FolderOpenIcon class="w-3 h-3" />
    </button>
    <div
      v-if="showMenu"
      class="absolute bg-white shadow rounded-md top-full right-0 px-2 py-1 translate-y-1 border space-y-1 w-64 z-10 text-xs max-h-40 overflow-auto">
      <div class="font-medium">Open a document</div>
      <div v-for="policy in policies">
        <hr class="pb-1" />
        <p class="truncate text-neutral-500">
          {{ policy.label }}
        </p>
        <button
          v-for="doc in policy.documents"
          class="w-full px-2 py-1 text-left hover:bg-neutral-100 rounded flex items-center gap-2"
          @click.capture="doc.action"
          :title="doc.label">
          <p class="truncate">
            {{ doc.label }}
          </p>
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { FolderOpenIcon } from '@heroicons/vue/24/outline'
import { computed } from '@vue/reactivity'
import { onMounted, onUnmounted, ref } from 'vue'
import { handleMenuClick } from '@/utils/handleMenuClick'
import { POLICY_DOCUMENTS, useStore } from '@/utils/store'

const showMenu = ref(false)

const store = useStore()

const policies = computed(() => {
  return Object.entries(POLICY_DOCUMENTS).map((entry) => {
    const policy = entry[0]
    const documents = entry[1]
    return {
      label: policy,
      documents: documents.map((doc) => {
        const docName = doc
          .split('/')
          [doc.split('/').length - 1].split('.pdf')[0]
        return {
          label: docName,
          action: () => {
            store.openDocument(doc)
            showMenu.value = false
          },
        }
      }),
    }
  })
})

const menu = ref<null | HTMLDivElement>(null)
onMounted(() => {
  document.addEventListener('click', (e) =>
    handleMenuClick(e, menu.value, showMenu),
  )
})
onUnmounted(() => {
  document.removeEventListener('click', (e) =>
    handleMenuClick(e, menu.value, showMenu),
  )
})
</script>
