<template>
  <ToolLayout title="全角半角转换">
    <div class="tool-wrap">
      <div class="toolbar">
        <button class="btn" @click="toHalf">全角 → 半角</button>
        <button class="btn" @click="toFull">半角 → 全角</button>
        <button class="btn btn-outline" @click="clear">清空</button>
        <button class="btn btn-outline" @click="copy" v-if="output">复制</button>
      </div>
      <div class="editor-wrap">
        <div><div class="label">输入</div>
          <textarea v-model="input" rows="14" class="code-area" placeholder="输入需要转换的文本（全角：ＡＢＣＤ，半角：ABCD）..."></textarea></div>
        <div><div class="label">输出</div>
          <textarea v-model="output" rows="14" readonly class="code-area output"></textarea></div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const input = ref(''), output = ref('')
function toHalf() {
  output.value = [...input.value].map(c => {
    const code = c.charCodeAt(0)
    if (c === '\u3000') return ' '
    if (code >= 0xFF01 && code <= 0xFF5E) return String.fromCharCode(code - 0xFEE0)
    return c
  }).join('')
}
function toFull() {
  output.value = [...input.value].map(c => {
    if (c === ' ') return '\u3000'
    const code = c.charCodeAt(0)
    if (code >= 0x21 && code <= 0x7E) return String.fromCharCode(code + 0xFEE0)
    return c
  }).join('')
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
.code-area { width: 100%; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 14px; resize: vertical; box-sizing: border-box; }
.output { background: #f6f8fa; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
