import { createWebHistory, createRouter } from 'vue-router'
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
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router