<template>
  <section class="w-full max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <p class="text-lg text-muted-foreground">Thoughts on DevOps, cloud infrastructure, and technology</p>
    </div>

    <!-- Blog Posts Grid -->
    <div class="space-y-6">
      <article 
        v-for="post in posts" 
        :key="post.slug" 
        class="group bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-accent/50 transition-all duration-300"
      >
        <router-link :to="`/blog/${post.slug}`" class="block">
          <div class="space-y-3">
            <!-- Post Title -->
            <h2 class="text-2xl font-bold text-foreground group-hover:text-accent transition-colors">
              {{ post.title }}
            </h2>
            
            <!-- Post Date -->
            <time class="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {{ formatDate(post.date) }}
            </time>
            
            <!-- Post Excerpt -->
            <p class="text-muted-foreground leading-relaxed line-clamp-3">
              {{ post.excerpt }}
            </p>
            
            <!-- Read More Link -->
            <div class="flex items-center text-accent font-medium group-hover:text-accent/80 transition-colors">
              <span>Read more</span>
              <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </router-link>
      </article>
    </div>

    <!-- Empty State -->
    <div v-if="posts.length === 0" class="text-center py-12">
      <div class="text-muted-foreground">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="text-lg font-medium mb-2">No posts yet</h3>
        <p>Check back soon for new content!</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { type BlogPostMeta, getAllPosts } from '@/lib/blog'
import { formatDate } from '@/lib/utils'

const posts = ref<BlogPostMeta[]>([])

onMounted(async () => {
  posts.value = await getAllPosts()
})
</script>