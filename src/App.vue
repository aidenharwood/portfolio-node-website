<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <main class="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white">
    <Header />
    <section class="flex-1 flex flex-col">
      <router-view />
    </section>
    <Footer />
  </main>
</template>