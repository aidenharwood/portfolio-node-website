<template>
  <button
    @click="toggleTheme"
    class="theme-toggle group relative p-2 rounded-full transition-all duration-300 hover:bg-accent/10 hover:scale-110"
    :title="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    aria-label="Toggle theme"
  >
    <!-- Sun icon for light mode -->
    <transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 rotate-90 scale-0"
      enter-to-class="opacity-100 rotate-0 scale-100"
      leave-active-class="transition-all duration-300"
      leave-from-class="opacity-100 rotate-0 scale-100"
      leave-to-class="opacity-0 -rotate-90 scale-0"
    >
      <i
        v-if="theme === 'light'"
        class="pi pi-sun w-5 h-5 text-yellow-500 absolute inset-2"
      />
    </transition>

    <!-- Moon icon for dark mode -->
    <transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 -rotate-90 scale-0"
      enter-to-class="opacity-100 rotate-0 scale-100"
      leave-active-class="transition-all duration-300"
      leave-from-class="opacity-100 rotate-0 scale-100"
      leave-to-class="opacity-0 rotate-90 scale-0"
    >
      <i
        v-if="theme === 'dark'"
        class="pi pi-moon w-5 h-5 text-blue-400 absolute inset-2"
      />
    </transition>

    <!-- Subtle background glow on hover -->
    <div class="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>

<style scoped>
.theme-toggle {
  position: relative;
  min-width: 2.5rem;
  min-height: 2.5rem;
}

/* Ensure smooth icon transitions */
.theme-toggle i {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Add a subtle pulse effect on active state */
.theme-toggle:active {
  transform: scale(0.95);
}
</style>