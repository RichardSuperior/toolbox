<template>
  <ToolLayout title="运行 JS/HTML/CSS">
    <div class="run-code">
      <div class="tool-bar">
        <button class="btn" @click="runCode">▶ 运行</button>
        <button class="btn btn-secondary" @click="clearOutput">清空输出</button>
      </div>
      <div class="editor-wrap">
        <div class="input-wrap">
          <div class="label">代码</div>
          <textarea v-model="code" class="code-area" placeholder="// 输入 JavaScript/HTML/CSS 代码\nconsole.log('Hello, World!');"></textarea>
        </div>
        <div class="output-wrap">
          <div class="label">输出</div>
          <div class="output-box">{{ output }}</div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const code = ref(''), output = ref('')

function runCode() {
  output.value = ''
  const oldLog = console.log
  const oldError = console.error
  const logs = []
  console.log = (...args) => logs.push(args.map(String).join(' '))
  console.error = (...args) => logs.push('[ERROR] ' + args.map(String).join(' '))
  try {
    new Function(code.value)()
  } catch (e) {
    logs.push('[JS Error] ' + e.message)
  }
  console.log = oldLog
  console.error = oldError
  output.value = logs.join('\n') || '(无输出)'
}
function clearOutput() { output.value = '' }
</script>

<style scoped>
.run-code { display: flex; flex-direction: column; gap: 12px; }
.tool-bar { display: flex; gap: 8px; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-secondary { background: #6e7781; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.label { font-weight: 600; font-size: 14px; color: #24292f; margin-bottom: 6px; }
.code-area { width: 100%; min-height: 350px; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 13px; resize: vertical; background: #f6f8fa; box-sizing: border-box; }
.output-box { width: 100%; min-height: 350px; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 13px; background: #1e1e1e; color: #d4d4d4; white-space: pre-wrap; overflow-y: auto; box-sizing: border-box; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
