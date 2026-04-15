<template>
  <ToolLayout title="JSON 转 Excel/CSV">
    <div class="json-excel">
      <div class="tool-bar">
        <button class="btn" @click="convert">转换为 CSV</button>
        <select v-model="delimiter" class="sel">
          <option value=",">逗号 CSV</option>
          <option value="\t">Tab 分隔</option>
          <option value=";">分号 CSV</option>
        </select>
        <label class="check-label"><input type="checkbox" v-model="includeHeader" checked /> 包含表头</label>
        <button class="btn btn-outline" @click="downloadCsv">下载 CSV</button>
        <button class="btn btn-outline" @click="copyResult">复制文本</button>
      </div>
      <div class="editor-wrap">
        <div class="input-wrap">
          <div class="label">输入 JSON</div>
          <textarea v-model="jsonInput" class="code-area" placeholder='[
  {"name": "张三", "age": 25, "email": "zhangsan@example.com"},
  {"name": "李四", "age": 30, "email": "lisi@example.com"}
]'></textarea>
        </div>
        <div class="output-wrap">
          <div class="label">CSV 输出</div>
          <textarea v-model="csvOutput" class="code-area" readonly placeholder="CSV 输出..."></textarea>
          <div class="stats" v-if="csvOutput">
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

const jsonInput = ref('')
const csvOutput = ref('')
const delimiter = ref(',')
const includeHeader = ref(true)
const rowCount = ref(0)
const colCount = ref(0)

function escapeCsv(val) {
  if (val == null) return ''
  const str = String(val)
  if (str.includes(delimiter.value) || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"'
  }
  return str
}

function convert() {
  try {
    const data = JSON.parse(jsonInput.value)
    if (!Array.isArray(data)) { alert('❌ 请输入 JSON 数组'); return }
    if (data.length === 0) { alert('❌ 数组不能为空'); return }
    const headers = Object.keys(data[0])
    const lines = []
    if (includeHeader.value) lines.push(headers.map(escapeCsv).join(delimiter.value === '\t' ? '\t' : ','))
    data.forEach(row => { lines.push(headers.map(h => escapeCsv(row[h])).join(delimiter.value === '\t' ? '\t' : ',')) })
    csvOutput.value = lines.join('\n')
    rowCount.value = data.length
    colCount.value = headers.length
  } catch (e) { alert('❌ JSON 解析错误: ' + e.message) }
}

function downloadCsv() {
  if (!csvOutput.value) return
  const blob = new Blob(['\uFEFF' + csvOutput.value], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'export.csv'
  a.click()
  URL.revokeObjectURL(url)
}

function copyResult() {
  if (!csvOutput.value) return
  navigator.clipboard.writeText(csvOutput.value).then(() => alert('✅ 已复制'))
}
</script>

<style scoped>
.json-excel { display: flex; flex-direction: column; gap: 12px; }
.tool-bar { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn:hover { background: #0860ca; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.btn-outline:hover { background: #f6f8fa; }
.sel { padding: 6px 8px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 13px; background: white; }
.check-label { display: flex; align-items: center; gap: 4px; font-size: 13px; cursor: pointer; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.label { font-weight: 600; font-size: 14px; color: #24292f; margin-bottom: 6px; }
.code-area { width: 100%; min-height: 300px; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 13px; resize: vertical; background: #f6f8fa; box-sizing: border-box; }
.stats { margin-top: 6px; font-size: 12px; color: #666; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
