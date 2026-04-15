<template>
  <ToolLayout title=".htaccess 转 Nginx">
    <div class="tool-wrap">
      <div class="toolbar">
        <button class="btn" @click="convert">▶ 转换</button>
        <button class="btn btn-outline" @click="clear">清空</button>
        <button class="btn btn-outline" @click="copy" v-if="output">复制</button>
      </div>
      <div class="editor-wrap">
        <div><div class="label">.htaccess 规则</div>
          <textarea v-model="input" rows="18" class="code-area" placeholder="粘贴 .htaccess 内容...

示例：
RewriteEngine On
RewriteRule ^old-page$ /new-page [R=301,L]
Options -Indexes
ErrorDocument 404 /404.html"></textarea></div>
        <div><div class="label">Nginx 配置</div>
          <textarea v-model="output" rows="18" readonly class="code-area output"></textarea></div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const input = ref(''), output = ref('')
function convert() {
  const lines = input.value.split('\n')
  let result = []
  result.push('# Nginx 配置（由 .htaccess 转换）')
  result.push('# 注意：部分规则可能需要手动调整')
  result.push('')
  for (const raw of lines) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) {
      result.push(line); continue
    }
    const lower = line.toLowerCase()
    if (/^rewriteengine/i.test(line)) { result.push('# RewriteEngine: 在 server 或 location 块中启用 rewrite 模块'); continue }
    if (/^rewriterule/i.test(line)) {
      const m = line.match(/RewriteRule\s+\^?([^\s]+)\$?\s+([^\s]+)(?:\s+\[([^\]]+)\])?/i)
      if (m) {
        const [, from, to, flags = ''] = m
        const code = flags.includes('301') ? '301' : flags.includes('302') ? '302' : '301'
        result.push(`rewrite ^/${from}$ ${to} ${code};`)
      } else { result.push('# ' + line + '  # (需要手动转换)') }
      continue
    }
    if (/^options\s+-?indexes/i.test(line)) { result.push('autoindex off;'); continue }
    if (/^options\s+\+?indexes/i.test(line)) { result.push('autoindex on;'); continue }
    if (/^errordocument/i.test(line)) {
      const m = line.match(/ErrorDocument\s+(\d+)\s+(.+)/i)
      if (m) result.push(`error_page ${m[1]} ${m[2].trim()};`)
      continue
    }
    if (/^allowoverride/i.test(line)) { result.push('# AllowOverride: Nginx 不需要此指令'); continue }
    if (/^order\s/i.test(line) || /^allow\s/i.test(line) || /^deny\s/i.test(line)) {
      result.push(`# Apache ACL: ${line}  # 请转换为 Nginx allow/deny 语法`); continue
    }
    result.push(`# ${line}  # (未自动转换，请手动处理)`)
  }
  output.value = result.join('\n')
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
