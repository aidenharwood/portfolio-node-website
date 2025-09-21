<template>
  <div class="my-8 p-6 bg-gradient-to-br from-accent/5 to-secondary/10 border border-accent/30 rounded-2xl">
    <div class="flex items-center space-x-3 mb-4">
      <div class="relative">
        <div class="w-4 h-4 bg-accent rounded-full animate-ping absolute"></div>
        <div class="w-4 h-4 bg-accent rounded-full"></div>
      </div>
      <h3 class="text-xl font-semibold text-accent">{{ title }}</h3>
    </div>
    
    <div class="space-y-4">
      <p class="text-muted-foreground leading-relaxed">
        This is a dynamic callout component that can be embedded in your markdown content 
        with custom styling and interactive elements.
      </p>
      
      <div class="flex flex-wrap gap-2">
        <span 
          v-for="tag in tags" 
          :key="tag"
          class="px-3 py-1 text-sm bg-accent/10 text-accent rounded-full border border-accent/20"
        >
          {{ tag }}
        </span>
      </div>
      
      <div v-if="type === 'info'" class="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span class="font-medium">Information</span>
      </div>
      
      <div v-else-if="type === 'warning'" class="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.316 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <span class="font-medium">Warning</span>
      </div>
      
      <div v-else-if="type === 'success'" class="flex items-center space-x-2 text-green-600 dark:text-green-400">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span class="font-medium">Success</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  type?: 'info' | 'warning' | 'success' | 'default';
  tags?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Callout',
  type: 'default',
  tags: ''
});

// Parse comma-separated tags
const tags = computed(() => {
  return props.tags ? props.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
});

import { computed } from 'vue';
</script>