<template>
  <aside class="rail">
    <ul>
      <li class="muted">→ 我们现在的工作</li>
      <li><RouterLink to="/#roadmap" :class="linkClass('/#roadmap')">技术路线图</RouterLink></li>
      <li><RouterLink to="/#milestones" :class="linkClass('/#milestones')">节点</RouterLink></li>
      <li><RouterLink to="/#status" :class="linkClass('/#status')">状态</RouterLink></li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
const linkClass = (hash: string) =>
  route.fullPath.includes(hash) ? 'active' : ''
</script>

<style scoped>
.rail {
  position: fixed;
  left: clamp(16px, 4vw, 40px);
  top: clamp(88px, 10vh, 120px);
  font-size: clamp(14px, 1.4vw, 18px);
  line-height: 1.9;
  z-index: 10;
}
.muted { color:#7a7a7a; }
a { color:#111; text-decoration:none; }
a:hover { text-decoration:underline; }
.active { font-weight:700; text-decoration:underline; }
@media (max-width: 960px){ .rail{ display:none; } }
</style>
