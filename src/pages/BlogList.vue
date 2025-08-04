<template>
  <section class="text-left">
    <h1 class="text-3xl font-bold mb-4">Blog</h1>
    <p class="text-gray-300 mb-8">
      Welcome to my blog!
    </p>
    <ul>
      <li v-for="post in getAllPosts()" :key="post.slug">
        <router-link :to="`/blog/${post.slug}`">
          <section class="flex-col">
            <h1 class="text-slate-300 text-3xl font-bold">{{ post.title }}</h1>
            <h2 class="text-lg text-slate-400">{{ post.date }}</h2>
          </section>
          <p class="text-slate-500">{{ post.excerpt }}</p>
        </router-link>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { getAllPosts } from '@/utils/blog'
// const posts = getAllPosts()
</script>