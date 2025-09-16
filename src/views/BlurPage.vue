<template>
  <div class="wrap">
    <!-- 背景（可换成你的品牌渐变或图像） -->
    <div class="bg"></div>

    <!-- 顶部返回/Logo -->
    <div class="topbar">
      <RouterLink to="/" class="back">← 返回</RouterLink>
      <div class="brand">Oakflat Digital</div>
    </div>

    <!-- 毛玻璃内容卡 -->
    <main class="glass">
      <h1>第二页 · 高斯模糊视图</h1>
      <p>这里放你需要的“放大/聚焦”内容、或者 Roadmap 的更详细交互。</p>
      <p>样例只是展示风格：半透明 + 背景高斯模糊。</p>
    </main>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.wrap{ min-height:100svh; position:relative; overflow:hidden; }

/* 背景：柔和渐变 + 远处光斑（可替换成你的图） */
.bg{
  position:absolute; inset:0;
  background:
    radial-gradient(400px 300px at 15% 15%, rgba(158,197,255,.55), transparent 60%),
    radial-gradient(500px 360px at 85% 20%, rgba(203,168,255,.45), transparent 65%),
    linear-gradient(120deg, #f7faff 0%, #f0f5ff 100%);
  filter: saturate(1.05);
}

/* 顶部条 */
.topbar{
  position:fixed; inset:0 0 auto 0; height:64px; display:flex; align-items:center;
  justify-content:space-between; padding:0 24px; z-index:5;
}
.back{ color:#111; text-decoration:none; font-weight:600; }
.brand{ font-weight:800; color:#111; }

/* 毛玻璃卡片 */
.glass{
  position:relative; z-index:4;
  width:min(920px, 92vw);
  margin: 18vh auto 0;
  padding: clamp(24px, 4vw, 40px);
  border-radius: 28px;

  background: rgba(255,255,255,.42);
  -webkit-backdrop-filter: blur(18px) saturate(120%);
  backdrop-filter: blur(18px) saturate(120%);
  box-shadow: 0 30px 80px rgba(0,0,0,.12);
  border: 1px solid rgba(255,255,255,.35);
}
.glass h1{ margin:0 0 8px; font-size: clamp(24px, 3.6vw, 40px); }
.glass p{ margin:8px 0; color:#333; line-height:1.7; }

/* 进入动画（可选） */
@keyframes fadeUp{
  from{ opacity:0; transform: translateY(12px); }
  to{ opacity:1; transform: none; }
}
.glass{ animation: fadeUp .5s ease-out both; }
</style>
