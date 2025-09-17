<template>
  <div class="root" ref="rootEl">
    <!-- 固定层（不随滚动） -->
  <div class="content" :class="{ blurred: sheetOpen }">
    <div class="overlay">
      <div
        class="logo-pill"
        :class="{ hidebg: navHideBg, compact: navCompact }"
        :style="fixedStyle(posData.logo, navCompact, NAV_COMPACT_PILL_SIZE)"
        @click="select('logo')"
      >
        <span class="logo-label">Oakflat Digital</span>
      </div>

      <div
        class="brand-badge"
        :class="{ visible: navLogoVisible, compact: navCompact }"
        :style="badgeStyle(posData.logo, navCompact)"
        aria-hidden="true"
      >
        <img src="@/assets/logo.svg" alt="logo" />
      </div>
    </div>

    <!-- 左下角 icon -->
    <div
      class="corner"
      :class="{ compact: scrolled }"
      :style="fixedStyle(posData.icon, scrolled, ICON_COMPACT_SIZE)"
      @click="onIconClick"
    >
      <img src="@/assets/icons/focus.svg" alt="" />
    </div>
 </div>
    <!-- 舞台：等比缩放 + 居中（打开 sheet 时自己模糊 + 右推） -->
    <div class="stage" :style="stageStyle" :class="{ blurred: sheetOpen }" ref="stageEl">
      <img v-if="debugBg" class="ref" src="@/assets/reference.png" alt="" />

      <header
        class="hero"
        :style="heroRect"
        :class="{ sel: selected === 'hero' && debugOn }"
        @click="select('hero')"
      >
        <h1>Oakflat Digital</h1>
        <h2>技术路线 / 节点图</h2>
      </header>

      <section
        class="card card-a"
        :style="rect(posData.cardA)"
        :class="{ sel: selected === 'cardA' && debugOn }"
        @click="select('cardA')"
      >
        <header class="card-head">
          <p class="eyebrow">Sprint updates · 最新进展</p>
          <h3>Roadmap live snapshot</h3>
          <p class="sub">In-progress highlights from the product engineering sprint.</p>
        </header>
        <ul class="updates" role="list">
          <li v-for="item in updates" :key="item.id" class="update-item">
            <button type="button" class="update-card" @click.stop="openUpdate(item)">
              <span class="update-meta">
                <span class="date">{{ item.date }}</span>
                <span class="badge">{{ item.badge }}</span>
              </span>
              <span class="update-body">
                <span class="title">{{ item.title }}</span>
                <span class="desc">{{ item.desc }}</span>
              </span>
            </button>
          </li>
        </ul>
      </section>
      <section
        class="card card-b"
        :style="rect(posData.cardB)"
        :class="{ sel: selected === 'cardB' && debugOn }"
        @click="select('cardB')"
      >
        <header class="card-head">
          <p class="eyebrow">Sprint focus · 本周聚焦</p>
          <h3>Product engineering board</h3>
          <p class="sub">Quick actions to jump into roadmap, milestones, and status.</p>
        </header>
        <div class="action-grid">
          <button
            v-for="action in actions"
            :key="action.id"
            type="button"
            class="action"
            @click.stop="runAction(action.target)"
          >
            <span class="action-label">{{ action.label }}</span>
            <span class="action-hint">{{ action.hint }}</span>
          </button>
        </div>
        <dl class="progress">
          <div class="progress-row" v-for="metric in metrics" :key="metric.id">
            <dt>{{ metric.label }}</dt>
            <dd>{{ metric.value }}</dd>
          </div>
        </dl>
      </section>

      <div v-if="debugGrid" class="grid"></div>
      <div class="page-tail" :style="{ height: extraScroll + 'px' }"></div>
    </div>

    <!-- 毛玻璃组件（blur 交由 stage 处理，因此这里传 0） -->
    <GlassSheet
      :open="sheetOpen"
      v-model:modelValue="section"
      :title="'→ 我们现在的工作'"
      :items="sheetItems"
      :width="300"
      :left="48"
      :top="84"
      :blur="0"
      :veil="'rgba(255,255,255,.36)'"
      @close="closeSheet"
    />

    <!-- 调试组件 -->
    <DebugTools
      v-model:enabled="debugOn"
      v-model:grid="debugGrid"
      v-model:bg="debugBg"
      v-model:selected="selected"
      :scale="+scale"
      :offset-x="+offsetX"
      :offset-y="+offsetY"
      :export-json="exportJson"
      :pos-data="posData"
      :design-w="DESIGN_W"
      :design-h="DESIGN_H"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import DebugTools from '@/components/DebugTools.vue'
