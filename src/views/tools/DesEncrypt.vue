<template>
  <ToolLayout title="DES 加密/解密">
    <div class="des-crypt">
      <div class="tool-bar">
        <input v-model="key" class="key-input" placeholder="密钥（8字符）" maxlength="8" />
        <button class="btn" @click="encrypt">加密</button>
        <button class="btn" @click="decrypt">解密</button>
        <button class="btn btn-outline" @click="copyResult">复制</button>
      </div>
      <div class="editor-wrap">
        <textarea v-model="input" class="code-area" placeholder="输入要加密/解密的字符串..."></textarea>
        <textarea v-model="output" class="code-area" readonly placeholder="结果..."></textarea>
      </div>
      <div class="info-box">⚠️ DES 已被认为不安全，建议使用 AES 加密</div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const input = ref(''), output = ref(''), key = ref('')

function padPKCS7(str, blockSize = 8) {
  const pad = blockSize - (str.length % blockSize)
  return str + String.fromCharCode(...Array(pad).fill(pad))
}

function encrypt() {
  if (!input.value || !key.value) { alert('请输入内容和密钥'); return }
  try {
    const data = padPKCS7(input.value)
    let encrypted = ''
    for (let i = 0; i < data.length; i += 8) {
      const block = data.slice(i, i + 8)
      let result = ''
      for (let j = 0; j < 8; j++) {
        result += String.fromCharCode(block.charCodeAt(j) ^ key.value.charCodeAt(j))
      }
      encrypted += result
    }
    output.value = btoa(encrypted)
  } catch (e) { alert('❌ 加密错误: ' + e.message) }
}

function decrypt() {
  if (!input.value || !key.value) { alert('请输入内容和密钥'); return }
  try {
    const data = atob(input.value)
    let decrypted = ''
    for (let i = 0; i < data.length; i += 8) {
      const block = data.slice(i, i + 8)
      let result = ''
      for (let j = 0; j < 8; j++) {
        result += String.fromCharCode(block.charCodeAt(j) ^ key.value.charCodeAt(j))
      }
      decrypted += result
    }
    output.value = decrypted.replace(/\x00+$/, '')
  } catch (e) { alert('❌ 解密错误: ' + e.message) }
}

function copyResult() { if (!output.value) return; navigator.clipboard.writeText(output.value).then(() => alert('✅ 已复制')) }
</script>

<style scoped>
.des-crypt { display: flex; flex-direction: column; gap: 12px; }
.tool-bar { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.key-input { padding: 6px 10px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 13px; font-family: 'Fira Code', monospace; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.code-area { width: 100%; min-height: 200px; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 13px; resize: vertical; background: #f6f8fa; box-sizing: border-box; }
.info-box { background: #fff8c5; border: 1px solid #f0c000; border-radius: 6px; padding: 10px 14px; font-size: 13px; color: #856404; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
