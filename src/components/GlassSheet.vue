<!-- src/components/GlassSheet.vue -->
<template>
  <!-- 固定挂载到 body；用 class 控制开关，避免每次 mount 的首帧开销 -->
  <teleport to="body">
    <div
      class="gs"
      :class="{ open }"
      role="dialog"
      aria-modal="true"
      @pointerdown.self="emit('close')"
    >
      <!-- 仅全屏白纱 + 可选轻微 blur（不引入任何外层方框） -->
      <div class="gs-blur" :style="blurStyle" @pointerdown="emit('close')"></div>

      <!-- 左侧文字面板（无卡片背景） -->
      <aside class="gs-panel" :style="panelStyle">
        <div class="gs-tag">{{ title }}</div>
        <ul class="gs-menu">
          <li
            v-for="it in items"
            :key="it.key"
            :class="{ active: modelValue === it.key }"
            @click="$emit('update:modelValue', it.key)"
          >
            {{ it.label }}
          </li>
        </ul>
      </aside>

      <button class="gs-close" @click="emit('close')" aria-label="Close">×</button>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, computed } from 'vue'

type Section = 'roadmap'|'milestones'|'status'

const props = withDefaults(defineProps<{
  open: boolean
  modelValue: Section
  title?: string
  items: Array<{ key: Section, label: string }>
  width?: number
  left?: number
  top?: number
  blur?: number       // 全屏白纱的 blur（0 最顺滑）
  veil?: string       // 全屏白纱颜色
}>(), {
  title: '',
  width: 300,
  left: 48,
  top: 72,                          // ↓ 比之前略下移
  blur: 12,                         // 适度增强模糊（可以按需调）
  veil: 'rgba(255,255,255,.40)',    // 略更贴合一点
})

const emit = defineEmits<{
  (e:'update:modelValue', v: Section): void
  (e:'close'): void
}>()

function onEsc(e: KeyboardEvent){
  if (e.key === 'Escape' && props.open) emit('close')
}
watch(
  () => props.open,
  v => {
    document.documentElement.style.overflow = v ? 'hidden' : ''
  },
  { immediate: true },
)
onMounted(() => window.addEventListener('keydown', onEsc))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onEsc)
  document.documentElement.style.overflow = ''
})

const panelStyle = computed(() => ({
  '--left':  props.left + 'px',
  '--top':   props.top + 'px',
  '--width': props.width + 'px',
} as any))

const blurStyle = computed(() => ({
  '--veil': props.veil,
  '--blur': (props.blur ?? 0) + 'px'
} as any))
</script>

<style scoped>
/* ── Tokens ───────────────────────────────────────────── */
.gs{
  --z: 60;
  --ease-enter: cubic-bezier(.16,1,.30,1); /* swift-out：快到位 */
  --ease-exit:  cubic-bezier(.40,0,1,1);   /* swift-in：快收起 */
  --dur-enter: .20s;                       /* 更快响应 */
  --dur-exit:  .16s;
  --dur-panel: .24s;

  --panel-gap: 12px;
  --panel-item-py: 4px;    /* 更贴字 */
  --panel-item-px: 10px;
  --close-size: 36px;
  --radius-pill: 999px;

  --shadow-sm: 0 6px 16px rgba(0,0,0,.12);
  --shadow-md: 0 10px 24px rgba(0,0,0,.14);

  --text-1: #222;
  --text-2: #555;
  --brand-1: #4338ca;
}

/* ── Layout ───────────────────────────────────────────── */
/* 容器只做透明度过渡，避免在 blur 上做动画造成顿挫 */
.gs{
  position: fixed; inset: 0; z-index: var(--z);
  pointer-events: none; opacity: 0;
  transition: opacity var(--dur-enter) var(--ease-enter);
  will-change: opacity;
}
.gs.open{ pointer-events: auto; opacity: 1; }

/* 全屏白纱 (logo、标题等都会被虚化) */
.gs-blur{
  position: absolute; inset: 0;
  background: var(--veil);
  backdrop-filter: blur(var(--blur)) saturate(1.05);
  -webkit-backdrop-filter: blur(var(--blur)) saturate(1.05);
}

/* 左侧文字，无背景卡片 */
.gs-panel{
  position: absolute;
  left: var(--left); top: var(--top);
  width: var(--width);
  background: transparent;
  transform: translateX(-10px) scale(.985);
  opacity: 0;
}
.gs.open .gs-panel{
  transform: translateX(0) scale(1);
  opacity: 1;
  transition:
    transform var(--dur-panel) var(--ease-enter),
    opacity   var(--dur-panel) var(--ease-enter);
}

/* 文案样式保持你原来的语气，仅细调对齐/间距 */
.gs-tag{ font-size: 18px; color: var(--text-2); margin-bottom: var(--panel-gap); }

/* 关键：让高亮只包裹文字，不占整行宽度 */
.gs .gs-menu{
  list-style: none; padding: 0; margin: 0;
  display: grid; gap: var(--panel-gap);
  justify-items: start;             /* 内容靠左，项自身宽度由内容决定 */
}
.gs .gs-menu li{
  position: relative;
  display: inline-flex;             /* 宽度 = 文本内容 + 内边距 */
  width: auto; max-width: 100%;
  font-size: 22px; color: var(--text-1); cursor: pointer;
  padding: var(--panel-item-py) var(--panel-item-px);
  border-radius: var(--radius-pill);
  transition: color .16s ease, background .16s ease, transform .16s ease;
}
.gs .gs-menu li::after{
  content: '';
  position: absolute;
  left: var(--panel-item-px);
  right: var(--panel-item-px);
  bottom: calc(var(--panel-item-py) - 6px);
  height: 3px;
  border-radius: 999px;
  background: rgba(79,70,229,.28);
  opacity: 0;
  transform: translateY(6px) scaleX(.6);
  transition: transform .24s cubic-bezier(.16,1,.3,1), opacity .18s ease;
}
.gs .gs-menu li:hover{ background: rgba(0,0,0,.06); transform: translateX(2px); }
.gs .gs-menu li:hover::after{ opacity: .6; transform: translateY(0) scaleX(1); }
.gs .gs-menu li.active{ background: rgba(79,70,229,.12); color: var(--brand-1); }
.gs .gs-menu li.active::after{ opacity: 1; transform: translateY(0) scaleX(1); background: rgba(79,70,229,.5); }
.gs .gs-menu li:focus-visible{ outline: 3px solid rgba(79,70,229,.28); outline-offset: 2px; }

/* 右上角关闭按钮保持不变 */
.gs-close{
  position: absolute; top: 18px; right: 22px;
  width: var(--close-size); height: var(--close-size);
  border-radius: var(--radius-pill);
  border: 1px solid rgba(0,0,0,.12);
  background: rgba(255,255,255,.9);
  box-shadow: var(--shadow-sm);
  cursor: pointer; font-size: 22px; line-height: 1;
  transition: transform .18s var(--ease-enter), background .12s ease, box-shadow .12s ease;
}
.gs-close:hover{ transform: rotate(90deg) scale(1.04); background:#fff; box-shadow: var(--shadow-md); }

/* 关闭更干脆 */
.gs:not(.open){ transition-timing-function: var(--ease-exit); transition-duration: var(--dur-exit); }

.gs-close:focus-visible{
  outline: 3px solid rgba(67,56,202,.35);
  outline-offset: 2px;
  box-shadow: var(--shadow-md);
}

@media (prefers-reduced-motion: reduce){
  .gs, .gs .gs-panel{ transition-duration: .01ms !important; }
}
</style>
