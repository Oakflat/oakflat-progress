<template>
  <!-- 仅在开启调试时渲染 -->
  <div v-if="enabled" class="dbg-root">
    <!-- 固定在视口的坐标提示（展示设计坐标） -->
    <div
      class="cursor"
      :style="{ left: cursorLeft + 'px', top: cursorTop + 'px' }"
    >
      {{ mouseDesignX }}, {{ mouseDesignY }}
    </div>

    <!-- 你的原 DebugPanel（复制导出/提示） -->
    <DebugPanel
      :scale="+scale"
      :offset-x="+offsetX"
      :offset-y="+offsetY"
      :selected="selected || 'none'"
      :export-json="exportJson"
      :toast="toast"
      @copy="copyJson"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import DebugPanel from '@/components/DebugPanel.vue'

/** v-models（需要 Vue 3.4+，若更低版本可改用 props+emits） */
const selected = defineModel<string | ''>('selected', { default: '' })
const enabled  = defineModel<boolean>('enabled',  { default: true })
const grid     = defineModel<boolean>('grid',     { default: false })
const bg       = defineModel<boolean>('bg',       { default: false })

const props = defineProps<{
  scale: number
  offsetX: number
  offsetY: number
  exportJson: string
  /** 可以直接修改（引用传递） */
  posData: Record<string, { x:number; y:number; w:number; h:number; [k:string]:any }>
  /** 设计稿尺寸，用于坐标换算与钳制 */
  designW: number
  designH: number
}>()

/** 复制导出反馈 */
const toast = ref<''|'ok'|'fail'>('')

async function copyJson(){
  try {
    await navigator.clipboard.writeText(props.exportJson)
    toast.value = 'ok'
  } catch {
    const blob = new Blob([props.exportJson], { type:'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'positions.json'; a.click()
    URL.revokeObjectURL(url)
    toast.value = 'fail'
  }
  setTimeout(()=> toast.value = '', 1600)
}

/** 鼠标坐标（设计坐标 + 视口定位） */
const mouseDesignX = ref(0)
const mouseDesignY = ref(0)
const cursorLeft   = ref(0)
const cursorTop    = ref(0)

function onMouseMove(e: MouseEvent){
  // 视口中显示小浮标
  cursorLeft.value = e.clientX + 8
  cursorTop.value  = e.clientY - 26
  // 计算设计坐标
  const dx = (e.clientX - props.offsetX) / props.scale
  const dy = (e.clientY - props.offsetY) / props.scale
  mouseDesignX.value = Math.max(0, Math.min(props.designW, Math.round(dx)))
  mouseDesignY.value = Math.max(0, Math.min(props.designH, Math.round(dy)))
}

/** 热键：D 开关、G 网格、B 背景底图、C 复制导出；方向键微调选中元素位置 */
function onKeydown(e: KeyboardEvent){
  // 全局热键
  if (e.key === 'd' || e.key === 'D') enabled.value = !enabled.value
  if (!enabled.value) return

  if (e.key === 'g' || e.key === 'G') grid.value = !grid.value
  if (e.key === 'b' || e.key === 'B') bg.value   = !bg.value
  if (e.key === 'c' || e.key === 'C') { copyJson(); return }

  const k = selected.value
  if (!k || !(k in props.posData)) return

  const step = e.shiftKey ? 10 : 1
  if (e.key === 'ArrowLeft')  { props.posData[k].x -= step; e.preventDefault() }
  if (e.key === 'ArrowRight') { props.posData[k].x += step; e.preventDefault() }
  if (e.key === 'ArrowUp')    { props.posData[k].y -= step; e.preventDefault() }
  if (e.key === 'ArrowDown')  { props.posData[k].y += step; e.preventDefault() }
}

/** 生命周期 */
onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('keydown', onKeydown)
})

/** 关闭调试时，自动清空选择，避免误操作 */
watch(enabled, v => { if (!v) selected.value = '' })
</script>

<style scoped>
.cursor{
  position: fixed;
  z-index: 1000;
  background: rgba(0,0,0,.65);
  color:#fff;
  font:12px/1.6 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  padding:2px 6px;
  border-radius:6px;
  pointer-events:none;
  transform: translate(0, 0);
}
</style>
