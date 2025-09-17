import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'

const routes: RouteRecordRaw[] = [{ path: '/', name: 'dashboard', component: Dashboard }]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
