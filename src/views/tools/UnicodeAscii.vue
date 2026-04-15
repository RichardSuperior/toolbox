<template>
  <ToolLayout title="Unicode/ASCII 转换">
    <div class="tool-wrap">
      <div class="toolbar">
        <button class="btn" @click="toUnicode">文字 → Unicode</button>
        <button class="btn" @click="fromUnicode">Unicode → 文字</button>
        <button class="btn btn-outline" @click="clear">清空</button>
        <button class="btn btn-outline" @click="copy" v-if="output">复制</button>
        <select v-model="format" class="select">
          <option value="U+">U+ 格式</option>
          <option value="\\u">\\u 格式</option>
          <option value="&#x">HTML 实体</option>
          <option value="decimal">十进制</option>
        </select>
      </div>
      <div class="editor-wrap">
        <div><div class="label">输入</div>
          <textarea v-model="input" rows="14" class="code-area" placeholder="输入文字或 Unicode 编码..."></textarea></div>
        <div><div class="label">输出</div>
          <textarea v-model="output" rows="14" readonly class="code-area output"></textarea></div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const input = ref(''), output = ref(''), format = ref('U+')
function toUnicode() {
  output.value = [...input.value].map(c => {
    const code = c.codePointAt(0)
    if (format.value === 'U+') return 'U+' + code.toString(16).toUpperCase().padStart(4, '0')
    if (format.value === '\\u') return '\\u' + code.toString(16).padStart(4, '0')
    if (format.value === '&#x') return '&#x' + code.toString(16).toUpperCase() + ';'
    return code
  }).join(' ')
}
function fromUnicode() {
  try {
    let t = input.value
    t = t.replace(/U\+([0-9A-Fa-f]+)/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    t = t.replace(/\\u([0-9A-Fa-f]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    t = t.replace(/&#x([0-9A-Fa-f]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    t = t.replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    output.value = t
  } catch(e) { alert('解析失败: ' + e.message) }
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
