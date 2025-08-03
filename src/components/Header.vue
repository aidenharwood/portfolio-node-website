<script setup lang="ts">
import { ref } from 'vue'
const menuOpen = ref(false)
</script>

<template>
  <nav class="w-full flex items-center justify-between px-8 py-4 bg-gray-950/80 shadow-md">
    <div class="flex items-center gap-2">    
    </div>
    <!-- Desktop links -->
    <div class="hidden md:flex gap-4">
      <router-link to="/" class="hover:text-primary transition-colors">About</router-link>
      <!-- <router-link to="/projects" class="hover:text-primary transition-colors">Projects</router-link>
      <router-link to="/contact" class="hover:text-primary transition-colors">Contact</router-link> -->
    </div>
    <!-- Hamburger button (mobile) -->
    <button
      class="md:hidden flex flex-col justify-center items-center w-10 h-10"
      @click="menuOpen = !menuOpen"
      aria-label="Toggle menu"
    >
      <span class="block w-6 h-0.5 bg-white mb-1"></span>
      <span class="block w-6 h-0.5 bg-white mb-1"></span>
      <span class="block w-6 h-0.5 bg-white"></span>
    </button>
    <!-- Mobile menu -->
    <div
      v-if="menuOpen"
      class="absolute top-16 right-8 bg-gray-950 border border-gray-800 rounded shadow-lg flex flex-col gap-4 p-6 md:hidden z-50"
    >
      <router-link to="/" class="hover:text-primary transition-colors" @click="menuOpen = false">About</router-link>
      <router-link to="/projects" class="hover:text-primary transition-colors" @click="menuOpen = false">Projects</router-link>
      <router-link to="/contact" class="hover:text-primary transition-colors" @click="menuOpen = false">Contact</router-link>
    </div>
  </nav>
</template>