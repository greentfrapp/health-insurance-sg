import { createRouter, createWebHistory } from 'vue-router'
import About from '@/pages/About.vue'
import Main from '@/pages/Main.vue'
import Onboard from '@/pages/Onboard.vue'

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: Onboard,
  },
  {
    path: '/app',
    name: 'App',
    component: Main,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
