<template>
  <ToolLayout title="XML 格式化/压缩">
    <div class="fmt-tool">
      <div class="tool-bar">
        <button class="btn" @click="format">格式化</button>
        <button class="btn" @click="compress">压缩</button>
        <button class="btn btn-outline" @click="copyResult">复制</button>
      </div>
      <div class="editor-wrap">
        <textarea v-model="input" class="code-area" placeholder="<root><item>test</item></root>"></textarea>
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
  let depth = 0
  output.value = input.value
    .replace(/>\s*</g, '>\n<')
    .split('\n')
    .map(line => {
      if (line.match(/^<\/[^\?]/) && depth > 0) depth--
      const indent = '  '.repeat(depth)
      if (line.match(/<[^\/][^>]*[^/]>/) && !line.match(/<.*\/>/)) depth++
      return indent + line.trim()
    })
    .filter(l => l)
    .join('\n')
}

function compress() {
  output.value = input.value.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim()
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
