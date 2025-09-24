import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home.vue";
import BlogList from "@/pages/BlogList.vue";
import BlogPost from "@/pages/BlogPost.vue";
import Projects from "@/pages/Projects.vue";
import ProjectDetail from "@/pages/ProjectDetail.vue";
import BL4SaveEditor from "@/pages/BL4SaveEditor.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/blog", component: BlogList },
  { path: "/blog/:slug", component: BlogPost },
  { path: "/projects", component: Projects },
  { path: "/projects/:slug", component: ProjectDetail },
  { path: "/bl4-save-editor", component: BL4SaveEditor },
  //   { path: '/experience', component: Experience, name: 'Experience' },
];

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    // always scroll to top
    return { top: 0 };
  },
  routes,
});

export default router;
