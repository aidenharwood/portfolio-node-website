import { createRouter, createWebHistory } from 'vue-router'
import About from '@/pages/About.vue'
import Projects from '@/pages/Projects.vue'

const routes = [
  { path: '/', component: About, name: 'About' },
//   { path: '/projects', component: Projects, name: 'Projects' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router