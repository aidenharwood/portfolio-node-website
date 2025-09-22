<template>
  <div class="floating-theme-toggle">
    <!-- Main floating button -->
    <button
      @click="toggleTheme"
      class="floating-btn group relative overflow-hidden rounded-full transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:scale-110 active:scale-95"
      :title="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
      aria-label="Toggle theme"
    >
      <!-- Animated background gradient -->
      <div class="absolute inset-0 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 opacity-90 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"></div>
      
      <!-- Glowing ring effect -->
      <div class="absolute inset-0 rounded-full border-2 border-accent/30 group-hover:border-accent/60 group-hover:scale-105 transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] animate-pulse"></div>
      
      <!-- Icon container -->
      <div class="relative flex items-center justify-center w-full h-full">
        <!-- Sun icon for light mode -->
        <transition
          enter-active-class="transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          enter-from-class="opacity-0 rotate-180 scale-0"
          enter-to-class="opacity-100 rotate-0 scale-100"
          leave-active-class="transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          leave-from-class="opacity-100 rotate-0 scale-100"
          leave-to-class="opacity-0 -rotate-180 scale-0"
        >
          <i
            v-if="theme === 'light'"
            class="pi pi-sun text-white text-xl drop-shadow-lg transition-all duration-300 ease-out"
          />
        </transition>

        <!-- Moon icon for dark mode -->
        <transition
          enter-active-class="transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          enter-from-class="opacity-0 -rotate-180 scale-0"
          enter-to-class="opacity-100 rotate-0 scale-100"
          leave-active-class="transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          leave-from-class="opacity-100 rotate-0 scale-100"
          leave-to-class="opacity-0 rotate-180 scale-0"
        >
          <i
            v-if="theme === 'dark'"
            class="pi pi-moon text-white text-xl drop-shadow-lg transition-all duration-300 ease-out"
          />
        </transition>
      </div>

      <!-- Ripple effect on click -->
      <div class="absolute inset-0 rounded-full bg-white/20 scale-0 group-active:scale-100 group-active:opacity-0 transition-all duration-600 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"></div>
    </button>

    <!-- Floating particles effect -->
    <div class="absolute inset-0 pointer-events-none hidden sm:block">
      <div
        v-for="n in 3"
        :key="n"
        class="absolute w-1 h-1 bg-accent/40 rounded-full animate-float"
        :class="`float-${n}`"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>

<style scoped>
.floating-theme-toggle {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  
  /* Mobile-first responsive positioning */
  @media (max-width: 768px) {
    /* Position for easy thumb reach - top left for right-handed users */
    top: 1rem;
    left: 1rem;
    bottom: auto;
    right: auto;
  }
  
  @media (min-width: 769px) and (max-width: 1024px) {
    /* Tablet positioning - top right but accessible */
    top: 1rem;
    right: 1rem;
    bottom: auto;
  }
}

.floating-btn {
  width: 3.5rem;
  height: 3.5rem;
  backdrop-filter: blur(20px);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.15),
    0 4px 16px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  
  /* Mobile optimizations */
  @media (max-width: 768px) {
    width: 3rem;
    height: 3rem;
    /* Better shadow for mobile - less intensive */
    box-shadow: 
      0 4px 16px rgba(0, 0, 0, 0.15),
      0 2px 8px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  
  /* Touch target size compliance */
  @media (max-width: 768px) {
    /* Ensure minimum 44px touch target */
    min-width: 44px;
    min-height: 44px;
  }
}

.floating-btn:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 16px 48px rgba(0, 0, 0, 0.25),
    0 8px 24px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* Mobile-specific interactions */
@media (max-width: 768px) {
  .floating-btn:hover {
    /* Disable hover transform on mobile */
    transform: none;
    box-shadow: 
      0 4px 16px rgba(0, 0, 0, 0.15),
      0 2px 8px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  
  /* Better active state for mobile touch */
  .floating-btn:active {
    transform: scale(0.9);
    transition: all 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
}

.floating-btn:active {
  transform: translateY(0px) scale(0.95);
  transition: all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Floating particles animation */
@keyframes float {
  0%, 100% {
    transform: translateY(0px) translateX(0px) rotate(0deg);
    opacity: 0.2;
  }
  25% {
    transform: translateY(-12px) translateX(6px) rotate(90deg);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-6px) translateX(-6px) rotate(180deg);
    opacity: 0.5;
  }
  75% {
    transform: translateY(-18px) translateX(4px) rotate(270deg);
    opacity: 0.3;
  }
}

.animate-float {
  animation: float 6s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
  will-change: transform, opacity;
}

.float-1 {
  top: -0.5rem;
  right: 0.5rem;
  animation-delay: 0s;
}

.float-2 {
  top: 1rem;
  right: -0.5rem;
  animation-delay: 1.3s;
}

.float-3 {
  top: 2rem;
  right: 1rem;
  animation-delay: 2.6s;
}

/* Smooth entrance animation */
.floating-theme-toggle {
  animation: slideInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideInUp {
  0% {
    transform: translateY(100px) scale(0.6) rotate(20deg);
    opacity: 0;
  }
  60% {
    transform: translateY(-10px) scale(1.05) rotate(-5deg);
    opacity: 0.8;
  }
  100% {
    transform: translateY(0) scale(1) rotate(0deg);
    opacity: 1;
  }
}

/* Custom pulse animation for the ring */
@keyframes smoothPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.02);
    opacity: 0.6;
  }
}

.animate-pulse {
  animation: smoothPulse 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
}
</style>