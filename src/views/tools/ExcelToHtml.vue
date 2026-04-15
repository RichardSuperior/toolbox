<template>
  <ToolLayout title="Excel 转 HTML 表格">
    <div class="tool-wrap">
      <div class="toolbar">
        <button class="btn" @click="convert">▶ 转换</button>
        <button class="btn btn-outline" @click="clear">清空</button>
        <button class="btn btn-outline" @click="copy" v-if="output">复制 HTML</button>
        <label class="opt-label"><input type="checkbox" v-model="hasHeader" /> 首行为表头</label>
        <label class="opt-label"><input type="checkbox" v-model="addBorder" /> 添加边框</label>
      </div>
      <div class="editor-wrap">
        <div>
          <div class="label">Excel 数据（从 Excel 复制粘贴，Tab分隔）</div>
          <textarea v-model="input" rows="12" class="code-area" placeholder="从 Excel 复制单元格后粘贴到此处..."></textarea>
        </div>
        <div>
          <div class="label">HTML 代码</div>
          <textarea v-model="output" rows="12" readonly class="code-area output"></textarea>
        </div>
      </div>
      <div v-if="previewHtml" class="preview-wrap">
        <div class="label">预览效果</div>
        <div v-html="previewHtml" class="html-preview"></div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const input = ref(''), output = ref(''), previewHtml = ref(''), hasHeader = ref(true), addBorder = ref(true)

function convert() {
  const rows = input.value.trim().split('\n').map(r => r.split('\t'))
  if (!rows.length || !rows[0].length) { alert('请粘贴 Excel 数据'); return }
  const borderAttr = addBorder.value ? ' border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse"' : ' cellpadding="6" cellspacing="0"'
  let html = `<table${borderAttr}>\n`
  rows.forEach((row, i) => {
    html += '  <tr>\n'
    const tag = (i === 0 && hasHeader.value) ? 'th' : 'td'
    row.forEach(cell => { html += `    <${tag}>${cell.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</${tag}>\n` })
    html += '  </tr>\n'
  })
  html += '</table>'
  output.value = html
  previewHtml.value = html
}
function clear() { input.value = ''; output.value = ''; previewHtml.value = '' }
function copy() { navigator.clipboard.writeText(output.value).then(() => alert('✅ 已复制')) }
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 12px; }
.toolbar { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.opt-label { font-size: 13px; display: flex; align-items: center; gap: 4px; cursor: pointer; }
.label { font-size: 12px; color: #666; font-weight: 600; margin-bottom: 4px; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.code-area { width: 100%; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: monospace; font-size: 13px; resize: vertical; box-sizing: border-box; }
.output { background: #f6f8fa; }
.preview-wrap { border: 1px solid #d0d7de; border-radius: 8px; padding: 16px; }
.html-preview { overflow-x: auto; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
