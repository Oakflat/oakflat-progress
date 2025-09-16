<template>
  <button class="corner" @click="go" :title="title" aria-label="打开第二页">
    <!-- 不引入任何 loader，直接 <img> 即可 -->
    <img :src="iconUrl" alt="" />
  </button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import iconUrl from '@/assets/icons/focus.svg' // 你的 AI 导出的 SVG
const router = useRouter()
defineProps<{ to?: string; title?: string }>()
const go = () => router.push({ path: '/focus' }) // 进入第二页
</script>

<style scoped>
.corner{
  position: fixed;
  left: 16px; bottom: 16px;
  width: 40px; height: 40px;
  border: none; border-radius: 10px;
  background: #f2f2f2; box-shadow: 0 6px 18px rgba(0,0,0,.08);
  display:grid; place-items:center; cursor:pointer; padding:0;
}
.corner img{ width:22px; height:22px; display:block; }
.corner:hover{ background:#eaeaea; }
</style>