import GlassSheet from '@/components/GlassSheet.vue'

/** 设计稿尺寸 & 额外滚动 */
const DESIGN_W = 1920
const DESIGN_H = 1080
const extraScroll = 2400

/** 滚动阈值 */
const NAV_BG_COLLAPSE_T = 10
const NAV_LOGO_SHOW_T   = 28
const NAV_SHRINK_T      = 60
const ICON_COMPACT_SIZE     = 56
const NAV_COMPACT_PILL_SIZE = 56

/** 初始位置（设计坐标） */
const posData = reactive({
  logo:  { x: 57,  y: 36,  w: 320, h: 87  },
  hero:  { x: 960, y: 447, w: 1200, h: 172, centerX: true },
  cardA: { x: 437, y: 846, w: 360, h: 260 },
  cardB: { x: 1128,y: 846, w: 360, h: 260 },
  icon:  { x: 57,  y: 985, w: 32,  h: 32  },
})

/** 等比缩放 + 居中 */
const vw = ref(window.innerWidth)
const vh = ref(window.innerHeight)
const scale   = computed(() => Math.min(vw.value / DESIGN_W, vh.value / DESIGN_H))
const offsetX = computed(() => (vw.value - DESIGN_W * scale.value) / 2)
const offsetY = computed(() => (vh.value - DESIGN_H * scale.value) / 2)
const stageStyle = computed(() => ({
  width: DESIGN_W + 'px',
  height: DESIGN_H + 'px',
  /* 追加一个二次位移变量，打开 sheet 时右推 */
  transform: `translate(${offsetX.value}px, ${offsetY.value}px) scale(${scale.value}) translate(var(--push-x, 0), var(--push-y, 0))`,
  transformOrigin: 'top left',
}))
function onResize(){ vw.value = window.innerWidth; vh.value = window.innerHeight }

/** 舞台元素定位（设计坐标） */
function rect(r: any){
  return {
    left: r.x + 'px',
    top:  r.y + 'px',
    width:  r.w + 'px',
    height: r.h + 'px',
    '--w':  r.w + 'px',
    '--h':  r.h + 'px',
  }
}
const heroRect = computed(() => ({
  left: (posData.hero.centerX ? DESIGN_W / 2 : posData.hero.x) + 'px',
  top: posData.hero.y + 'px',
  width: posData.hero.w + 'px',
  height: posData.hero.h + 'px',
  transform: posData.hero.centerX ? 'translateX(-50%)' : '',
}))

/** 固定层通用定位（设计坐标 → 视口 fixed） */
function fixedStyle(r: any, compact = false, compactSize = 56) {
  const w0 = compact ? compactSize : r.w
  const h0 = compact ? compactSize : r.h
  return {
    left:  `${offsetX.value + r.x * scale.value}px`,
    top:   `${offsetY.value + r.y * scale.value}px`,
    width: `var(--w)`,
    height:`var(--h)`,
    '--w': `${w0 * scale.value}px`,
    '--h': `${h0 * scale.value}px`,
  }
}

/** 徽标排布（独立） */
const BADGE_BASE_SIZE    = Math.round(posData.logo.h * 0.5)
const BADGE_COMPACT_SIZE = 56
function badgeStyle(r: any, compact = false){
  const pillW = (compact ? NAV_COMPACT_PILL_SIZE : r.w) * scale.value
  const pillH = (compact ? NAV_COMPACT_PILL_SIZE : r.h) * scale.value
  const left  = offsetX.value + r.x * scale.value
  const top   = offsetY.value + r.y * scale.value
  const cx    = left + pillW / 2
  const cy    = top  + pillH / 2
  const size  = (compact ? BADGE_COMPACT_SIZE : BADGE_BASE_SIZE) * scale.value
  return { left:`${cx - size/2}px`, top:`${cy - size/2}px`, width:`${size}px`, height:`${size}px` }
}

/** —— 调试状态：交由 DebugTools 控制 —— */
const debugOn   = ref(true)
const debugGrid = ref(false)
const debugBg   = ref(false)
const selected  = ref<keyof typeof posData | ''>('')

