<template>
  <ToolLayout title="URL 十六进制加密">
    <div class="url-hex">
      <div class="tool-bar">
        <button class="btn" @click="encrypt">加密</button>
        <button class="btn" @click="decrypt">解密</button>
        <button class="btn btn-outline" @click="copyResult">复制</button>
      </div>
      <div class="editor-wrap">
        <textarea v-model="input" class="code-area" placeholder="输入 URL..."></textarea>
        <textarea v-model="output" class="code-area" readonly></textarea>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const input = ref(''), output = ref('')
function encrypt() { output.value = [...input.value].map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('') }
function decrypt() { try { output.value = decodeURIComponent(input.value) } catch { alert('解密失败') } }
function copyResult() { if (!output.value) return; navigator.clipboard.writeText(output.value).then(() => alert('已复制')) }
</script>

<style scoped>
.url-hex { display: flex; flex-direction: column; gap: 12px; }
.tool-bar { display: flex; gap: 8px; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.code-area { width: 100%; min-height: 250px; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 13px; resize: vertical; background: #f6f8fa; box-sizing: border-box; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
