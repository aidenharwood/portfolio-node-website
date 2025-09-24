<script setup lang="ts">
import { onMounted } from 'vue'
import Navigation from '@/components/Navigation.vue'
import InfoCard from '@/components/InfoCard.vue'
import ArgoCDCard from '@/components/ArgoCDCard.vue'
import FloatingThemeToggle from '@/components/FloatingThemeToggle.vue'
import { useTheme } from '@/composables/useTheme'

// Initialize theme on app startup
const { initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>

<template>
  <main
    class="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 text-foreground transition-all duration-500"
    :class="$route.path === '/bl4-save-editor' ? 'p-4' : 'px-4 lg:px-10 pt-10 lg:pt-30 pb-30 lg:pb-10'">
    
    <!-- BL4SaveEditor gets full page layout -->
    <template v-if="$route.path === '/bl4-save-editor'">
      <router-view class="w-full h-full" />
    </template>
    
    <!-- Standard layout for other pages -->
    <template v-else>
      <Navigation />
      <section
        class="lg:flex w-full lg:space-y-0 space-y-10 justify-items-center justify-center items-start">
        <section class="lg:flex-col space-y-10">
          <InfoCard />
          <v-if v-if="$route.path === '/'">
            <ArgoCDCard />
          </v-if>
        </section>
        <section class="flex flex-col w-full max-w-full items-start lg:px-10 px-0 flex-1 min-w-0 min-h-0
          [&_*::-webkit-scrollbar]:w-0.25
          [&_*::-webkit-scrollbar]:h-2
          [&_*::-webkit-scrollbar-track]:rounded-full
          [&_*::-webkit-scrollbar-track]:bg-transparent
          [&_*::-webkit-scrollbar-thumb]:rounded-full
          [&_*::-webkit-scrollbar-thumb]:bg-muted-foreground/30
           ">
          <router-view class="max-w-full w-full min-w-0 flex-1" />
        </section>
      </section>
    </template>
    
    <!-- Floating Theme Toggle -->
    <FloatingThemeToggle />
  </main>
</template>