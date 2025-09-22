<template>
  <section v-if="project" class="w-full max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <!-- Back Button -->
      <router-link 
        to="/projects" 
        class="inline-flex items-center text-muted-foreground hover:text-accent transition-colors mb-6"
      >
        <i class="pi pi-chevron-left mr-2"></i>
        Back to Projects
      </router-link>

      <!-- Project Header -->
      <div class="space-y-4">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h1 class="text-4xl font-bold text-foreground mb-2">{{ project.title }}</h1>
            <p class="text-lg text-muted-foreground mb-4">{{ project.description }}</p>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex items-center gap-3 ml-6">
            <a 
              v-if="project.github" 
              :href="project.github"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <i class="pi pi-github mr-2"></i>
              GitHub
            </a>
            
            <a 
              v-if="project.demo" 
              :href="project.demo"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
            >
              <i class="pi pi-external-link mr-2"></i>
              Live Demo
            </a>
          </div>
        </div>

        <!-- Meta Information -->
        <div class="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <div class="flex items-center">
            <i class="pi pi-calendar mr-2"></i>
            <time>{{ formatDate(project.date) }}</time>
          </div>

          <div v-if="project.featured" class="flex items-center">
            <i class="pi pi-star mr-2"></i>
            Featured Project
          </div>
        </div>

        <!-- Tags -->
        <div v-if="project.tags && project.tags.length > 0" class="flex flex-wrap gap-2">
          <span 
            v-for="tag in project.tags" 
            :key="tag"
            class="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <!-- Project Image -->
    <div v-if="project.image" class="mb-8">
      <div class="aspect-video bg-secondary/20 rounded-xl overflow-hidden">
        <img 
          :src="project.image" 
          :alt="project.title"
          class="w-full h-full object-cover"
        />
      </div>
    </div>

    <!-- Project Content -->
    <MarkdownRenderer 
      :content="project.rawContent || ''" 
      class="
        prose prose-lg max-w-none
        space-y-6
        /* Inline/block code */
        [&_code]:text-sm 
        [&_code]:font-mono
        [&_code]:bg-secondary
        [&_code]:text-secondary-foreground
        [&_code]:px-1 
        [&_code]:py-1 
        [&_code]:rounded 
        /* Code blocks */
        [&_pre]:text-foreground
        [&_pre]:my-6 
        [&_pre]:overflow-x-auto 
        [&_pre]:leading-6
        [&_pre_div.code-header]:text-xs 
        [&_pre_div.code-header]:px-2
        [&_pre_div.code-header]:py-1 
        [&_pre_div.code-header]:border-b
        [&_pre_div.code-header]:border-border
        [&_pre]:bg-muted
        [&_pre]:border
        [&_pre]:border-border
        [&_pre]:p-4 
        [&_pre]:rounded-2xl
        [&_pre_code]:block 
        [&_pre_code]:w-full
        [&_pre_code]:bg-transparent 
        [&_pre_code]:overflow-x-auto 
        /* Headings */
        [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-foreground [&_h1]:mt-8 [&_h1]:mb-4
        [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-4
        [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-3
        [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-foreground [&_h4]:mt-6 [&_h4]:mb-3
        /* Paragraphs and text */
        [&_p]:text-foreground [&_p]:leading-relaxed [&_p]:mb-4
        [&_strong]:font-semibold [&_strong]:text-foreground
        [&_em]:italic
        /* Lists */
        [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4
        [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4
        [&_li]:text-foreground [&_li]:mb-1
        /* Links */
        [&_a]:text-accent [&_a]:hover:text-accent/80 [&_a]:underline
        /* Blockquotes */
        [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_blockquote]:italic
        /* Images */
        [&_img]:mx-auto [&_img]:object-cover [&_img]:object-center [&_img]:rounded-lg
      " 
    />
  </section>

  <!-- Loading State -->
  <section v-else-if="project === undefined" class="w-full max-w-4xl mx-auto">
    <div class="flex justify-center items-center py-12">
      <div class="flex flex-col items-center gap-4">
        <i class="pi pi-spin pi-spinner text-3xl text-accent"></i>
        <span class="text-muted-foreground text-lg">Loading project...</span>
      </div>
    </div>
  </section>

  <!-- Not Found State -->
  <section v-else class="w-full max-w-4xl mx-auto text-center py-12">
    <div class="text-muted-foreground">
      <i class="pi pi-file-excel text-4xl block mx-auto mb-4"></i>
      <h1 class="text-2xl font-bold mb-2">Project Not Found</h1>
      <p class="mb-6">The project you're looking for doesn't exist.</p>
      <router-link 
        to="/projects" 
        class="inline-flex items-center px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
      >
        <i class="pi pi-chevron-left mr-2"></i>
        Back to Projects
      </router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUpdated, nextTick, ref } from 'vue'
import { useRoute } from 'vue-router'
import { type ProjectMeta, fetchProject } from '@/lib/projects'
import { formatDate } from '@/lib/utils'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import hljs from 'highlight.js'
import highlightBicep from '@/lib/highlight.bicep'

hljs.registerLanguage('bicep', highlightBicep)

const route = useRoute()
const project = ref<ProjectMeta | null>()

// Dynamically import mermaid only on client
let mermaid: any = null
const loadMermaid = async () => {
  if (!mermaid && typeof window !== 'undefined') {
    mermaid = (await import('mermaid')).default
    mermaid.initialize({ startOnLoad: false, theme: 'dark' })
  }
}

const renderMermaid = async () => {
  await loadMermaid()
  if (mermaid) {
    // Find all mermaid divs and render them
    const mermaidDivs = document.querySelectorAll('.mermaid')
    mermaidDivs.forEach((el) => {
      try {
        mermaid.run({ nodes: [el as HTMLElement] })
      } catch (e) {
        // fallback: show error in the div
        el.innerHTML = `<pre style="color:red;">Mermaid render error: ${e}</pre>`
      }
    })
  }
}

const updateProject = async () => {
  fetchProject(route.params.slug as string).then(async fetchedProject => {
    project.value = fetchedProject
    await nextTick()
    hljs.highlightAll()
    await renderMermaid()
  })
}

onMounted(async () => {
  await updateProject()
})

onUpdated(async () => {
  hljs.highlightAll()
  await renderMermaid()
})
</script>