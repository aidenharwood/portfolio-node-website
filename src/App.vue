<script setup lang="ts">
import Navigation from '@/components/Navigation.vue'
import InfoCard from '@/components/InfoCard.vue'
</script>

<template>
  <main
    class="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-200 px-4 lg:px-10 pt-10 lg:pt-30 pb-30 lg:pb-10"
  >
    <Navigation />
    <section class="lg:flex w-full lg:space-x-10 lg:space-y-0 space-y-10 justify-items-center justify-center items-start">
      <InfoCard />
      <section class="flex flex-col w-full max-w-full items-start lg:px-10 px-0 flex-1 min-w-0 min-h-0
        [&_*::-webkit-scrollbar]:w-0.25
        [&_*::-webkit-scrollbar]:h-2
        [&_*::-webkit-scrollbar-track]:rounded-full
        [&_*::-webkit-scrollbar-track]:bg-transparent
        [&_*::-webkit-scrollbar-thumb]:rounded-full
        [&_*::-webkit-scrollbar-thumb]:bg-slate-500
         ">
        <router-view class="max-w-full w-full min-w-0 flex-1" />
      </section>
    </section>
  </main>
</template>