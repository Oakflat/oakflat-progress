<template>
  <div class="page">
    <section class="hero-block">
      <div class="hero-banner">
        <div class="hero-media" aria-hidden="true"></div>
        <div class="hero-overlay">
          <p class="eyebrow">Oakflat Digital · 2025 研发冲刺 / Product Engineering Sprint</p>
          <h1>技术路线图实时快照<br />Roadmap live snapshot</h1>
          <p class="lede">
            每日同步最新进展，梳理交付节奏与依赖，帮助团队快速锁定重点。
            <br />
            Capture current builds, dependencies, and launch gates in one evolving view.
          </p>
          <div class="actions">
            <button type="button" class="primary" @click="openSheet">查看路线图 · View roadmap</button>
            <RouterLink class="ghost" to="/status">状态面板 · Status board</RouterLink>
          </div>
          <dl class="stats">
            <div class="stat">
              <dt>活跃模块 / Active modules</dt>
              <dd>7</dd>
            </div>
            <div class="stat">
              <dt>当周节点 / Milestones this week</dt>
              <dd>4</dd>
            </div>
            <div class="stat">
              <dt>交付完成率 / Completion</dt>
              <dd>68%</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <aside class="update-column" aria-label="最新更新 Latest updates">
      <article
        v-for="item in cards"
        :key="item.key"
        class="update-card"
        :class="item.variant"
        @click="openCard(item)"
      >
        <header class="card-head">
          <span class="badge">{{ item.badge }}</span>
          <time :datetime="item.dateISO">{{ item.date }}</time>
        </header>
        <h2>{{ item.title }}</h2>
        <p>{{ item.summary }}</p>
        <footer class="card-footer">
          <span>{{ item.cta }}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 12h10M13 8l4 4-4 4" /></svg>
        </footer>
      </article>
    </aside>
  </div>

  <GlassSheet
    :open="sheetOpen"
    v-model:modelValue="section"
    title="→ 我们现在的工作"
    :items="sheetItems"
    :width="360"
    :left="48"
    :top="96"
    :blur="0"
    :veil="'rgba(16,19,28,.42)'"
    @update:modelValue="onSectionSelect"
    @close="closeSheet"
  >
    <template #default>
      <div class="sheet-body">
        <h3>{{ sheetCopy[section].title }}</h3>
        <p>{{ sheetCopy[section].body }}</p>
        <button type="button" class="primary" @click="navigateSection">立即前往 · Open section</button>
      </div>
    </template>
  </GlassSheet>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import GlassSheet from '@/components/GlassSheet.vue'

type Section = 'roadmap' | 'milestones' | 'status'

type Card = {
  key: Section | 'digest'
  title: string
  summary: string
  badge: string
  cta: string
  date: string
  dateISO: string
  variant?: 'highlight'
}

const router = useRouter()

const sheetItems: Array<{ key: Section; label: string }> = [
  { key: 'roadmap', label: '技术路线图' },
  { key: 'milestones', label: '节点' },
  { key: 'status', label: '状态' },
]

const sheetCopy: Record<Section, { title: string; body: string }> = {
  roadmap: {
    title: '技术路线图 · Roadmap',
    body: '梳理阶段性交付、接口依赖和上线节奏，稍后会补充详细模块。',
  },
  milestones: {
    title: '节点 · Milestones',
    body: '跟踪里程碑的达成情况，提供负责人和阻塞提醒，目前为占位内容。',
  },
  status: {
    title: '状态 · Status',
    body: '汇总看板内关键任务的实时完成度和风险提示，持续打磨中。',
  },
}

const cards = computed<Card[]>(() => [
  {
    key: 'roadmap',
    title: '路线图骨架上线 · Roadmap scaffold live',
    summary: '基础章节结构已对齐设计，正在对接 API 以承载动态数据。',
    badge: '迭代 / Sprint',
    cta: '查看章节 · View section',
    date: '09·17',
    dateISO: '2025-09-17',
    variant: 'highlight',
  },
  {
    key: 'milestones',
    title: '节点甘特草稿 · Milestone gantt draft',
    summary: '完成当前冲刺的阶段拆解，并将依赖映射给后端与设计。',
    badge: '计划 / Planning',
    cta: '打开节点 · Open milestones',
    date: '09·16',
    dateISO: '2025-09-16',
  },
  {
    key: 'status',
    title: '状态仪表联调 · Status telemetry',
    summary: '整合构建、监控和 QA 数据源，准备展示实时完成度。',
    badge: '联调 / Integration',
    cta: '前往状态 · Jump to status',
    date: '09·16',
    dateISO: '2025-09-16',
  },
  {
    key: 'digest',
    title: '每日纪要 · Daily digest',
    summary: '发布最新调研与设计稿更新，保持团队对齐，本节将持续扩充。',
    badge: '资讯 / Digest',
    cta: '阅读更多 · Read more',
    date: '09·15',
    dateISO: '2025-09-15',
  },
])

const sheetOpen = ref(false)
const section = ref<Section>('roadmap')

function openSheet() {
  sheetOpen.value = true
}

