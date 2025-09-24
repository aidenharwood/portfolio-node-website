<template>
  <section class="space-y-4" v-if="post">
    <section class="items-center justify-start gap-x-4">
      <!-- Back Button -->
      <router-link to="/blog"
        class="inline-flex items-center text-muted-foreground hover:text-accent transition-colors mb-6">
        <i class="pi pi-chevron-left mr-2"></i>
        Back to Blog
      </router-link>
      <h1 class="text-3xl font-bold w-full">{{ post.title }}</h1>

      <section class="flex flex-wrap items-center text-sm text-muted-foreground space-x-4">
        <span>
          <i class="pi pi-calendar mr-1.5 text-xs"></i>
        <time>{{ formatDate(post.date) }}</time>
        </span>
        <span class="text-xs">•</span>
        <span>
                  <i class="pi pi-clock mr-1.5 text-xs"></i>
        <span class="text-sm">{{ getReadTime(post.rawContent || '') }} min read</span>

        </span>
      </section>
    </section>
    <MarkdownRenderer :content="post.rawContent || ''" class="
      " />
  </section>
  <section v-else class="w-full">
    <section v-if="post === undefined" class="flex justify-center items-center">
      <div class="flex flex-col items-center justify-center gap-2">
        <i class="pi pi-spin pi-spinner text-2xl text-slate-400"></i>
        <span class="text-slate-400 text-lg">Loading post...</span>
      </div>
    </section>
    <section v-else class="w-full max-w-4xl mx-auto text-center py-12">
      <div class="text-muted-foreground">
        <i class="pi pi-file-excel text-4xl block mx-auto mb-4"></i>
        <h1 class="text-2xl font-bold mb-2">Blog Not Found</h1>
        <p class="mb-6">The blog post you're looking for doesn't exist.</p>
        <router-link to="/blog"
          class="inline-flex items-center px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors">
          <i class="pi pi-chevron-left mr-2"></i>
          Back to Blog
        </router-link>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import highlightBicep from '@/lib/highlight.bicep'
import { onMounted, onUpdated, nextTick, ref } from 'vue'
import { useRoute } from 'vue-router'
import { type BlogPostMeta, fetchPost } from '@/lib/blog'
import { formatDate, getReadTime } from '@/lib/utils'
import MarkdownRenderer from '@/components/common/MarkdownRenderer.vue'
import hljs from 'highlight.js'

hljs.registerLanguage('bicep', highlightBicep)

const route = useRoute()
const post = ref<BlogPostMeta | null>()

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

const updatePost = async () => {
  fetchPost(route.params.slug as string).then(async fetchedPost => {
    post.value = fetchedPost
    await nextTick()
    hljs.highlightAll()
    await renderMermaid()
  })
}

onMounted(async () => {
  await updatePost()
})
onUpdated(async () => {
  hljs.highlightAll()
  await renderMermaid()
})
</script>