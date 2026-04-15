<template>
  <ToolLayout title="HTML 转 C# 代码">
    <div class="tool-wrap">
      <div class="toolbar">
        <select v-model="mode" class="select">
          <option value="sb">StringBuilder</option>
          <option value="writer">HtmlTextWriter</option>
          <option value="concat">字符串拼接</option>
        </select>
        <button class="btn" @click="convert">▶ 转换</button>
        <button class="btn btn-outline" @click="clear">清空</button>
        <button class="btn btn-outline" @click="copy" v-if="output">复制</button>
      </div>
      <div class="editor-wrap">
        <div><div class="label">HTML 代码</div>
          <textarea v-model="input" rows="18" class="code-area" placeholder="粘贴 HTML 代码..."></textarea></div>
        <div><div class="label">C# 代码</div>
          <textarea v-model="output" rows="18" readonly class="code-area output"></textarea></div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const input = ref(''), output = ref(''), mode = ref('sb')
function esc(s) { return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"') }
function convert() {
  const lines = input.value.split('\n')
  if (mode.value === 'sb') {
    output.value = 'StringBuilder sb = new StringBuilder();\n' + lines.map(l => `sb.Append("${esc(l)}\\n");`).join('\n')
  } else if (mode.value === 'writer') {
    output.value = lines.map(l => `writer.Write("${esc(l)}");`).join('\n')
  } else {
    const parts = lines.map(l => `"${esc(l)}"`)
    output.value = 'string html = ' + parts.join(' +\n            ') + ';'
  }
}
function clear() { input.value = ''; output.value = '' }
function copy() { navigator.clipboard.writeText(output.value).then(() => alert('✅ 已复制')) }
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 12px; }
.toolbar { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.select { padding: 6px 10px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 13px; }
.label { font-size: 12px; color: #666; font-weight: 600; margin-bottom: 4px; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.code-area { width: 100%; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: monospace; font-size: 13px; resize: vertical; box-sizing: border-box; }
.output { background: #f6f8fa; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
