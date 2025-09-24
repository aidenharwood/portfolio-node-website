<template>
  <section class="flex py-3 px-6 mx-8 content-center justify-center
    fixed bottom-0 left-0 right-0
    lg:top-0 lg:bottom-auto lg:translate-x-0
    z-50
  ">
    <nav class="flex items-center justify-between px-6 py-3 bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl shadow-lg shadow-background/20 min-w-fit">
      <!-- Navigation Links -->
      <div class="flex items-center space-x-1 lg:space-x-2">
        <div v-for="link in links" :key="link.route" class="relative">
          <router-link 
            :to="link.route" 
            class="flex flex-col lg:flex-row items-center px-3 py-2 lg:px-4 lg:py-2 rounded-xl transition-all duration-200 ease-out group relative overflow-hidden"
            :class="{ 
              'text-accent bg-accent/10': isCurrentRoute(link.route),
              'text-muted-foreground hover:text-foreground hover:bg-muted/50': !isCurrentRoute(link.route)
            }"
          >
            <!-- Background highlight for active state -->
            <div 
              v-if="isCurrentRoute(link.route)"
              class="absolute inset-0 bg-accent/5 rounded-xl"
            ></div>
            
            <i :class="`pi ${link.icon} text-lg lg:text-base relative z-10`"></i>
            <span class="text-xs lg:text-sm font-medium lg:ml-2 mt-1 lg:mt-0 relative z-10">
              {{ link.name }}
            </span>
            
            <!-- Subtle hover effect -->
            <div class="absolute inset-0 bg-accent/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </router-link>
        </div>
      </div>
    </nav>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const links = ref([
  { name: 'Home', route: '/', icon: 'pi-home' },
  { name: 'Blog', route: '/blog', icon: 'pi-file-edit' },
  { name: 'Projects', route: '/projects', icon: 'pi-briefcase' },
  { name: 'BL4 Editor', route: '/bl4-save-editor', icon: 'pi-cog' }
]);

const isCurrentRoute = (linkRoute: string) => {
  // For exact home route
  if (linkRoute === '/' && route.path === '/') {
    return true;
  }
  // For other routes, check if current path starts with the link route (and it's not just '/')
  if (linkRoute !== '/' && route.path.startsWith(linkRoute)) {
    return true;
  }
  return false;
};
</script>
