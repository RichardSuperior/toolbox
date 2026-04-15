<template>
  <ToolLayout title="JSON 和 GET 参数互转">
    <div class="json-get">
      <div class="tool-bar">
        <button class="btn" @click="jsonToGet">JSON → GET</button>
        <button class="btn" @click="getToJson">GET → JSON</button>
        <button class="btn btn-outline" @click="copyResult">复制结果</button>
        <button class="btn btn-outline" @click="clearAll">清空</button>
      </div>
      <div class="editor-wrap">
        <div class="input-wrap">
          <div class="label">输入</div>
          <textarea v-model="input" class="code-area" placeholder='{"name": "张三", "age": 25, "city": "深圳"}'></textarea>
        </div>
        <div class="output-wrap">
          <div class="label">输出</div>
          <textarea v-model="output" class="code-area" readonly placeholder="转换结果..."></textarea>
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

function jsonToGet() {
  try {
    const obj = JSON.parse(input.value)
    const params = Object.entries(obj).map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(String(v)))
    output.value = params.join('&')
  } catch (e) { alert('❌ JSON 解析错误: ' + e.message) }
}

function getToJson() {
  try {
    const str = input.value.trim()
    const params = new URLSearchParams(str)
    const obj = {}
    for (const [k, v] of params.entries()) {
      obj[k] = isNaN(Number(v)) ? v : Number(v)
    }
    output.value = JSON.stringify(obj, null, 2)
  } catch (e) { alert('❌ 解析错误: ' + e.message) }
}

function copyResult() {
  if (!output.value) return
  navigator.clipboard.writeText(output.value).then(() => alert('✅ 已复制'))
}

function clearAll() { input.value = ''; output.value = '' }
</script>

<style scoped>
.json-get { display: flex; flex-direction: column; gap: 12px; }
.tool-bar { display: flex; gap: 8px; flex-wrap: wrap; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn:hover { background: #0860ca; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.btn-outline:hover { background: #f6f8fa; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.label { font-weight: 600; font-size: 14px; color: #24292f; margin-bottom: 6px; }
.code-area { width: 100%; min-height: 300px; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 13px; resize: vertical; background: #f6f8fa; box-sizing: border-box; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
