<template>
  <ToolLayout title="JSON 格式化(左右)">
    <div class="json-format-lr">
      <div class="tool-bar">
        <div class="bar-left">
          <button class="btn" @click="formatJson">格式化</button>
          <button class="btn btn-secondary" @click="compressJson">压缩</button>
          <button class="btn btn-secondary" @click="validateJson">校验</button>
        </div>
        <div class="bar-right">
          <span class="indent-label">缩进：</span>
          <select v-model="indent" class="indent-select">
            <option value="2">2 空格</option>
            <option value="4">4 空格</option>
            <option value="tab">Tab</option>
          </select>
          <button class="btn btn-outline" @click="swapContent">交换 ⇄</button>
          <button class="btn btn-outline" @click="clearAll">清空</button>
        </div>
      </div>
      <div class="panels">
        <div class="panel">
          <div class="panel-title">输入 JSON</div>
          <textarea v-model="inputJson" class="code-area" placeholder="粘贴或输入 JSON 数据..." @input="autoValidate"></textarea>
          <div class="panel-footer">
            <span v-if="inputError" class="error-msg">❌ {{ inputError }}</span>
            <span v-else-if="inputJson" class="success-msg">✅ 有效 JSON</span>
          </div>
        </div>
        <div class="panel">
          <div class="panel-title">格式化结果</div>
          <textarea v-model="outputJson" class="code-area" placeholder="格式化后的结果..." readonly></textarea>
          <div class="panel-footer">
            <span class="char-count">{{ outputJson.length }} 字符</span>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const inputJson = ref('')
const outputJson = ref('')
const inputError = ref('')
const indent = ref(2)

function getIndentStr() {
  return indent.value === 'tab' ? '\t' : ' '.repeat(Number(indent.value))
}

function formatJson() {
  try {
    const parsed = JSON.parse(inputJson.value)
    outputJson.value = JSON.stringify(parsed, null, getIndentStr())
    inputError.value = ''
  } catch (e) {
    inputError.value = e.message
  }
}

function compressJson() {
  try {
    const parsed = JSON.parse(inputJson.value)
    outputJson.value = JSON.stringify(parsed)
    inputError.value = ''
  } catch (e) {
    inputError.value = e.message
  }
}

function validateJson() {
  try {
    JSON.parse(inputJson.value)
    inputError.value = ''
    alert('✅ JSON 格式有效！')
  } catch (e) {
    inputError.value = e.message
  }
}

function autoValidate() {
  if (!inputJson.value.trim()) { inputError.value = ''; return }
  try { JSON.parse(inputJson.value); inputError.value = '' }
  catch (e) { inputError.value = e.message }
}

function swapContent() {
  const temp = inputJson.value
  inputJson.value = outputJson.value
  outputJson.value = temp
}

function clearAll() {
  inputJson.value = ''
  outputJson.value = ''
  inputError.value = ''
}
</script>

<style scoped>
.json-format-lr { display: flex; flex-direction: column; gap: 12px; }
.tool-bar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
.bar-left, .bar-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.indent-label { font-size: 13px; color: #666; }
.indent-select { padding: 6px 8px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 13px; background: white; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; transition: all 0.2s; }
.btn:hover { background: #0860ca; }
.btn-secondary { background: #6e7781; }
.btn-secondary:hover { background: #5c6370; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.btn-outline:hover { background: #f6f8fa; }
.panels { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.panel { display: flex; flex-direction: column; gap: 6px; }
.panel-title { font-weight: 600; font-size: 14px; color: #24292f; }
.code-area { width: 100%; min-height: 400px; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: 'Fira Code', 'Courier New', monospace; font-size: 13px; resize: vertical; line-height: 1.6; background: #f6f8fa; box-sizing: border-box; }
.panel-footer { display: flex; justify-content: flex-end; }
.error-msg { color: #cf222e; font-size: 12px; }
.success-msg { color: #1a7f37; font-size: 12px; }
.char-count { color: #666; font-size: 12px; }
@media (max-width: 768px) { .panels { grid-template-columns: 1fr; } }
</style>
