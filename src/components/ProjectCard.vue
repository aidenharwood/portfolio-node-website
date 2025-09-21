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
            <svg class="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
            </svg>
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
                <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                </svg>
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
              <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </span>
          </div>
        </div>

        <!-- Stats and Meta Info -->
        <div class="mb-4 grid grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div class="flex items-center">
            <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <time>{{ formatDate(project.date) }}</time>
          </div>
          <div class="flex items-center">
            <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
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
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
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
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
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
            <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
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