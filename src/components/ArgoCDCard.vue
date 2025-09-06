<template>
  <section
    class="flex overflow-clip flex-col px-6 py-6 text-center bg-slate-800 rounded-2xl shadow-2xl justify-items-center justify-content-center space-y-4">
    <section class="flex space-x-4 justify-center">
      <a v-for="link in links" :key="link.url" :href="link.url"
        class="text-slate-300 hover:text-slate-100 transition-colors">
        <img :src="`${link.image}.svg`" :alt="link.image" class="h-8 w-8 inline" />
      </a>
    </section>
    <a v-for="badge in badges" :href="badge.appUrl">
      <img :src="badge.badgeUrl" :alt="badge.appName" :href="badge.appUrl" />
    </a>
  </section>
</template>
<script setup lang="ts">
import { getBadges, type BadgesResponse } from '@/lib/argocd'
import { ref, onMounted, onUpdated } from 'vue'

const getIconUrl = (project: string, prefix?: string) => {
  return `https://github.com/cncf/artwork/blob/main/projects/${project}/icon/color/${prefix ?? `${project}-`}icon-color.png?raw=true`
}

const links = ref([
  {
    image: getIconUrl('argo'),
    url: 'https://argocd.aidenharwood.uk/applications'
  },
  {
    image: getIconUrl('cilium', 'cilium_'),
    url: 'https://hubble.aidenharwood.uk'
  },
  {
    image: `https://github.com/grafana/grafana/blob/main/public/img/grafana_icon.svg?raw=true`,
    url: 'https://grafana.aidenharwood.uk'
  },
])

const badges = ref<BadgesResponse[] | null>()

onMounted(async () => {
  badges.value = await getBadges()
})
onUpdated(async () => {
  badges.value = await getBadges()
})

</script>