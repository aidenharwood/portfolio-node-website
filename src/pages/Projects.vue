<template>
  <section class="w-full max-w-6xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <p class="text-lg text-muted-foreground">
        A collection of my work in DevOps, cloud infrastructure, and web development
      </p>
    </div>

    <!-- Featured Projects -->
    <div v-if="featuredProjects.length > 0" class="mb-12">
      <h2 class="text-2xl font-semibold text-foreground mb-6">Featured Projects</h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProjectCard 
          v-for="project in featuredProjects" 
          :key="project.slug" 
          :project="project"
          :featured="true"
        />
      </div>
    </div>

    <!-- All Projects -->
    <div v-if="otherProjects.length > 0">
      <h2 class="text-2xl font-semibold text-foreground mb-6">All Projects</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProjectCard 
          v-for="project in otherProjects" 
          :key="project.slug" 
          :project="project"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="flex flex-col items-center gap-4">
        <svg class="animate-spin h-12 w-12 text-accent" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <span class="text-muted-foreground">Loading projects...</span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && projects.length === 0" class="text-center py-12">
      <div class="text-muted-foreground">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
        <h3 class="text-lg font-medium mb-2">No projects yet</h3>
        <p>Check back soon for new projects!</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { type ProjectMeta, getAllProjects } from '@/lib/projects'
import ProjectCard from '@/components/ProjectCard.vue'

const projects = ref<ProjectMeta[]>([])
const loading = ref(true)

const featuredProjects = computed(() => 
  projects.value.filter(project => project.featured)
)

const otherProjects = computed(() => 
  projects.value.filter(project => !project.featured)
)

onMounted(async () => {
  try {
    projects.value = await getAllProjects()
  } catch (error) {
    console.error('Failed to load projects:', error)
  } finally {
    loading.value = false
  }
})
</script>
