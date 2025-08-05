<template>
  <section v-if="post">
    <section class="items-center justify-start gap-x-4 mb-10">
      <h1 class="text-3xl font-bold h-full">{{ post.title }}</h1>
      <em>
        <h2 class="text-md font-extralight text-slate-500 h-full">{{ post.date }}</h2>
      </em>
    </section>
    <div v-html="post.body" class="
      prose prose-invert space-y-4
      /* Inline/block code */
      [&_code]:bg-slate-800 
      [&_code]:text-slate-400 
      [&_code]:px-1 
      [&_code]:py-1 
      [&_code]:rounded 
      [&_pre]:bg-gray-900 
      [&_pre]:p-4 
      [&_pre]:rounded-2xl
      [&_pre_code]:block 
      [&_pre_code]:w-full 
      [&_pre_code]:bg-transparent 
      /* List items */
      [&_li]:list-disc
      [&_li]:ml-4
      /* Images */
      [&_img]:object-cover 
      [&_img]:object-center
    "></div>
  </section>
  <section v-else>
    <p class="text-center font-bold text-5xl">Content not found</p>
  </section>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import { useRoute } from 'vue-router'
import { type BlogPostMeta, fetchPost } from '@/utils/blog'
const route = useRoute()
const post = ref<BlogPostMeta | null>()

const updatePost = async () => {
  // This will ensure the post is fetched when the component is mounted
  fetchPost(route.params.slug as string).then(fetchedPost => {
    post.value = fetchedPost
  })
}

onMounted(updatePost);
</script>