function select(k: keyof typeof posData){
  if (debugOn.value) selected.value = k
}

/** 导出 JSON（供 DebugTools 复制） */
const exportJson = computed(() => {
  const obj: Record<string, any> = {}
  for (const [k, v] of Object.entries(posData)) {
    obj[k] = { x: (v as any).x, y: (v as any).y, w: (v as any).w, h: (v as any).h }
    if ((v as any).centerX) obj[k].centerX = true
  }
  return JSON.stringify(obj, null, 2)
})

/** 滚动监听：三段状态 */
const rootEl = ref<HTMLElement|null>(null)
const scrolled        = ref(false)
const navHideBg       = ref(false)
const navLogoVisible  = ref(false)
const navCompact      = ref(false)
function onAnyScroll(){
  const y = window.scrollY || rootEl.value?.scrollTop || 0
  scrolled.value       = y > 10
  navHideBg.value      = y > NAV_BG_COLLAPSE_T
  navLogoVisible.value = y > NAV_LOGO_SHOW_T
  navCompact.value     = y > NAV_SHRINK_T
}

/** 第二页（高斯模糊） */
const sheetOpen = ref(false)
type Section = 'roadmap' | 'milestones' | 'status'

const sheetItems: Array<{ key: Section; label: string }> = [
  { key: 'roadmap',    label: '技术路线图' },
  { key: 'milestones', label: '节点' },
  { key: 'status',     label: '状态' },
]
const section = ref<Section>('roadmap')
function onIconClick(e: MouseEvent){
  if (debugOn.value && (e as any).altKey) { selected.value = 'icon'; return }
  openSheet()
}
function openSheet(){ sheetOpen.value = true;  lockScroll(true) }
function closeSheet(){ sheetOpen.value = false; lockScroll(false) }
function lockScroll(on: boolean){ document.documentElement.style.overflow = on ? 'hidden' : '' }
function onEsc(e: KeyboardEvent){ if (e.key === 'Escape' && sheetOpen.value) closeSheet() }

type UpdateCard = {
  id: string
  badge: string
  date: string
  title: string
  desc: string
  target: Section
}

const updates: UpdateCard[] = [
  {
    id: 'roadmap-live',
    badge: 'Roadmap',
    date: '09 · 17',
    title: 'Roadmap scaffold live',
    desc: 'Baseline sections wired up for upcoming feature work.',
    target: 'roadmap' as const,
  },
  {
    id: 'milestone-chart',
    badge: 'Milestone',
    date: '09 · 16',
    title: 'Milestone gantt draft',
    desc: 'Visual timeline queued for engineering integration.',
    target: 'milestones' as const,
  },
  {
    id: 'status-sync',
    badge: 'Status',
    date: '09 · 15',
    title: 'Status sync in progress',
    desc: 'API handshake and badge design entering QA review.',
    target: 'status' as const,
  },
]

type ActionCard = { id: string; target: Section; label: string; hint: string }
type MetricRow = { id: string; label: string; value: string }

const actions: ActionCard[] = [
  { id: 'view-roadmap',    target: 'roadmap',    label: 'Open roadmap',    hint: '查看路线图' },
  { id: 'view-milestones', target: 'milestones', label: 'Review milestones', hint: '进入节点列表' },
  { id: 'view-status',     target: 'status',     label: 'Check status',     hint: '查看状态速览' },
]

const metrics: MetricRow[] = [
  { id: 'sprint-day',   label: 'Sprint day',   value: 'Day 3 / 7' },
  { id: 'tasks-closed', label: 'Tasks closed', value: '12 / 28' },
  { id: 'confidence',   label: 'Confidence',   value: '82%' },
]

function runAction(target: Section) {
  section.value = target
  openSheet()
}

function openUpdate(item: UpdateCard) {
  section.value = item.target
  openSheet()
}

/** 生命周期 */
onMounted(() => {
  window.addEventListener('resize', onResize)
  window.addEventListener('scroll', onAnyScroll, { passive: true })
  window.addEventListener('keydown', onEsc)
  rootEl.value?.addEventListener('scroll', onAnyScroll, { passive: true })
  onAnyScroll()
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  window.removeEventListener('scroll', onAnyScroll)
  window.removeEventListener('keydown', onEsc)
  rootEl.value?.removeEventListener('scroll', onAnyScroll)
})
</script>

