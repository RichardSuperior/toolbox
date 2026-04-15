<template>
  <ToolLayout title="VBScript 代码格式化">
    <div class="tool-wrap">
      <div class="toolbar">
        <button class="btn" @click="format">▶ 格式化</button>
        <button class="btn btn-outline" @click="clear">清空</button>
        <button class="btn btn-outline" @click="copy" v-if="output">复制</button>
      </div>
      <div class="editor-wrap">
        <div><div class="label">VBScript 源代码</div>
          <textarea v-model="input" rows="20" class="code-area" placeholder="粘贴 VBScript/VBA 代码..."></textarea></div>
        <div><div class="label">格式化结果</div>
          <textarea v-model="output" rows="20" readonly class="code-area output"></textarea></div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const input = ref(''), output = ref('')
const OPEN = /^\s*(Sub|Function|If|For|Do|While|Select|With|Class)\b/i
const CLOSE = /^\s*(End\s+(Sub|Function|If|Select|With|Class)|Loop|Next|Wend)\b/i
const ELSE = /^\s*(Else|ElseIf|Case)\b/i
function format() {
  const IND = '    '
  let level = 0, result = ''
  for (let line of input.value.split('\n')) {
    const t = line.trim()
    if (!t) { result += '\n'; continue }
    if (CLOSE.test(t)) level = Math.max(0, level - 1)
    if (ELSE.test(t)) {
      result += IND.repeat(Math.max(0, level - 1)) + t + '\n'
    } else {
      result += IND.repeat(level) + t + '\n'
    }
    if (OPEN.test(t)) level++
  }
  output.value = result.trim()
}
function clear() { input.value = ''; output.value = '' }
function copy() { navigator.clipboard.writeText(output.value).then(() => alert('✅ 已复制')) }
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 12px; }
.toolbar { display: flex; gap: 8px; flex-wrap: wrap; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.label { font-size: 12px; color: #666; font-weight: 600; margin-bottom: 4px; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.code-area { width: 100%; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: monospace; font-size: 13px; resize: vertical; box-sizing: border-box; }
.output { background: #f6f8fa; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
