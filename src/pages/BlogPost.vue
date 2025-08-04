<template>
  <section v-if="post">
    <section class="flex-row">
      <h1 class="text-3xl">{{ post.title }}</h1>
      <h2 class="text-xl">{{ post.date }}</h2>
    </section>
    <br />
    <div v-html="post.body"></div>
  </section>
  <section v-else>
    <p class="text-gray-300 max-w-2xl mx-auto mb-8">Loading...</p>
  </section>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { getAllPosts } from '@/utils/blog'

const route = useRoute()
const posts = getAllPosts()
const post = posts.find(p => p.slug === route.params.slug)
</script>