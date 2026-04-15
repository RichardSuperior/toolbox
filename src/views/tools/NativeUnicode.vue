<template>
  <ToolLayout title="Native/Unicode 编码转换">
    <div class="tool-wrap">
      <div class="toolbar">
        <button class="btn" @click="toUnicode">中文 → Unicode</button>
        <button class="btn" @click="toNative">Unicode → 中文</button>
        <button class="btn btn-outline" @click="clear">清空</button>
        <button class="btn btn-outline" @click="copy" v-if="output">复制</button>
        <label class="opt-label">
          <input type="checkbox" v-model="onlyNonAscii" /> 仅转换非ASCII字符
        </label>
      </div>
      <div class="editor-wrap">
        <div><div class="label">输入</div>
          <textarea v-model="input" rows="14" class="code-area" placeholder="输入中文文本或 Unicode 编码（如 \u4e2d\u6587）..."></textarea></div>
        <div><div class="label">输出</div>
          <textarea v-model="output" rows="14" readonly class="code-area output"></textarea></div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const input = ref(''), output = ref(''), onlyNonAscii = ref(true)
function toUnicode() {
  output.value = [...input.value].map(c => {
    if (onlyNonAscii.value && c.charCodeAt(0) <= 127) return c
    return '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')
  }).join('')
}
function toNative() {
  try {
    output.value = input.value.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
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
.opt-label { font-size: 13px; display: flex; align-items: center; gap: 4px; cursor: pointer; }
.label { font-size: 12px; color: #666; font-weight: 600; margin-bottom: 4px; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.code-area { width: 100%; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: monospace; font-size: 13px; resize: vertical; box-sizing: border-box; }
.output { background: #f6f8fa; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
