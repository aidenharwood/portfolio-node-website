<template>
  <section class="flex py-4 px-4 mx-12 content-center justify-center
    fixed bottom-0 left-0 right-0
    md:top-0  md:bottom-auto md:translate-x-0
  ">
    <section
      :class="`flex justify-around px-4 py-2 shadow-xl justify-items-center content-center text-center space-x-0 md:space-x-4 bg-slate-800/80 rounded-xl`">
      <section v-for="link in links" className="flex-1 min-w-[80px] flex flex-col items-center group">
        <router-link :to="link.route" class="hover:text-slate-400 transition-colors">
          <i :class="`pi ${link.icon} text-xl py-2 md:py-0 md:text-xl`"></i>
          <section class="hidden md:block">
            {{ link.name }}
            <section className="hidden md:block h-0.25 bg-slate-400 w-0 group-hover:w-4 transition-all mx-auto">
            </section>
          </section>
        </router-link>
      </section>
    </section>
  </section>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const links = ref([
  { icon: 'pi-home', route: '/', name: 'Home' },
  { icon: 'pi-pen-to-square', route: '/blog', name: 'Blog' },
  { icon: 'pi-folder-open', route: '/projects', name: 'Projects' },
  { icon: 'pi-briefcase', route: '/experience', name: 'Experience' }
])
</script>
