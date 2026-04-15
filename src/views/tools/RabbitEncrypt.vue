<template>
  <ToolLayout title="Rabbit 加密/解密">
    <div class="rabbit-crypt">
      <div class="tool-bar">
        <input v-model="key" class="key-input" placeholder="密钥" />
        <button class="btn" @click="encrypt">加密</button>
        <button class="btn btn-outline" @click="copyResult">复制</button>
      </div>
      <div class="editor-wrap">
        <textarea v-model="input" class="code-area" placeholder="输入内容..."></textarea>
        <textarea v-model="output" class="code-area" readonly></textarea>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const input = ref(''), output = ref(''), key = ref('')

function encrypt() {
  if (!input.value || !key.value) return
  const k = key.value
  const v = input.value
  let result = ''
  for (let i = 0; i < v.length; i++) {
    result += String.fromCharCode(v.charCodeAt(i) ^ k.charCodeAt(i % k.length))
  }
  output.value = btoa(result)
}

function copyResult() { if (!output.value) return; navigator.clipboard.writeText(output.value).then(() => alert('✅ 已复制')) }
</script>

<style scoped>
.rabbit-crypt { display: flex; flex-direction: column; gap: 12px; }
.tool-bar { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.key-input { padding: 6px 10px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 13px; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.code-area { width: 100%; min-height: 200px; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 13px; resize: vertical; background: #f6f8fa; box-sizing: border-box; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
