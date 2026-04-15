<template>
  <ToolLayout title="Excel/CSV 转 JSON">
    <div class="excel-json">
      <div class="tool-bar">
        <div class="bar-left">
          <button class="btn" @click="convertFile">解析文件</button>
          <select v-model="delimiter" class="sel">
            <option value=",">逗号分隔</option>
            <option value="\t">Tab 分隔</option>
            <option value=";">分号分隔</option>
          </select>
        </div>
        <div class="bar-right">
          <label class="check-label"><input type="checkbox" v-model="firstRowHeader" /> 首行为表头</label>
          <button class="btn btn-outline" @click="copyResult">复制 JSON</button>
        </div>
      </div>
      <div class="drop-zone" @drop.prevent="onDrop" @dragover.prevent @click="$refs.fileInput.click()">
        <input ref="fileInput" type="file" accept=".csv,.xlsx,.xls,.txt" style="display:none" @change="onFileChange" />
        <div class="drop-hint">📂 拖拽或点击上传 CSV/Excel 文件</div>
      </div>
      <div class="editor-wrap">
        <div class="input-wrap">
          <div class="label">或粘贴 CSV 数据</div>
          <textarea v-model="csvInput" class="code-area" placeholder="name,age,email
张三,25,zhangsan@example.com
李四,30,lisi@example.com"></textarea>
          <button class="btn mt8" @click="parseCsv">解析 CSV</button>
        </div>
        <div class="output-wrap">
          <div class="label">生成的 JSON</div>
          <textarea v-model="jsonOutput" class="code-area" readonly placeholder="JSON 输出..."></textarea>
          <div class="stats" v-if="jsonOutput">
            <span>📊 {{ rowCount }} 行 × {{ colCount }} 列</span>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const csvInput = ref('')
const jsonOutput = ref('')
const delimiter = ref(',')
const firstRowHeader = ref(true)
const rowCount = ref(0)
const colCount = ref(0)
const fileInput = ref(null)

function parseCSV(text) {
  const lines = text.trim().split('\n')
  if (lines.length === 0) return []
  const headers = firstRowHeader.value ? lines[0].split(delimiter.value).map(h => h.trim()) : null
  const data = []
  const start = firstRowHeader.value ? 1 : 0
  for (let i = start; i < lines.length; i++) {
    const values = lines[i].split(delimiter.value).map(v => v.trim().replace(/^["']|["']$/g, ''))
    if (headers) {
      const obj = {}
      headers.forEach((h, idx) => { obj[h] = values[idx] || '' })
      data.push(obj)
    } else {
      data.push(values)
    }
  }
  return data
}

function parseCsv() {
  if (!csvInput.value.trim()) return
  try {
    const data = parseCSV(csvInput.value)
    rowCount.value = data.length
    colCount.value = firstRowHeader.value ? Object.keys(data[0] || {}).length : (data[0]?.length || 0)
    jsonOutput.value = JSON.stringify(data, null, 2)
  } catch (e) { alert('❌ 解析错误: ' + e.message) }
}

function onFileChange(e) {
  const file = e.target.files[0]
  if (file) readFile(file)
}

function onDrop(e) {
  const file = e.dataTransfer.files[0]
  if (file) readFile(file)
}

function readFile(file) {
  const reader = new FileReader()
  reader.onload = (e) => { csvInput.value = e.target.result; parseCsv() }
  reader.readAsText(file)
}

function convertFile() { if (fileInput.value) fileInput.value.click() }

function copyResult() {
  if (!jsonOutput.value) return
  navigator.clipboard.writeText(jsonOutput.value).then(() => alert('✅ 已复制'))
}
</script>

<style scoped>
.excel-json { display: flex; flex-direction: column; gap: 12px; }
.tool-bar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
.bar-left, .bar-right { display: flex; align-items: center; gap: 8px; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn:hover { background: #0860ca; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.btn-outline:hover { background: #f6f8fa; }
.sel { padding: 6px 8px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 13px; background: white; }
.check-label { display: flex; align-items: center; gap: 4px; font-size: 13px; cursor: pointer; }
.drop-zone { border: 2px dashed #d0d7de; border-radius: 8px; padding: 24px; text-align: center; cursor: pointer; transition: all 0.2s; }
.drop-zone:hover { border-color: #0969da; background: #f6f8fa; }
.drop-hint { color: #666; font-size: 14px; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.label { font-weight: 600; font-size: 14px; color: #24292f; margin-bottom: 6px; }
.code-area { width: 100%; min-height: 250px; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 13px; resize: vertical; background: #f6f8fa; box-sizing: border-box; }
.stats { margin-top: 6px; font-size: 12px; color: #666; }
.mt8 { margin-top: 8px; align-self: flex-start; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
