<template>
  <ToolLayout title="Python 代码格式化">
    <div class="fmt-tool">
      <div class="tool-bar">
        <button class="btn" @click="format">格式化</button>
        <button class="btn btn-outline" @click="copyResult">复制</button>
      </div>
      <div class="editor-wrap">
        <textarea v-model="input" class="code-area" placeholder="def main():print('Hello');x=1+2;return x"></textarea>
        <textarea v-model="output" class="code-area" readonly></textarea>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const input = ref(''), output = ref('')

function format() {
  const lines = input.value.split('\n')
  const result = []
  let indentLevel = 0
  lines.forEach(line => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) { result.push(trimmed); return }
    if (trimmed.startsWith('@') || trimmed.startsWith('def ') || trimmed.startsWith('class ')) {
      if (indentLevel > 0) result.push('')
      result.push(' '.repeat(indentLevel * 4) + trimmed)
      indentLevel = 1
    } else if (trimmed.startsWith('return') || trimmed.startsWith('break') || trimmed.startsWith('continue') || trimmed.startsWith('pass')) {
      indentLevel = Math.max(0, indentLevel - 1)
      result.push(' '.repeat(indentLevel * 4) + trimmed)
    } else if (trimmed.startsWith('else:') || trimmed.startsWith('elif ') || trimmed.startsWith('except:') || trimmed.startsWith('finally:')) {
      indentLevel = Math.max(0, indentLevel - 1)
      result.push(' '.repeat(indentLevel * 4) + trimmed)
      indentLevel++
    } else if (trimmed.endsWith(':')) {
      result.push(' '.repeat(indentLevel * 4) + trimmed)
      indentLevel++
    } else {
      result.push(' '.repeat(indentLevel * 4) + trimmed)
    }
  })
  output.value = result.join('\n')
}

function copyResult() { if (!output.value) return; navigator.clipboard.writeText(output.value).then(() => alert('✅ 已复制')) }
</script>

<style scoped>
.fmt-tool { display: flex; flex-direction: column; gap: 12px; }
.tool-bar { display: flex; gap: 8px; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.code-area { width: 100%; min-height: 350px; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 13px; resize: vertical; background: #f6f8fa; box-sizing: border-box; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
