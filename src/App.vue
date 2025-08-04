<script setup lang="ts">
import Navigation from '@/components/Navigation.vue'
// import Footer from '@/components/Footer.vue'
import InfoCard from '@/components/InfoCard.vue'
</script>

<template>
  <main
    class="pt-10 md:pt-30 pb-30 md:pb-10 flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 text-slate-200 px-4 md:px-10 h-full md:h-dvh">
    <Navigation />
    <section class="md:flex w-full md:space-x-10  space-y-10 justify-items-center justify-center items-start">
      <InfoCard />
      <section class="flex-col w-full h-full items-start px-10">
        <router-view />
      </section>
    </section>
    <!-- <Footer /> -->
  </main>
</template>