function closeSheet() {
  sheetOpen.value = false
}

function onSectionSelect(next: Section) {
  section.value = next
}

function navigateSection() {
  closeSheet()
  router.push({ name: section.value })
}

function openCard(card: Card) {
  if (card.key === 'digest') {
    router.push({ name: 'roadmap', query: { tab: 'digest' } })
    return
  }
  section.value = card.key
  navigateSection()
}
</script>

<style scoped>
.page {
  width: min(1280px, 100%);
  margin: 0 auto;
  padding: clamp(24px, 4vw, 64px) clamp(20px, 5vw, 56px) clamp(48px, 6vw, 72px);
  display: grid;
  gap: clamp(28px, 5vw, 48px);
}

.hero-block {
  display: flex;
}

.hero-banner {
  position: relative;
  width: 100%;
}

.hero-media {
  aspect-ratio: 16 / 9;
  width: 100%;
  border-radius: clamp(18px, 3vw, 32px);
  background: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.18), transparent 55%),
    linear-gradient(135deg, #19273c 0%, #3556ff 60%, #7b3fff 100%);
  filter: saturate(1.05);
}

.hero-overlay {
  position: absolute;
  inset: clamp(18px, 3vw, 32px);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: clamp(16px, 2.6vw, 32px);
  padding: clamp(16px, 2.6vw, 28px) clamp(18px, 3vw, 36px);
  border-radius: clamp(16px, 3vw, 28px);
  backdrop-filter: blur(24px) saturate(1.3);
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.28));
  color: #f9fbff;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.28);
}

.eyebrow {
  margin: 0;
  font-size: clamp(12px, 1.4vw, 14px);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.82;
}

.hero-overlay h1 {
  margin: 0;
  font-size: clamp(36px, 4.6vw, 64px);
  line-height: 1.08;
  font-weight: 800;
}

.lede {
  margin: 0;
  font-size: clamp(15px, 1.6vw, 20px);
  line-height: 1.6;
  max-width: 36ch;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.actions .primary,
.sheet-body .primary {
  border: none;
  border-radius: 999px;
  padding: 12px 22px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #fff;
  background: linear-gradient(135deg, #5e7bff, #8f63ff);
  cursor: pointer;
  transition: transform 0.22s var(--page-ease), box-shadow 0.22s var(--page-ease);
}

.actions .primary:hover,
.sheet-body .primary:hover {
  box-shadow: 0 12px 30px rgba(100, 118, 255, 0.35);
  transform: translateY(-2px);
}

.actions .primary:active,
.sheet-body .primary:active {
  transform: translateY(0);
}

.actions .ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 12px 22px;
  font-size: 15px;
  font-weight: 600;
  color: #cfd8ff;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  transition: background 0.2s ease, color 0.2s ease;
}

.actions .ghost:hover {
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin: 0;
}

.stat {
  display: grid;
  gap: 6px;
}

.stat dt {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.72;
}

.stat dd {
  margin: 0;
  font-size: clamp(22px, 3vw, 32px);
  font-weight: 700;
}

.update-column {
  display: grid;
  gap: clamp(16px, 2vw, 22px);
}

.update-card {
  position: relative;
  border-radius: 24px;
  padding: clamp(20px, 2.2vw, 28px);
  background: rgba(244, 246, 255, 0.9);
  border: 1px solid rgba(100, 112, 255, 0.16);
  box-shadow: 0 12px 34px rgba(15, 23, 42, 0.12);
  display: grid;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.2s var(--page-ease), box-shadow 0.2s var(--page-ease);
}

.update-card.highlight {
  background: linear-gradient(145deg, rgba(92, 111, 255, 0.16), rgba(144, 97, 255, 0.08));
  border-color: rgba(104, 128, 255, 0.32);
}

.update-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.18);
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(98, 112, 255, 0.18);
  color: #273680;
  font-weight: 600;
}

.update-card time {
  color: rgba(15, 23, 42, 0.52);
}

.update-card h2 {
  margin: 0;
  font-size: clamp(20px, 2.6vw, 26px);
  font-weight: 700;
  color: #101526;
}

.update-card p {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: rgba(15, 23, 42, 0.78);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: #3647a8;
}

.card-footer svg {
  width: 24px;
  height: 24px;
  stroke: currentColor;
  stroke-width: 1.8;
  fill: none;
}

.sheet-body {
  display: grid;
  gap: 16px;
  padding: 16px 20px 20px;
}

.sheet-body h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.sheet-body p {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: rgba(15, 23, 42, 0.78);
}

@media (min-width: 1200px) {
  .page {
    grid-template-columns: minmax(0, 8fr) minmax(0, 4fr);
  }
}

@media (min-width: 768px) and (max-width: 1199px) {
  .page {
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  }
}

@media (max-width: 767px) {
  .page {
    grid-template-columns: 1fr;
  }

  .hero-overlay {
    position: relative;
    inset: auto;
    margin-top: -80px;
  }
}

@media (max-width: 520px) {
  .hero-overlay {
    margin-top: -40px;
  }

  .actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
