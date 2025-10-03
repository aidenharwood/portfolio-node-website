import { createRouter, createWebHistory } from "vue-router";
import { PageComponent } from "./route-helpers";

// Import actual page components (not view wrappers)
import Home from "@/pages/Home.vue";
import BlogList from "@/pages/BlogList.vue";
import BlogPost from "@/pages/BlogPost.vue";
import Projects from "@/pages/Projects.vue";
import ProjectDetail from "@/pages/ProjectDetail.vue";
import { Terminal } from "@/components";

const routes = [
  { path: "/", component: PageComponent({ component: Home, showArgoCDCard: true }) },
  { path: "/blog", component: PageComponent({ component: BlogList }) },
  { path: "/blog/:slug", component: PageComponent({ component: BlogPost }) },
  { path: "/projects", component: PageComponent({ component: Projects }) },
  { path: "/projects/:slug", component: PageComponent({ component: ProjectDetail }) },
  { path: '/terminal', component: PageComponent({ component: Terminal, renderLayout: false }) },
  { path: '/bl4-save-editor', redirect: () => { window.location.href = 'https://bl4editor.aidenharwood.uk/'; } },
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
