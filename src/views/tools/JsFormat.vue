<template>
  <ToolLayout title="JS 格式化/压缩">
    <div class="js-format">
      <div class="tool-bar">
        <button class="btn" @click="format">格式化</button>
        <button class="btn" @click="compress">压缩</button>
        <button class="btn btn-outline" @click="copyResult">复制</button>
        <button class="btn btn-outline" @click="clearAll">清空</button>
      </div>
      <div class="editor-wrap">
        <div class="input-wrap">
          <div class="label">输入 JavaScript</div>
          <textarea v-model="input" class="code-area" placeholder="const fn=function(a,b){return a+b};"></textarea>
        </div>
        <div class="output-wrap">
          <div class="label">输出 <span class="size-info">{{ output.length }} 字符</span></div>
          <textarea v-model="output" class="code-area" readonly></textarea>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const input = ref('')
const output = ref('')

function format() {
  let depth = 0
  let result = ''
  let inString = ''
  for (let i = 0; i < input.value.length; i++) {
    const char = input.value[i]
    if (inString) { result += char; if (char === inString) inString = '' }
    else if (char === '"' || char === "'" || char === '`') { inString = char; result += char }
    else if (char === '{' || char === '[' || char === '(') { depth++; result += char }
    else if (char === '}' || char === ']' || char === ')') { depth--; result += char }
    else if (char === ';') { result += ';\n' + '  '.repeat(depth) }
    else { result += char }
  }
  output.value = result.trim()
}

function compress() {
  output.value = input.value
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,:])\s*/g, '$1')
    .replace(/;\}/g, '}')
    .trim()
}

function copyResult() {
  if (!output.value) return
  navigator.clipboard.writeText(output.value).then(() => alert('✅ 已复制'))
}

function clearAll() { input.value = ''; output.value = '' }
</script>

<style scoped>
.js-format { display: flex; flex-direction: column; gap: 12px; }
.tool-bar { display: flex; gap: 8px; flex-wrap: wrap; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn:hover { background: #0860ca; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.btn-outline:hover { background: #f6f8fa; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.label { font-weight: 600; font-size: 14px; color: #24292f; margin-bottom: 6px; }
.size-info { font-weight: normal; font-size: 12px; color: #666; }
.code-area { width: 100%; min-height: 350px; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 13px; resize: vertical; background: #f6f8fa; box-sizing: border-box; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
