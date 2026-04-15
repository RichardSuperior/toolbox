<template>
  <ToolLayout title="HTML/MarkDown 互转">
    <div class="html-md">
      <div class="tool-bar">
        <button class="btn" @click="htmlToMd">HTML → MD</button>
        <button class="btn" @click="mdToHtml">MD → HTML</button>
        <button class="btn btn-outline" @click="copyResult">复制</button>
      </div>
      <div class="editor-wrap">
        <textarea v-model="input" class="code-area" placeholder="# 标题\n\n**粗体** 和 *斜体*\n\n- 列表项"></textarea>
        <textarea v-model="output" class="code-area" readonly></textarea>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const input = ref(''), output = ref('')

function htmlToMd() {
  let md = input.value
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
  md = md.replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
  md = md.replace(/<b>(.*?)<\/b>/gi, '**$1**')
  md = md.replace(/<em>(.*?)<\/em>/gi, '*$1*')
  md = md.replace(/<i>(.*?)<\/i>/gi, '*$1*')
  md = md.replace(/<a[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)')
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
  md = md.replace(/<[^>]+>/g, '')
  md = md.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
  output.value = md.trim()
}

function mdToHtml() {
  let html = input.value
  html = html.replace(/# (.*)/g, '<h1>$1</h1>')
  html = html.replace(/## (.*)/g, '<h2>$1</h2>')
  html = html.replace(/### (.*)/g, '<h3>$1</h3>')
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  html = html.replace(/^- (.*)/gm, '<li>$1</li>')
  output.value = html
}

function copyResult() { if (!output.value) return; navigator.clipboard.writeText(output.value).then(() => alert('✅ 已复制')) }
</script>

<style scoped>
.html-md { display: flex; flex-direction: column; gap: 12px; }
.tool-bar { display: flex; gap: 8px; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.code-area { width: 100%; min-height: 300px; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 13px; resize: vertical; background: #f6f8fa; box-sizing: border-box; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
