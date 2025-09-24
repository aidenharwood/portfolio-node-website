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
        <i class="pi pi-spin pi-spinner text-3xl text-accent"></i>
        <span class="text-muted-foreground">Loading projects...</span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && projects.length === 0" class="text-center py-12">
      <div class="text-muted-foreground">
        <i class="pi pi-folder-open text-4xl block mx-auto mb-4"></i>
        <h3 class="text-lg font-medium mb-2">No projects yet</h3>
        <p>Check back soon for new projects!</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { type ProjectMeta, getAllProjects } from '@/lib/projects'
import ProjectCard from '@/components/cards/ProjectCard.vue'

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
