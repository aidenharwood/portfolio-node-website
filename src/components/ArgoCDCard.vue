<template>
  <section
    class="flex overflow-clip flex-col px-2 px-6 py-6 text-center bg-slate-800 rounded-2xl shadow-2xl justify-items-center justify-content-center space-y-4">
    <a v-for="badge in badges" :href="badge.appUrl">
      <img :src="badge.badgeUrl" :alt="badge.appName" :href="badge.appUrl" />
    </a>

  </section>
</template>
<script setup lang="ts">
import { getBadges, type BadgesResponse } from '@/lib/argocd'
import { ref, onMounted, onUpdated } from 'vue'

const badges = ref<BadgesResponse[] | null>()

onMounted(async () => {
  badges.value = await getBadges()
})
onUpdated(async () => {
  badges.value = await getBadges()
})

</script>