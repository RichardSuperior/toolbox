<template>
  <ToolLayout title="HTML 表格生成器">
    <div class="tool-wrap">
      <div class="config-row">
        <label>行数: <input type="number" v-model.number="rows" min="1" max="20" class="num-input" /></label>
        <label>列数: <input type="number" v-model.number="cols" min="1" max="10" class="num-input" /></label>
        <label><input type="checkbox" v-model="hasHeader" /> 首行为表头</label>
        <label><input type="checkbox" v-model="addBorder" /> 显示边框</label>
        <button class="btn" @click="initTable">初始化</button>
        <button class="btn btn-outline" @click="genHtml">生成 HTML</button>
        <button class="btn btn-outline" @click="copy" v-if="htmlOutput">复制</button>
      </div>
      <div class="table-editor" v-if="tableData.length">
        <table class="edit-table" :style="addBorder ? 'border-collapse:collapse' : ''">
          <tbody>
            <tr v-for="(row, ri) in tableData" :key="ri">
              <td v-for="(cell, ci) in row" :key="ci" :class="{ 'header-cell': ri === 0 && hasHeader }" :style="addBorder ? 'border:1px solid #d0d7de' : ''">
                <input v-model="tableData[ri][ci]" class="cell-input" :placeholder="ri === 0 && hasHeader ? '表头' : '内容'" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="htmlOutput">
        <div class="label">HTML 代码</div>
        <textarea v-model="htmlOutput" rows="8" readonly class="code-area"></textarea>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const rows = ref(3), cols = ref(4), hasHeader = ref(true), addBorder = ref(true)
const tableData = ref([]), htmlOutput = ref('')

function initTable() {
  tableData.value = Array.from({ length: rows.value }, (_, ri) =>
    Array.from({ length: cols.value }, (_, ci) => ri === 0 && hasHeader.value ? `列${ci + 1}` : ''))
}
initTable()

function genHtml() {
  const borderAttr = addBorder.value ? ' border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse"' : ''
  let html = `<table${borderAttr}>\n`
  tableData.value.forEach((row, ri) => {
    html += '  <tr>\n'
    const tag = ri === 0 && hasHeader.value ? 'th' : 'td'
    row.forEach(cell => { html += `    <${tag}>${cell}</${tag}>\n` })
    html += '  </tr>\n'
  })
  html += '</table>'
  htmlOutput.value = html
}
function copy() { navigator.clipboard.writeText(htmlOutput.value).then(() => alert('✅ 已复制')) }
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 12px; }
.config-row { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; font-size: 13px; }
.config-row label { display: flex; align-items: center; gap: 6px; }
.num-input { width: 60px; padding: 4px 8px; border: 1px solid #d0d7de; border-radius: 4px; font-size: 13px; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.table-editor { overflow-x: auto; }
.edit-table { border-collapse: collapse; }
.edit-table td { padding: 4px; }
.header-cell { background: #f0f6ff; }
.cell-input { width: 100px; padding: 6px 8px; border: 1px solid #d0d7de; border-radius: 4px; font-size: 13px; }
.label { font-size: 12px; color: #666; font-weight: 600; margin-bottom: 4px; }
.code-area { width: 100%; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: monospace; font-size: 13px; resize: vertical; box-sizing: border-box; background: #f6f8fa; }
</style>
