<template>
  <section class="text-left ">
    <ul>
      <li v-for="post in posts" :key="post.slug" class="hover:bg-slate-800/50 transition-colors rounded-lg mb-4">
        <router-link :to="`/blog/${post.slug}`">
          <section class="flex-col">
            <h1 class="text-slate-300 text-3xl font-bold">{{ post.title }}</h1>
            <em><h2 class="text-md font-extralight text-slate-500">{{ post.date }}</h2></em>
          </section>
          <p class="text-slate-500">{{ post.excerpt }}</p>
        </router-link>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { type BlogPostMeta, getAllPosts } from '@/utils/blog'
const posts = ref<BlogPostMeta[]>([])
onMounted(async () => {
  posts.value = await getAllPosts()
})
</script>