<template>
  <main class="section">
    <header class="section__header">
      <RouterLink to="/" class="section__back">← 返回概览</RouterLink>
    </header>

    <section class="section__body">
      <div class="section__content">
        <h1 class="section__title">{{ title }}</h1>
        <p v-if="description" class="section__description">{{ description }}</p>
        <div class="section__placeholder" aria-hidden="true"></div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{ title: string; description?: string }>()
</script>

<style scoped>
.section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #f9fbff 0%, #ffffff 48%, #f6f7f9 100%);
  color: #1f2937;
}

.section__header {
  display: flex;
  justify-content: flex-start;
  padding: 32px;
}

.section__back {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  text-decoration: none;
  color: #4f46e5;
  font-weight: 600;
  padding: 8px 18px 8px 38px;
  border-radius: 999px;
  background: rgba(79, 70, 229, 0.08);
  transition: background 0.24s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.24s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.24s cubic-bezier(0.16, 1, 0.3, 1);
}

.section__back::before {
  content: '';
  position: absolute;
  left: 16px;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: currentColor;
  transform: scale(0.6);
  opacity: 0.6;
  transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.24s ease;
}

.section__back:hover {
  background: rgba(79, 70, 229, 0.16);
  transform: translateX(-3px);
  box-shadow: 0 10px 30px rgba(79, 70, 229, 0.18);
}

.section__back:hover::before {
  transform: scale(1);
  opacity: 1;
}

.section__back:active {
  transform: translateX(-1px) scale(0.98);
}

.section__body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px 96px;
}

.section__content {
  max-width: 720px;
  width: 100%;
  text-align: center;
  display: grid;
  gap: 24px;
}

.section__title {
  font-size: clamp(36px, 5vw, 54px);
  font-weight: 800;
  margin: 0;
}

.section__description {
  font-size: 18px;
  color: rgba(17, 24, 39, 0.75);
  margin: 0;
  line-height: 1.6;
}

.section__placeholder {
  height: 260px;
  border-radius: 32px;
  background: repeating-linear-gradient(
      -45deg,
      rgba(99, 102, 241, 0.08),
      rgba(99, 102, 241, 0.08) 24px,
      rgba(99, 102, 241, 0.16) 24px,
      rgba(99, 102, 241, 0.16) 48px
    );
  box-shadow: 0 24px 60px rgba(79, 70, 229, 0.12);
}
</style>
