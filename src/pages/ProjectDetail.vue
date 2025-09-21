<template>
  <section v-if="project" class="w-full max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <!-- Back Button -->
      <router-link 
        to="/projects" 
        class="inline-flex items-center text-muted-foreground hover:text-accent transition-colors mb-6"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
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
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
            
            <a 
              v-if="project.demo" 
              :href="project.demo"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
              Live Demo
            </a>
          </div>
        </div>

        <!-- Meta Information -->
        <div class="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <time>{{ formatDate(project.date) }}</time>
          </div>

          <div v-if="project.featured" class="flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
            </svg>
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
        <svg class="animate-spin h-12 w-12 text-accent" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <span class="text-muted-foreground text-lg">Loading project...</span>
      </div>
    </div>
  </section>

  <!-- Not Found State -->
  <section v-else class="w-full max-w-4xl mx-auto text-center py-12">
    <div class="text-muted-foreground">
      <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
      <h1 class="text-2xl font-bold mb-2">Project Not Found</h1>
      <p class="mb-6">The project you're looking for doesn't exist.</p>
      <router-link 
        to="/projects" 
        class="inline-flex items-center px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
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