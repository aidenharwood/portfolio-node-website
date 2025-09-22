<template>
  <article 
    class="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:border-accent/50 hover:-translate-y-1 transition-all duration-300 relative z-0 hover:z-10"
    :class="{ 'lg:col-span-1': featured }"
  >
    <router-link :to="`/projects/${project.slug}`" class="block h-full">
      <!-- Project Image -->
      <div class="aspect-video bg-gradient-to-br from-secondary/30 to-secondary/10 relative overflow-hidden">
        <img 
          v-if="project.image" 
          :src="project.image" 
          :alt="project.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div 
          v-else 
          class="w-full h-full flex flex-col items-center justify-center text-muted-foreground"
        >
          <!-- Tech Icon Pattern -->
          <div class="relative">
            <i class="pi pi-code text-4xl mb-2"></i>
            <!-- Subtle animated dots -->
            <div class="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <div class="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-accent/60 rounded-full animate-pulse" style="animation-delay: 0.5s;"></div>
          </div>
          <span class="text-xs font-medium opacity-60">{{ project.title }}</span>
        </div>
        
        <!-- Status Badges -->
        <div class="absolute top-3 left-3 flex gap-2">
          <span v-if="featured" class="bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium shadow-lg">
            ⭐ Featured
          </span>
          <span v-if="project.demo" class="bg-green-500/90 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
            Live
          </span>
        </div>

        <!-- Quick Action Overlay -->
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 text-white text-sm font-medium">
              View Project →
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 flex flex-col h-full">
        <!-- Title and Description -->
        <div class="mb-4 flex-grow">
          <div class="flex items-start justify-between mb-3">
            <h3 class="text-xl font-bold text-foreground group-hover:text-accent transition-colors leading-tight">
              {{ project.title }}
            </h3>
            <!-- Project Type Icon -->
            <div class="ml-3 flex-shrink-0">
              <div class="w-8 h-8 bg-accent/10 border border-accent/20 rounded-lg flex items-center justify-center">
                <i class="pi pi-desktop text-accent"></i>
              </div>
            </div>
          </div>
          
          <!-- Excerpt/Description -->
          <p class="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {{ project.excerpt || project.description }}
          </p>
        </div>

        <!-- Tech Stack -->
        <div v-if="project.tags && project.tags.length > 0" class="mb-5">
          <div class="flex flex-wrap gap-1.5">
            <!-- Primary tech tags (first 3) -->
            <span 
              v-for="tag in project.tags.slice(0, 3)" 
              :key="tag"
              class="px-2.5 py-1 bg-accent/10 text-accent border border-accent/20 rounded-md text-xs font-medium hover:bg-accent/20 transition-colors"
            >
              {{ tag }}
            </span>
            <!-- Secondary tags -->
            <span 
              v-for="tag in project.tags.slice(3, 5)" 
              :key="tag"
              class="px-2.5 py-1 bg-secondary text-secondary-foreground rounded-md text-xs font-medium"
            >
              {{ tag }}
            </span>
            <!-- Overflow indicator -->
            <span 
              v-if="project.tags.length > 5" 
              class="px-2.5 py-1 bg-secondary/50 text-muted-foreground rounded-md text-xs flex items-center"
              :title="project.tags.slice(5).join(', ')"
            >
              +{{ project.tags.length - 5 }}
              <i class="pi pi-question-circle ml-1 text-xs"></i>
            </span>
          </div>
        </div>

        <!-- Stats and Meta Info -->
        <div class="mb-4 grid grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div class="flex items-center">
            <i class="pi pi-calendar mr-1.5 text-xs"></i>
            <time>{{ formatDate(project.date) }}</time>
          </div>
          <div class="flex items-center">
            <i class="pi pi-clock mr-1.5 text-xs"></i>
            <span>{{ getReadTime(project.description) }} min read</span>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-between pt-4 border-t border-border mt-auto">
          <!-- External Links -->
          <div class="flex items-center gap-1">
            <a 
              v-if="project.github" 
              :href="project.github"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-lg transition-all duration-200"
              @click.stop
              title="View on GitHub"
            >
              <i class="pi pi-github"></i>
            </a>
            
            <a 
              v-if="project.demo" 
              :href="project.demo"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-lg transition-all duration-200"
              @click.stop
              title="View Live Demo"
            >
              <i class="pi pi-external-link"></i>
            </a>

            <!-- Project Status -->
            <div class="ml-2">
              <span 
                v-if="project.demo" 
                class="inline-flex items-center text-xs text-green-600 dark:text-green-400"
                title="Project is live"
              >
                <div class="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
                Active
              </span>
              <span 
                v-else-if="project.github" 
                class="inline-flex items-center text-xs text-blue-600 dark:text-blue-400"
                title="Source available"
              >
                <div class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></div>
                Open Source
              </span>
            </div>
          </div>

          <!-- Read More CTA -->
          <div class="flex items-center text-accent font-medium group-hover:text-accent/80 transition-colors">
            <span class="text-sm">View Details</span>
            <i class="pi pi-chevron-right ml-1 transform group-hover:translate-x-1 transition-transform duration-200"></i>
          </div>
        </div>
      </div>
    </router-link>
  </article>
</template>

<script setup lang="ts">
import type { ProjectMeta } from '@/lib/projects'
import { formatDate, getReadTime } from '@/lib/utils'

interface Props {
  project: ProjectMeta
  featured?: boolean
}

withDefaults(defineProps<Props>(), {
  featured: false
})
</script>