<template>
  <ToolLayout title="IP/数字 地址转换">
    <div class="ip-num">
      <div class="tool-bar">
        <button class="btn" @click="ipToNum">IP → 数字</button>
        <button class="btn" @click="numToIp">数字 → IP</button>
        <button class="btn btn-outline" @click="copy">复制</button>
      </div>
      <div class="editor-wrap">
        <textarea v-model="input" class="code-area" placeholder="192.168.1.1 或 3232235777"></textarea>
        <textarea v-model="output" class="code-area" readonly></textarea>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const input = ref(''), output = ref('')
function ipToNum() {
  const parts = input.value.trim().split('.').map(Number)
  if (parts.length !== 4 || parts.some(isNaN)) { alert('IP 格式错误'); return }
  output.value = parts.reduce((a, b) => (a << 8) + b) >>> 0
}
function numToIp() {
  const n = Number(input.value)
  if (isNaN(n)) { alert('数字格式错误'); return }
  output.value = [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.')
}
function copy() { if (!output.value) return; navigator.clipboard.writeText(output.value).then(() => alert('已复制')) }
</script>

<style scoped>
.ip-num { display: flex; flex-direction: column; gap: 12px; }
.tool-bar { display: flex; gap: 8px; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.code-area { width: 100%; min-height: 200px; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 13px; resize: vertical; background: #f6f8fa; box-sizing: border-box; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
