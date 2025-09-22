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
             <i class="pi pi-calendar mr-1.5 text-xs"></i>
            <time>{{ formatDate(post.date) }}</time>
            
            <!-- Post Excerpt -->
            <p class="text-muted-foreground leading-relaxed line-clamp-3">
              {{ post.excerpt }}
            </p>
            
            <!-- Read More Link -->
            <div class="flex items-center text-accent font-medium group-hover:text-accent/80 transition-colors">
              <span>Read more</span>
              <i class="pi pi-chevron-right ml-1 transform group-hover:translate-x-1 transition-transform"></i>
            </div>
          </div>
        </router-link>
      </article>
    </div>

    <!-- Empty State -->
    <div v-if="posts.length === 0" class="text-center py-12">
      <div class="text-muted-foreground">
        <i class="pi pi-file-o text-4xl block mx-auto mb-4"></i>
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