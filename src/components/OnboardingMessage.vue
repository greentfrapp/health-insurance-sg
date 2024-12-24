<template>
  <div class="space-y-4">
    <h1 class="font-medium text-xl mt-0">
      How much do you know about your health insurance?
    </h1>
    <div class="max-w-prose space-y-4">
      <p>
        Last year, my wife and I were hit with a $37,000 hospitalization bill.
        Everyone around us had said we should get insurance. And we did. But not
        understanding our coverage, we went to a private hospital, even though
        we only had public hospital coverage.
      </p>
      <p>
        Navigating and learning about health insurance is daunting. In
        Singapore, we all have MediShield Life, which few understand. To add to
        the complexity, there are also 26 Integrated Shield Plans (ISPs) sold by
        seven insurance companies.
      </p>
      <p>
        We built this free app to make understanding Singapore's MediShield Life
        and ISPs easier. Select the company you are interested in, and ask
        questions about its insurance policies. This app will search and
        synthesize information across brochures, product summaries, and premium
        tables for you. Think of it as a supercharged insurance agent—helpful,
        knowledgeable, and not selling you anything.
      </p>
      <p>We hope this app helps you in your healthcare journey.</p>
      <p>Swee Kiat & Alfred</p>
      <div class="relative">
        <img src="/SK.png" class="w-16 relative z-10" />
        <img src="/Alfred.png" class="w-16 absolute top-0 left-12" />
      </div>
      <p>
        P.S. For more healthcare projects like these, check out
        <a class="underline" href="https://halejournal.substack.com/"
          >our main website</a
        >.
      </p>
      <p class="text-neutral-600">
        Disclaimer: The information on this website is for education and general
        reference only, and not a replacement for professional advice tailored
        to specific individuals and situations. Consult insurance professionals
        before making decisions about your insurance.
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useStore } from '@/utils/store'

const store = useStore()

function closeMessage() {
  store.showOnboardingMessage = false
}
</script>
