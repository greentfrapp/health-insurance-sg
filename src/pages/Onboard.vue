<template>
  <div class="h-screen flex flex-col items-center justify-center gap-10">
    <h1 class="flex flex-col text-center text-4xl space-y-2">
      <span>🇸🇬</span>
      <span>Ask questions about</span>
      <span class="font-semibold"> Singapore's Integrated Shield Plans </span>
    </h1>
    <div class="grid grid-cols-4 gap-4">
      <div
        v-for="plan in plans"
        class="border shadow rounded-lg w-72 h-28 p-4 flex gap-4 items-center cursor-pointer hover:bg-neutral-50"
        @click="loadDocument(plan.document)">
        <img :src="plan.logo" class="w-12 h-12 shrink-0 rounded-lg shadow" />
        <div>
          <p class="font-medium">
            {{ plan.provider }}
          </p>
          <ul>
            <li v-for="name in plan.plans">
              {{ name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useStore } from '@/utils/store'
import { useRouter } from 'vue-router'

const plans = [
  {
    logo: 'logos/MOH.jpg',
    provider: 'Ministry of Health',
    plans: ['MediShield Life'],
    document:
      'MOH/MediShield Life/Information Booklet For The NewlyInsured (Nov 2024).pdf',
  },
  {
    logo: 'logos/AIA.jpg',
    provider: 'AIA',
    plans: ['HealthShield Gold Max'],
    document: 'AIA/ISPs/AIA HealthShield Gold Max Brochure (Sep 2024).pdf',
  },
  {
    logo: 'logos/Great Eastern.jpg',
    provider: 'Great Eastern',
    plans: ['GREAT SupremeHealth'],
    document: 'Great Eastern/ISPs/GREAT SupremeHealth Brochure (Oct 2024).pdf',
  },
  {
    logo: 'logos/HSBC.jpg',
    provider: 'HSBC',
    plans: ['Life Shield'],
    document: 'HSBC/ISPs/HSBC Life Shield Product Brochure (Oct 2024).pdf',
  },
  {
    logo: 'logos/NTUC Income.jpg',
    provider: 'NTUC Income',
    plans: ['IncomeShield Standard', 'Enhanced IncomeShield'],
    document: 'Income/ISPs/IncomeShield Standard Brochure (Nov 2024).pdf',
  },
  {
    logo: 'logos/Prudential.jpg',
    provider: 'Prudential',
    plans: ['PRUShield'],
    document: 'Prudential/ISPs/PRUShield Brochure (Oct 2024).pdf',
  },
  {
    logo: 'logos/Raffles Health Insurance.jpg',
    provider: 'Raffles Health Insurance',
    plans: ['Raffles Shield'],
    document:
      'Raffles Health Insurance/ISPs/Raffles Shield Brochure (Apr 2024).pdf',
  },
  {
    logo: 'logos/Singlife.jpg',
    provider: 'Singlife',
    plans: ['Singlife Shield'],
    document: 'Singlife/ISPs/Singlife Shield Brochure (Sep 2024).pdf',
  },
]

const store = useStore()
const router = useRouter()

function loadDocument(document: string) {
  store.openDocument(document)
  router.push('app')
}
</script>
