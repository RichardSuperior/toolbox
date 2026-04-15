<template>
  <ToolLayout title="文本内容对比">
    <div class="tool-wrap">
      <div class="toolbar">
        <button class="btn" @click="compare">▶ 对比</button>
        <button class="btn btn-outline" @click="clear">清空</button>
      </div>
      <div class="editor-wrap">
        <div><div class="label">原文（左）</div>
          <textarea v-model="textA" rows="14" class="code-area" placeholder="粘贴原始文本..."></textarea></div>
        <div><div class="label">对比文（右）</div>
          <textarea v-model="textB" rows="14" class="code-area" placeholder="粘贴对比文本..."></textarea></div>
      </div>
      <div v-if="diffLines.length" class="diff-result">
        <div class="diff-header">对比结果：<span class="diff-stats">{{ addCount }} 行新增，{{ delCount }} 行删除，{{ sameCount }} 行相同</span></div>
        <div class="diff-view">
          <div v-for="(line, i) in diffLines" :key="i" class="diff-line" :class="line.type">
            <span class="line-num">{{ line.lineNum }}</span>
            <span class="line-mark">{{ line.type === 'add' ? '+' : line.type === 'del' ? '-' : ' ' }}</span>
            <span class="line-content">{{ line.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const textA = ref(''), textB = ref(''), diffLines = ref([])
const addCount = computed(() => diffLines.value.filter(l => l.type === 'add').length)
const delCount = computed(() => diffLines.value.filter(l => l.type === 'del').length)
const sameCount = computed(() => diffLines.value.filter(l => l.type === 'same').length)

function compare() {
  const a = textA.value.split('\n'), b = textB.value.split('\n')
  const result = []
  const maxLen = Math.max(a.length, b.length)
  let lineNum = 1
  for (let i = 0; i < maxLen; i++) {
    const la = a[i], lb = b[i]
    if (la === lb) {
      result.push({ type: 'same', text: la || '', lineNum: lineNum++ })
    } else {
      if (la !== undefined) result.push({ type: 'del', text: la, lineNum: lineNum })
      if (lb !== undefined) result.push({ type: 'add', text: lb, lineNum: lineNum })
      lineNum++
    }
  }
  diffLines.value = result
}
function clear() { textA.value = ''; textB.value = ''; diffLines.value = [] }
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 12px; }
.toolbar { display: flex; gap: 8px; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.label { font-size: 12px; color: #666; font-weight: 600; margin-bottom: 4px; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.code-area { width: 100%; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: monospace; font-size: 13px; resize: vertical; box-sizing: border-box; }
.diff-result { border: 1px solid #d0d7de; border-radius: 8px; overflow: hidden; }
.diff-header { padding: 8px 14px; background: #f6f8fa; font-size: 13px; font-weight: 600; border-bottom: 1px solid #d0d7de; }
.diff-stats { font-weight: normal; color: #666; margin-left: 10px; }
.diff-view { font-family: monospace; font-size: 12px; }
.diff-line { display: flex; gap: 6px; padding: 2px 10px; align-items: flex-start; }
.diff-line.add { background: #dafbe1; }
.diff-line.del { background: #ffebe9; }
.diff-line.same { background: white; }
.line-num { width: 35px; color: #999; text-align: right; flex-shrink: 0; padding-top: 1px; }
.line-mark { width: 12px; flex-shrink: 0; font-weight: 700; }
.diff-line.add .line-mark { color: #1a7f37; }
.diff-line.del .line-mark { color: #cf222e; }
.line-content { flex: 1; white-space: pre-wrap; word-break: break-all; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
