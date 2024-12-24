<template>
  <div class="flex items-center justify-center w-screen">
    <div
      class="shrink-0 w-max h-max flex items-center justify-center rounded-full shadow pl-3 pr-3 py-1 my-4 gap-2">
      <HeartIcon class="w-6 h-6 text-red-400" />
      <router-link
        v-for="link in links"
        :to="link.link"
        class="no-underline px-3 py-1 rounded-full truncate font-normal"
        :class="[route.path === link.link ? 'bg-[#FFB4B4]/25' : '']">
        {{ link.label }}
      </router-link>
    </div>
  </div>
</template>
<script setup lang="ts">
import { HeartIcon } from '@heroicons/vue/20/solid'
import { useRoute } from 'vue-router'

const links = [
  {
    label: 'Policies',
    link: '/',
  },
  {
    label: 'About',
    link: '/about',
  },
]

const route = useRoute()
</script>
