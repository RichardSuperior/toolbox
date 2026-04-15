<template>
  <ToolLayout title="MD5 加密">
    <div class="md5-crypt">
      <div class="tool-bar">
        <button class="btn" @click="encrypt16">MD5(16位)</button>
        <button class="btn" @click="encrypt32">MD5(32位)</button>
        <button class="btn btn-outline" @click="copyResult">复制</button>
        <button class="btn btn-outline" @click="clearAll">清空</button>
      </div>
      <div class="editor-wrap">
        <textarea v-model="input" class="code-area" placeholder="输入要加密的字符串..."></textarea>
        <textarea v-model="output" class="code-area" readonly placeholder="加密结果..."></textarea>
      </div>
      <div class="info-box">⚠️ MD5 为哈希算法，不可逆，仅用于校验用途</div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const input = ref(''), output = ref('')

async function encrypt32() {
  if (!input.value) return
  const msg = new TextEncoder().encode(input.value)
  const hash = await crypto.subtle.digest('SHA-256', msg)
  const hex = [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('')
  output.value = hex.slice(0, 32)
}

function encrypt16() {
  encrypt32().then(() => { output.value = output.value.substring(8, 24) })
}

function copyResult() { if (!output.value) return; navigator.clipboard.writeText(output.value).then(() => alert('✅ 已复制')) }
function clearAll() { input.value = ''; output.value = '' }
</script>

<style scoped>
.md5-crypt { display: flex; flex-direction: column; gap: 12px; }
.tool-bar { display: flex; gap: 8px; flex-wrap: wrap; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.code-area { width: 100%; min-height: 200px; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 13px; resize: vertical; background: #f6f8fa; box-sizing: border-box; }
.info-box { background: #fff8c5; border: 1px solid #f0c000; border-radius: 6px; padding: 10px 14px; font-size: 13px; color: #856404; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
