<template>
  <ToolLayout title="JSON 在线压缩转义">
    <div class="json-compress">
      <div class="tool-bar">
        <button class="btn" @click="compress">压缩</button>
        <button class="btn" @click="uncompress">格式化</button>
        <button class="btn btn-secondary" @click="escapeJson">转义</button>
        <button class="btn btn-secondary" @click="unescapeJson">去转义</button>
        <button class="btn btn-outline" @click="copyResult">复制结果</button>
        <button class="btn btn-outline" @click="clearAll">清空</button>
      </div>
      <div class="editor-wrap">
        <div class="input-wrap">
          <div class="label">输入 JSON</div>
          <textarea v-model="input" class="code-area" placeholder="粘贴或输入 JSON 数据..." @input="validate"></textarea>
          <div class="status">
            <span v-if="error" class="error">❌ {{ error }}</span>
            <span v-else-if="input" class="ok">✅ 有效 JSON ({{ input.length }} 字符)</span>
          </div>
        </div>
        <div class="output-wrap">
          <div class="label">输出</div>
          <textarea v-model="output" class="code-area" readonly placeholder="结果..."></textarea>
          <div class="status">
            <span v-if="output" class="info">📋 {{ output.length }} 字符</span>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const input = ref('')
const output = ref('')
const error = ref('')

function validate() {
  if (!input.value.trim()) { error.value = ''; return }
  try { JSON.parse(input.value); error.value = '' }
  catch (e) { error.value = e.message }
}

function compress() {
  try {
    output.value = JSON.stringify(JSON.parse(input.value))
    error.value = ''
  } catch (e) { error.value = e.message }
}

function uncompress() {
  try {
    output.value = JSON.stringify(JSON.parse(input.value), null, 2)
    error.value = ''
  } catch (e) { error.value = e.message }
}

function escapeJson() {
  output.value = JSON.stringify(input.value)
}

function unescapeJson() {
  try { output.value = JSON.parse(input.value) }
  catch (e) { error.value = e.message }
}

function copyResult() {
  if (!output.value) return
  navigator.clipboard.writeText(output.value).then(() => alert('✅ 已复制'))
}

function clearAll() { input.value = ''; output.value = ''; error.value = '' }
</script>

<style scoped>
.json-compress { display: flex; flex-direction: column; gap: 12px; }
.tool-bar { display: flex; gap: 8px; flex-wrap: wrap; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; transition: all 0.2s; }
.btn:hover { background: #0860ca; }
.btn-secondary { background: #6e7781; }
.btn-secondary:hover { background: #5c6370; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.btn-outline:hover { background: #f6f8fa; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.input-wrap, .output-wrap { display: flex; flex-direction: column; gap: 6px; }
.label { font-weight: 600; font-size: 14px; color: #24292f; }
.code-area { width: 100%; min-height: 350px; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 13px; resize: vertical; background: #f6f8fa; box-sizing: border-box; }
.status { min-height: 18px; }
.error { color: #cf222e; font-size: 12px; }
.ok { color: #1a7f37; font-size: 12px; }
.info { color: #666; font-size: 12px; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