<style scoped>
/* 页面容器/舞台/网格/坐标 */
.root { position: fixed; inset: 0; background:#fff; overflow: auto; }
.overlay { position: fixed; inset: 0; z-index: 20; pointer-events: none; }
.stage { position: absolute; top: 0; left: 0; }
.ref { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:.25; pointer-events:none; }
.grid{
  position:absolute; inset:0; pointer-events:none;
  background-image:
    linear-gradient(to right, rgba(0,0,0,.07) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0,0,0,.07) 1px, transparent 1px),
    linear-gradient(to right, rgba(0,0,0,.12) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0,0,0,.12) 1px, transparent 1px);
  background-size: 10px 10px, 10px 10px, 100px 100px, 100px 100px;
}
.page-tail{ height: 0; }

/* 舞台在打开弹层时模糊 + 右推（避免全屏 backdrop-filter 首帧卡顿） */
.stage{
  will-change: transform, filter;
  transition:
    filter .22s cubic-bezier(.16,1,.30,1),
    transform .22s cubic-bezier(.16,1,.30,1);
}
.stage.blurred{
  --push-x: 28px;
  --push-y: 0px;
  filter: blur(18px) saturate(1.05);
}

/* 标题与卡片 */
.hero{ position:absolute; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; text-align:center; }
.hero h1, .hero h2{ margin:0; white-space:nowrap; }
.hero h1{ font-size:88px; font-weight:800; line-height:1.06; }
.hero h2{ font-size:48px; font-weight:700; line-height:1.1; }
.card{
  position:absolute;
  border-radius:28px;
  overflow:hidden;
  box-shadow:0 20px 60px rgba(0,0,0,.08);
  display:flex;
  flex-direction:column;
  padding:32px;
  gap:24px;
  color:#0f172a;
}
.card::after{
  content:"";
  position:absolute;
  inset:0;
  background: radial-gradient(1200px 320px at 18% -8%, rgba(255,255,255,.56), transparent 60%);
  pointer-events:none;
}
.card > *{ position:relative; z-index:1; }
.card-a{ background: linear-gradient(90deg,#F4FBB3 0%,#DDF6E8 42%,#E6F3FF 100%); }
.card-b{ background: linear-gradient(90deg,#F4FBB3 0%,#E7F9BF 45%,#D7F7D0 100%); }

.card-head{ display:flex; flex-direction:column; gap:6px; }
.card-head h3{ margin:0; font-size:28px; font-weight:800; letter-spacing:.2px; }
.card-head .eyebrow{ margin:0; font-size:14px; font-weight:700; text-transform:uppercase; letter-spacing:.3em; }
.card-head .sub{ margin:0; font-size:16px; opacity:.78; line-height:1.5; }

.updates{ margin:0; padding:0; list-style:none; display:flex; flex-direction:column; gap:12px; }
.update-item{ margin:0; }
.update-card{
  width:100%;
  border:0;
  border-radius:18px;
  padding:18px 20px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:18px;
  background:rgba(255,255,255,.52);
  box-shadow:0 8px 24px rgba(15,23,42,.08);
  cursor:pointer;
  transition:transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s cubic-bezier(.16,1,.3,1);
}
.update-card:hover{ transform:translateY(-4px); box-shadow:0 16px 38px rgba(15,23,42,.15); }
.update-card:focus-visible{ outline:2px solid rgba(59,130,246,.8); outline-offset:4px; }
.update-meta{ display:flex; flex-direction:column; gap:6px; text-align:left; }
.update-meta .date{ font-weight:700; letter-spacing:.2em; font-size:12px; text-transform:uppercase; }
.update-meta .badge{ font-size:13px; font-weight:700; background:rgba(15,23,42,.08); border-radius:999px; padding:4px 10px; }
.update-body{ display:flex; flex-direction:column; align-items:flex-end; gap:6px; text-align:right; }
.update-body .title{ font-size:17px; font-weight:700; }
.update-body .desc{ font-size:14px; opacity:.7; max-width:220px; }

.action-grid{ display:grid; grid-template-columns:1fr; gap:12px; }
.action{
  border:0;
  border-radius:16px;
  padding:16px 20px;
  display:flex;
  flex-direction:column;
  align-items:flex-start;
  gap:4px;
  background:rgba(255,255,255,.56);
  box-shadow:0 8px 24px rgba(15,23,42,.08);
  cursor:pointer;
  transition:transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s cubic-bezier(.16,1,.3,1);
}
.action:hover{ transform:translateY(-3px); box-shadow:0 16px 36px rgba(15,23,42,.14); }
.action:focus-visible{ outline:2px solid rgba(16,185,129,.7); outline-offset:4px; }
.action-label{ font-size:18px; font-weight:700; }
.action-hint{ font-size:14px; opacity:.72; }

.progress{ margin:0; display:flex; flex-direction:column; gap:10px; }
.progress-row{ display:flex; align-items:center; justify-content:space-between; font-size:14px; }
.progress-row dt{ font-weight:600; opacity:.75; }
.progress-row dd{ margin:0; font-weight:700; font-size:16px; }

/* 选中态（调试） */
.sel{ outline:2px dashed #4f46e5; outline-offset:2px; }

/* 顶部 pill */
.logo-pill{
  position: fixed; left: 0; top: 0;
  width: var(--w); height: var(--h);
  display: flex; align-items: center; justify-content: center;
  gap: 10px; border-radius: 1000px; overflow: hidden;
  pointer-events: auto; user-select: none;
  padding: 0 24px; line-height: 1;
  transition:
    width .45s cubic-bezier(0.16,1,0.3,1),
    height .45s cubic-bezier(0.16,1,0.3,1),
    left .45s cubic-bezier(0.16,1,0.3,1),
    top .45s cubic-bezier(0.16,1,0.3,1),
    border-radius .45s cubic-bezier(0.16,1,0.3,1);
}
.logo-pill::before{
  content:""; position:absolute; inset:0; border-radius: inherit;
  background: linear-gradient(135deg,#9CCBFF 0%,#CAA8FF 100%);
  box-shadow: 0 12px 36px rgba(120,150,255,.25), 0 2px 10px rgba(120,150,255,.18);
  transform-origin: left center;
  transition: transform .45s cubic-bezier(0.16,1,0.3,1), opacity .25s ease;
}
.logo-label{
  position: relative; z-index: 1;
  color:#fff; font-weight:800; letter-spacing:.2px; white-space: nowrap;
  font-size: calc(var(--h) * 0.38);
  transition: opacity .22s ease;
}
.logo-pill.hidebg::before{ transform: scaleX(0); opacity: .8; }
.logo-pill.hidebg .logo-label{ opacity: 0; }
.logo-pill.compact{ border-radius: 9999px; padding: 0; }

/* 徽标 */
.brand-badge{
  position: fixed; z-index: 22;
  display: grid; place-items: center;
  border-radius: 9999px; overflow: hidden;
  pointer-events: none;
  opacity: 0; transform: scale(.85);
  transition: opacity .28s ease .06s, transform .30s cubic-bezier(0.16,1,0.3,1) .06s;
}
.brand-badge.visible{ opacity: 1; transform: scale(1); }
.brand-badge.compact{ box-shadow: 0 10px 26px rgba(0,0,0,.12); backdrop-filter: blur(2px); }
.brand-badge img{ width:100%; height:100%; display:block; }

/* 左下角 icon */
.corner{
  position: fixed; left: 0; top: 0;
  width: var(--w); height: var(--h);
  display: grid; place-items: center;
  border-radius: 8px; background: #f2f2f2;
  box-shadow: 0 6px 18px rgba(0,0,0,.08);
  pointer-events: auto;
  z-index: 40;
  min-width: 44px; min-height: 44px;
  touch-action: manipulation;
  transition:
    width .45s cubic-bezier(0.16, 1, 0.3, 1),
    height .45s cubic-bezier(0.16, 1, 0.3, 1),
    left .45s cubic-bezier(0.16, 1, 0.3, 1),
    top .45s cubic-bezier(0.16, 1, 0.3, 1),
    border-radius .45s cubic-bezier(0.16, 1, 0.3, 1),
    background .45s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow .45s cubic-bezier(0.16, 1, 0.3, 1),
    transform .45s cubic-bezier(0.16, 1, 0.3, 1);
}
.corner.compact{ border-radius: 9999px; background:#fff; box-shadow: 0 10px 26px rgba(0,0,0,.12); transform: scale(1.04); backdrop-filter: blur(2px); }
.corner img{ width:60%; height:60%; display:block; }
</style>
