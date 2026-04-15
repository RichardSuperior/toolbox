<template>
  <ToolLayout title="字符串文本压缩">
    <div class="tool-wrap">
      <div class="toolbar">
        <button class="btn" @click="compress">▶ 压缩</button>
        <button class="btn btn-outline" @click="clear">清空</button>
        <button class="btn btn-outline" @click="copy" v-if="output">复制</button>
        <label class="opt-label"><input type="checkbox" v-model="removeSpace" /> 删除多余空格</label>
        <label class="opt-label"><input type="checkbox" v-model="removeNewline" /> 删除换行</label>
        <label class="opt-label"><input type="checkbox" v-model="removeComment" /> 删除注释</label>
      </div>
      <div class="editor-wrap">
        <div><div class="label">原始文本</div>
          <textarea v-model="input" rows="14" class="code-area" placeholder="粘贴需要压缩的文本..."></textarea></div>
        <div><div class="label">压缩结果</div>
          <textarea v-model="output" rows="14" readonly class="code-area output"></textarea></div>
      </div>
      <div v-if="stats" class="stats-bar">
        <span>原始: {{ stats.before }} 字符</span>
        <span>压缩后: {{ stats.after }} 字符</span>
        <span class="rate">压缩率: {{ stats.rate }}%</span>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const input = ref(''), output = ref(''), removeSpace = ref(true), removeNewline = ref(true), removeComment = ref(false)
const stats = ref(null)
function compress() {
  let t = input.value
  if (removeComment.value) {
    t = t.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '')
  }
  if (removeNewline.value) t = t.replace(/\n+/g, ' ')
  if (removeSpace.value) t = t.replace(/\s+/g, ' ').trim()
  output.value = t
  stats.value = {
    before: input.value.length,
    after: t.length,
    rate: (((input.value.length - t.length) / input.value.length) * 100).toFixed(1)
  }
}
function clear() { input.value = ''; output.value = ''; stats.value = null }
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
.code-area { width: 100%; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 13px; resize: vertical; box-sizing: border-box; }
.output { background: #f6f8fa; }
.stats-bar { display: flex; gap: 20px; background: #f0f6ff; border: 1px solid #c8e0ff; border-radius: 6px; padding: 10px 14px; font-size: 13px; }
.rate { font-weight: 700; color: #0969da; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
