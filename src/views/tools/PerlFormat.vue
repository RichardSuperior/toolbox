<template>
  <ToolLayout title="Perl 代码格式化">
    <div class="tool-wrap">
      <div class="toolbar">
        <button class="btn" @click="format">▶ 格式化</button>
        <button class="btn btn-outline" @click="clear">清空</button>
        <button class="btn btn-outline" @click="copy" v-if="output">复制</button>
        <label class="opt-label">缩进: <select v-model="indent" class="select">
          <option value="2">2空格</option><option value="4">4空格</option>
        </select></label>
      </div>
      <div class="editor-wrap">
        <div><div class="label">Perl 源代码</div>
          <textarea v-model="input" rows="20" class="code-area" placeholder="粘贴 Perl 代码..."></textarea></div>
        <div><div class="label">格式化结果</div>
          <textarea v-model="output" rows="20" readonly class="code-area output"></textarea></div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const input = ref(''), output = ref(''), indent = ref('4')
function format() {
  const IND = ' '.repeat(+indent.value)
  let level = 0, result = ''
  for (let line of input.value.split('\n')) {
    line = line.trim()
    if (!line) { result += '\n'; continue }
    if (line.startsWith('}') || line.startsWith(')')) level = Math.max(0, level - 1)
    result += IND.repeat(level) + line + '\n'
    if (line.endsWith('{') || line.endsWith('(')) level++
  }
  output.value = result.trim()
}
function clear() { input.value = ''; output.value = '' }
function copy() { navigator.clipboard.writeText(output.value).then(() => alert('✅ 已复制')) }
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 12px; }
.toolbar { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.opt-label { font-size: 13px; display: flex; align-items: center; gap: 6px; }
.select { padding: 4px 8px; border: 1px solid #d0d7de; border-radius: 4px; font-size: 13px; }
.label { font-size: 12px; color: #666; font-weight: 600; margin-bottom: 4px; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.code-area { width: 100%; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: monospace; font-size: 13px; resize: vertical; box-sizing: border-box; }
.output { background: #f6f8fa; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
