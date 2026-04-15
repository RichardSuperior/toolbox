<template>
  <ToolLayout title="迅雷/磁力链接转换">
    <div class="tool-wrap">
      <div class="toolbar">
        <button class="btn" @click="toThunder">转迅雷链接</button>
        <button class="btn" @click="fromThunder">迅雷→原链接</button>
        <button class="btn btn-outline" @click="clear">清空</button>
        <button class="btn btn-outline" @click="copy" v-if="output">复制</button>
      </div>
      <div class="editor-wrap">
        <div><div class="label">输入（HTTP/FTP/磁力链接 或 迅雷链接）</div>
          <textarea v-model="input" rows="10" class="code-area" placeholder="输入原始下载链接，如：
http://example.com/file.zip
ftp://example.com/file.zip
magnet:?xt=urn:btih:..."></textarea></div>
        <div><div class="label">输出</div>
          <textarea v-model="output" rows="10" readonly class="code-area output"></textarea></div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const input = ref(''), output = ref('')
function toThunder() {
  const lines = input.value.trim().split('\n').filter(Boolean)
  output.value = lines.map(url => {
    const encoded = btoa('AA' + url.trim() + 'ZZ')
    return 'thunder://' + encoded
  }).join('\n')
}
function fromThunder() {
  const lines = input.value.trim().split('\n').filter(Boolean)
  output.value = lines.map(link => {
    try {
      const encoded = link.replace(/^thunder:\/\//i, '')
      const decoded = atob(encoded)
      return decoded.slice(2, -2) // 去除 AA 和 ZZ
    } catch { return '解析失败: ' + link }
  }).join('\n')
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
.code-area { width: 100%; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: monospace; font-size: 13px; resize: vertical; box-sizing: border-box; }
.output { background: #f6f8fa; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
