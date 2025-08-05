<script setup lang="ts">
import Navigation from '@/components/Navigation.vue'
// import Footer from '@/components/Footer.vue'
import InfoCard from '@/components/InfoCard.vue'
</script>

<template>
  <main
    class="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-200 px-4 md:px-10 pt-10 md:pt-30 pb-30 md:pb-10"
  >
    <Navigation />
    <section class="md:flex w-full md:space-x-10 space-y-10 justify-items-center justify-center items-start flex-1">
      <InfoCard />
      <section class="flex flex-col w-full items-start md:px-10 px-0 flex-1 overflow-y-auto
        [&::-webkit-scrollbar]:w-0.25
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-slate-500">
        <router-view />
      </section>
    </section>
    <!-- <Footer /> -->
  </main>
</template>