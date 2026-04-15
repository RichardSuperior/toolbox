<template>
  <ToolLayout title="RC4 加密/解密">
    <div class="rc4-crypt">
      <div class="tool-bar">
        <input v-model="key" class="key-input" placeholder="密钥" />
        <button class="btn" @click="doRC4">加密/解密</button>
        <button class="btn btn-outline" @click="copyResult">复制</button>
      </div>
      <div class="editor-wrap">
        <textarea v-model="input" class="code-area" placeholder="输入内容..."></textarea>
        <textarea v-model="output" class="code-area" readonly placeholder="结果（RC4是对称加密，同一个密钥加密解密相同）..."></textarea>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const input = ref(''), output = ref(''), key = ref('')

function rc4(data, key) {
  const s = Array.from({ length: 256 }, (_, i) => i)
  let j = 0
  for (let i = 0; i < 256; i++) { j = (j + s[i] + key.charCodeAt(i % key.length)) % 256; [s[i], s[j]] = [s[j], s[i]] }
  const out = []
  let x = 0, y = 0
  for (let i = 0; i < data.length; i++) {
    x = (x + 1) % 256; y = (y + s[x]) % 256; [s[x], s[y]] = [s[y], s[x]]
    out.push(data.charCodeAt(i) ^ s[(s[x] + s[y]) % 256])
  }
  return String.fromCharCode(...out)
}

function doRC4() {
  if (!input.value || !key.value) return
  output.value = btoa(rc4(input.value, key.value))
}

function copyResult() { if (!output.value) return; navigator.clipboard.writeText(output.value).then(() => alert('✅ 已复制')) }
</script>

<style scoped>
.rc4-crypt { display: flex; flex-direction: column; gap: 12px; }
.tool-bar { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.key-input { padding: 6px 10px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 13px; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.code-area { width: 100%; min-height: 200px; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 13px; resize: vertical; background: #f6f8fa; box-sizing: border-box; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
