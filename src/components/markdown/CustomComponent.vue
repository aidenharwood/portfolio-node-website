<template>
  <div class="my-6 p-6 bg-accent/5 border border-accent/20 rounded-xl">
    <div class="flex items-center space-x-3 mb-4">
      <div class="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
      <h3 class="text-lg font-semibold text-accent">Custom Component</h3>
    </div>
    <p class="text-muted-foreground mb-4">
      This is a sample custom component that can be embedded in blog posts and projects.
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="p-4 bg-card rounded-lg border">
        <h4 class="font-medium mb-2">Feature 1</h4>
        <p class="text-sm text-muted-foreground">Interactive content can be added here</p>
      </div>
      <div class="p-4 bg-card rounded-lg border">
        <h4 class="font-medium mb-2">Feature 2</h4>
        <p class="text-sm text-muted-foreground">With proper styling and theming</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props can be passed from markdown
interface Props {
  title?: string;
  variant?: 'default' | 'accent' | 'success' | 'warning';
}

withDefaults(defineProps<Props>(), {
  title: 'Custom Component',
  variant: 'default'
});
</script>