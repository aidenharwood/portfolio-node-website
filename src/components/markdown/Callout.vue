<template>
  <div class="my-8 p-6 bg-gradient-to-br from-accent/5 to-secondary/10 border border-accent/30 rounded-2xl">
    <div class="flex items-center space-x-3 mb-4">
      <div class="relative">
        <div class="relative flex items-center justify-center">
          <i v-if="props.animate" :class="`w-4 h-4 pi ${typeIcons[props.type]} ${typeColors[props.type]} animate-ping absolute`"></i>
          <i :class="`w-4 h-4 pi ${typeIcons[props.type]} ${typeColors[props.type]}`"></i>
        </div>
      </div>
      <h3 :class="`text-xl font-semibold text-${typeColors[props.type]}`">{{ title }}</h3>
    </div>
    
    <div class="space-y-4">
      <p class="text-muted-foreground leading-relaxed">
        {{ content }}
      </p>

      <div v-if="tags.length" class="flex flex-wrap gap-2">
        <span
          v-for="tag in tags"
          :key="tag"
          class="px-3 py-1 text-sm bg-accent/10 text-accent rounded-full border border-accent/20"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const typeIcons = {
  info: 'pi-info-circle',
  warning: 'pi-exclamation-triangle',
  success: 'pi-check-circle',
  important: 'pi-exclamation-circle',
  default: 'pi-info-circle'
};

const typeColors = {
  info: 'text-blue-600 dark:text-blue-400',
  warning: 'text-amber-600 dark:text-amber-400',
  success: 'text-green-600 dark:text-green-400',
  important: 'text-red-600 dark:text-red-400',
  default: 'text-gray-600 dark:text-gray-400'
};

interface Props {
  title?: string;
  content?: string;
  type?: 'info' | 'warning' | 'success' | 'default';
  tags?: string;
  animate?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  content: '',
  type: 'default',
  tags: ''
});

// Parse comma-separated tags
const tags = computed(() => {
  return props.tags ? props.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
});
</script>