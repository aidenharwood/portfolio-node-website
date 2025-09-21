<template>
  <section v-if="post">
    <section class="items-center justify-start gap-x-4">
      <!-- Back Button -->
      <router-link 
        to="/blog" 
        class="inline-flex items-center text-muted-foreground hover:text-accent transition-colors mb-6"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        Back to Blog
      </router-link>
      <h1 class="text-3xl font-bold w-full">{{ post.title }}</h1>
      <em>
        <h2 class="text-md font-extralight text-slate-500 w-full">{{ formatDate(post.date) }}</h2>
      </em>
    </section>
    <MarkdownRenderer 
      :content="post.rawContent || ''" 
      class="
        space-y-4
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
        [&_pre]:my-4 
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
        /* List items */
        [&_ul]:list-disc 
        [&_ol]:list-decimal 
        [&_li]:text-foreground
        [&_li]:px-2 
        [&_li]:ml-6
        /* Tables */
        [&_table]:w-full 
        [&_table]:text-left 
        [&_th]:bg-secondary
        [&_th]:text-secondary-foreground
        [&_th]:px-2 
        [&_th]:py-2
        [&_td]:px-2 
        [&_td]:py-2
        [&_tr]:border-b 
        [&_tr]:border-border
        /* Images */
        [&_img]:mx-auto
        [&_img]:object-cover 
        [&_img]:object-center
        [&_a]:text-accent
        [&_a]:hover:text-accent/80
        [&_h1]:text-2xl 
        [&_h2]:text-xl 
        [&_h3]:text-lg
        [&_h4]:text-base 
        [&_h5]:text-sm 
        [&_h6]:text-xs
        [&_blockquote]:border-l-4 
        [&_blockquote]:border-border
        [&_blockquote]:pl-4 
        [&_blockquote]:text-muted-foreground
        /* Mermaid diagrams */
        [&_pre.mermaid]:bg-muted
        [&_pre.mermaid]:text-foreground
        [&_pre.mermaid]:p-4 
        [&_pre.mermaid]:rounded-lg
        [&_pre.mermaid]:justify-center 
        [&_pre.mermaid]:items-center 
        [&_pre.mermaid]:flex
      " 
    />
  </section>
  <section v-else class="w-full">
    <section v-if="post === undefined" class="flex justify-center items-center">
      <div class="flex flex-col items-center justify-center gap-2">
        <svg class="animate-spin h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <span class="text-slate-400 text-lg">Loading post...</span>
      </div>
    </section>
    <section v-else class="text-center font-bold text-5xl">
      Content not found
      <slot />
    </section>
  </section>
</template>

<script setup lang="ts">
import highlightBicep from '@/lib/highlight.bicep'
import { onMounted, onUpdated, nextTick, ref } from 'vue'
import { useRoute } from 'vue-router'
import { type BlogPostMeta, fetchPost } from '@/lib/blog'
import { formatDate } from '@/lib/utils'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
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