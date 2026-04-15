<template>
  <ToolLayout title="JS 加密/解密">
    <div class="js-crypt">
      <div class="tool-bar">
        <button class="btn" @click="encrypt">加密</button>
        <button class="btn" @click="decrypt">解密</button>
        <button class="btn btn-outline" @click="copyResult">复制</button>
        <button class="btn btn-outline" @click="clearAll">清空</button>
      </div>
      <div class="editor-wrap">
        <div class="input-wrap">
          <div class="label">输入 JS 代码</div>
          <textarea v-model="input" class="code-area" placeholder="alert('Hello');"></textarea>
        </div>
        <div class="output-wrap">
          <div class="label">输出</div>
          <textarea v-model="output" class="code-area" readonly></textarea>
        </div>
      </div>
      <div class="info-box">⚠️ 本工具使用简单的字符编码混淆，不适用于高安全要求场景</div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const input = ref('')
const output = ref('')

function encrypt() {
  const code = input.value
  let result = ''
  for (let i = 0; i < code.length; i++) {
    result += '%' + code.charCodeAt(i).toString(16).padStart(2, '0')
  }
  output.value = `eval(unescape("${result}"))`
}

function decrypt() {
  try {
    const match = input.value.match(/eval\(unescape\("([^"]+)"\)\)/)
    if (!match) { alert('❌ 格式不匹配，请粘贴加密后的代码'); return }
    output.value = unescape(match[1].replace(/%([0-9a-f]{2})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16))))
  } catch (e) { alert('❌ 解密错误: ' + e.message) }
}

function copyResult() {
  if (!output.value) return
  navigator.clipboard.writeText(output.value).then(() => alert('✅ 已复制'))
}

function clearAll() { input.value = ''; output.value = '' }
</script>

<style scoped>
.js-crypt { display: flex; flex-direction: column; gap: 12px; }
.tool-bar { display: flex; gap: 8px; flex-wrap: wrap; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn:hover { background: #0860ca; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.btn-outline:hover { background: #f6f8fa; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.label { font-weight: 600; font-size: 14px; color: #24292f; margin-bottom: 6px; }
.code-area { width: 100%; min-height: 300px; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 13px; resize: vertical; background: #f6f8fa; box-sizing: border-box; }
.info-box { background: #fff8c5; border: 1px solid #f0c000; border-radius: 6px; padding: 10px 14px; font-size: 13px; color: #856404; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
