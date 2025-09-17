import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import SectionScaffold from '@/views/sections/SectionScaffold.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'dashboard', component: Dashboard },
  {
    path: '/roadmap',
    name: 'roadmap',
    component: SectionScaffold,
    props: {
      title: '技术路线图',
      description: '我们正在编排 Oakflat Digital 的技术路线图，稍后将展示详细章节。',
    },
  },
  {
    path: '/milestones',
    name: 'milestones',
    component: SectionScaffold,
    props: {
      title: '节点',
      description: '节点页面将用于拆分关键里程碑，目前为空白占位。',
    },
  },
  {
    path: '/status',
    name: 'status',
    component: SectionScaffold,
    props: {
      title: '状态',
      description: '状态面板即将汇总各项任务进度，在此之前保持空白。',
    },
  },
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
