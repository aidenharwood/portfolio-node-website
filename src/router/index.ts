import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import BlogList from '@/pages/BlogList.vue'
import BlogPost from '@/pages/BlogPost.vue'
import Projects from '@/pages/Projects.vue'

const routes = [
  { path: '/', component: Home},
  { path: '/blog', component: BlogList},
  { path: '/blog/:slug', component: BlogPost},
  { path: '/projects', component: Projects},
//   { path: '/experience', component: Experience, name: 'Experience' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router