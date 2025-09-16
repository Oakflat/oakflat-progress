<!-- src/components/DebugPanel.vue -->
<template>
  <div class="panel">
    <div class="row">
      <strong>Scale:</strong> {{ scale.toFixed(3) }} |
      <strong>Offset:</strong> {{ Math.round(offsetX) }}, {{ Math.round(offsetY) }}
    </div>
    <div class="row"><strong>Selected:</strong> {{ selected }}</div>
    <div class="row small">
      Keys: [D]ebug [G]rid [B]g [C]opy | Arrows (±1px), Shift+Arrows (±10px)
    </div>
    <div class="row">
      <button @click="$emit('copy')">复制坐标 JSON</button>
      <span v-if="toast" class="toast" :class="toast === 'ok' ? 'ok' : 'fail'">
        {{ toast === 'ok' ? '已复制到剪贴板' : '已下载 positions.json' }}
      </span>
    </div>
    <pre class="json">{{ exportJson }}</pre>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  scale: number
  offsetX: number
  offsetY: number
  selected: string
  exportJson: string
  toast: '' | 'ok' | 'fail'
}>()
defineEmits<{ (e: 'copy'): void }>()
</script>

<style scoped>
.panel{
  position: fixed; right: 12px; top: 12px; z-index: 1000;
  width: 360px; max-height: 70vh; overflow:auto;
  background: rgba(255,255,255,.9); backdrop-filter: blur(6px);
  border: 1px solid rgba(0,0,0,.08); border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,.08);
  padding: 10px 12px;
  font: 13px/1.5 ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, 'PingFang SC','Microsoft YaHei', sans-serif;
}
.row{ margin: 4px 0; }
.small{ opacity: .7; }
.json{ margin:6px 0 0; white-space:pre-wrap; font: 12px/1.4 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
button{ padding:6px 10px; border-radius:8px; border:1px solid rgba(0,0,0,.1); background:#fff; cursor:pointer; }
button:hover{ background:#f7f7f7; }
.toast{ margin-left:8px; font-size:12px; padding:4px 8px; border-radius:6px; }
.toast.ok{ background:#e6f7e8; color:#166534; }
.toast.fail{ background:#fff6e5; color:#8a4500; }
</style>
