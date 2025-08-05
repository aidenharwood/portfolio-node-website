<template>
  <section v-if="post">
    <section class="items-center justify-start gap-x-4 mb-10">
      <h1 class="text-3xl font-bold w-full">{{ post.title }}</h1>
      <em>
        <h2 class="text-md font-extralight text-slate-500 w-full ">{{ post.date }}</h2>
      </em>
    </section>
    <div
  v-html="post.body"
  class="
    space-y-2
    min-w-0
    max-w-full
    overflow-x-auto
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
    [&_pre_code]:overflow-x-auto 
    /* List items */
    [&_li]:list-disc
    [&_li]:ml-4
    /* Images */
    [&_img]:object-cover 
    [&_img]:object-center
    [&_a]:text-blue-400 
    [&_a]:hover:text-blue-600
    [&_h1]:text-2xl 
    [&_h2]:text-xl 
    [&_h3]:text-lg
  "
></div>
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
import { onMounted, onUpdated, ref } from 'vue'
import { useRoute } from 'vue-router'
import { type BlogPostMeta, fetchPost } from '@/utils/blog'
import hljs from 'highlight.js'
const route = useRoute()
const post = ref<BlogPostMeta | null>()

const updatePost = async () => {
  // This will ensure the post is fetched when the component is mounted
  fetchPost(route.params.slug as string).then(fetchedPost => {
    post.value = fetchedPost
  })
}
onMounted(() => {
  updatePost()
});
onUpdated(() => {
  hljs.highlightAll();
});
</script>