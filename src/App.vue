<script setup lang="ts">
import Navigation from '@/components/Navigation.vue'
import InfoCard from '@/components/InfoCard.vue'
</script>

<template>
  <main
    class="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-200 px-4 md:px-10 pt-10 md:pt-30 pb-30 md:pb-10"
  >
    <Navigation />
    <section class="lg:flex w-full lg:space-x-10 lg:space-y-0 space-y-10 justify-items-center justify-center items-start">
      <InfoCard />
      <section class="w-full max-w-full items-start md:px-10 px-0
        [&_*::-webkit-scrollbar]:w-0.25
        [&_*::-webkit-scrollbar]:h-2
        [&_*::-webkit-scrollbar-track]:rounded-full
        [&_*::-webkit-scrollbar-track]:bg-transparent
        [&_*::-webkit-scrollbar-thumb]:rounded-full
        [&_*::-webkit-scrollbar-thumb]:bg-slate-500
         ">
        <router-view class="max-w-full w-full" />
      </section>
    </section>
  </main>
</template>