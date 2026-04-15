<template>
  <ToolLayout title="Bootstrap 图标库">
    <div class="tool-wrap">
      <div class="search-bar">
        <input v-model="keyword" class="search-input" placeholder="搜索图标名称..." />
        <span class="count">共 {{ filtered.length }} 个</span>
      </div>
      <div class="icons-grid">
        <div v-for="icon in filtered" :key="icon" class="icon-item" @click="copyIcon(icon)" :title="icon">
          <i :class="'bi bi-' + icon" style="font-size:24px"></i>
          <div class="icon-name">{{ icon }}</div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const keyword = ref('')
const icons = ['alarm', 'archive', 'arrow-down', 'arrow-left', 'arrow-right', 'arrow-up',
  'bell', 'bookmark', 'box', 'calendar', 'camera', 'chat', 'check', 'check-circle',
  'chevron-down', 'chevron-left', 'chevron-right', 'chevron-up', 'clock', 'cloud',
  'code', 'cpu', 'cursor', 'dash', 'database', 'download', 'emoji-smile', 'envelope',
  'exclamation', 'exclamation-circle', 'eye', 'file', 'file-code', 'file-earmark',
  'file-text', 'filter', 'flag', 'folder', 'gear', 'github', 'globe', 'grid',
  'heart', 'house', 'image', 'info', 'info-circle', 'input-cursor', 'key', 'keyboard',
  'laptop', 'layers', 'lightning', 'link', 'list', 'lock', 'map', 'menu', 'mic',
  'moon', 'music-note', 'palette', 'pause', 'pencil', 'person', 'phone', 'play',
  'plus', 'printer', 'question', 'search', 'send', 'share', 'shield', 'shop',
  'shuffle', 'skip-backward', 'skip-forward', 'slack', 'sliders', 'sort-down',
  'sort-up', 'speaker', 'square', 'stack', 'star', 'stop', 'sun', 'table', 'tag',
  'terminal', 'toggles', 'tools', 'trash', 'tree', 'trophy', 'tv', 'type', 'unlock',
  'upload', 'vector-pen', 'video', 'wallet', 'wifi', 'window', 'wrench', 'x', 'x-circle', 'zoom-in']
const filtered = computed(() => {
  const k = keyword.value.toLowerCase()
  return k ? icons.filter(i => i.includes(k)) : icons
})
function copyIcon(icon) {
  const code = `<i class="bi bi-${icon}"></i>`
  navigator.clipboard.writeText(code).then(() => alert(`✅ 已复制: ${code}`))
}
onMounted(() => {
  if (!document.querySelector('link[href*="bootstrap-icons"]')) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css'
    document.head.appendChild(link)
  }
})
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 12px; }
.search-bar { display: flex; align-items: center; gap: 12px; }
.search-input { flex: 1; padding: 8px 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 14px; }
.count { font-size: 13px; color: #666; white-space: nowrap; }
.icons-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); gap: 8px; }
.icon-item { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 10px 6px; border: 1px solid #e1e4e8; border-radius: 8px; cursor: pointer; transition: all 0.15s; }
.icon-item:hover { background: #f0f6ff; border-color: #0969da; }
.icon-name { font-size: 10px; color: #666; text-align: center; word-break: break-all; line-height: 1.2; }
</style>
