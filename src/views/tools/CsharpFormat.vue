<template>
  <ToolLayout title="C# 代码格式化">
    <div class="fmt-tool">
      <div class="tool-bar">
        <button class="btn" @click="format">格式化</button>
        <button class="btn btn-outline" @click="copyResult">复制</button>
      </div>
      <div class="editor-wrap">
        <textarea v-model="input" class="code-area" placeholder="public class Test{public void Run(){Console.WriteLine(&quot;Hello&quot;);}}"></textarea>
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
  output.value = input.value
    .replace(/\{/g, '{\n')
    .replace(/\}/g, '\n}\n')
    .replace(/;/g, ';\n')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map((line, i, arr) => {
      if (line.trim() === '}' && i > 0 && !arr[i-1].trim().startsWith('{')) return '\n' + line
      return '  '.repeat((line.match(/^\s*/)[0].length / 2)) + line.trim()
    })
    .join('\n')
    .trim()
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
