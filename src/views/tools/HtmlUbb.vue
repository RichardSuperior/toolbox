<template>
  <ToolLayout title="HTML/UBB 互转">
    <div class="tool-wrap">
      <div class="toolbar">
        <button class="btn" @click="htmlToUbb">HTML → UBB</button>
        <button class="btn" @click="ubbToHtml">UBB → HTML</button>
        <button class="btn btn-outline" @click="clear">清空</button>
        <button class="btn btn-outline" @click="copy" v-if="output">复制</button>
      </div>
      <div class="editor-wrap">
        <div><div class="label">输入</div>
          <textarea v-model="input" rows="16" class="code-area" placeholder="输入 HTML 或 UBB 代码...

UBB 示例：
[b]粗体[/b] [i]斜体[/i]
[url=https://example.com]链接文字[/url]
[img]https://example.com/img.png[/img]
[color=red]红色文字[/color]
[size=3]大号文字[/size]"></textarea></div>
        <div><div class="label">输出</div>
          <textarea v-model="output" rows="16" readonly class="code-area output"></textarea></div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const input = ref(''), output = ref('')
function htmlToUbb() {
  let t = input.value
  t = t.replace(/<b>(.*?)<\/b>/gi, '[b]$1[/b]')
  t = t.replace(/<strong>(.*?)<\/strong>/gi, '[b]$1[/b]')
  t = t.replace(/<i>(.*?)<\/i>/gi, '[i]$1[/i]')
  t = t.replace(/<em>(.*?)<\/em>/gi, '[i]$1[/i]')
  t = t.replace(/<u>(.*?)<\/u>/gi, '[u]$1[/u]')
  t = t.replace(/<a\s+href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[url=$1]$2[/url]')
  t = t.replace(/<img[^>]+src=["']([^"']*)["'][^>]*/gi, '[img]$1[/img]')
  t = t.replace(/<font\s+color=["']([^"']*)["'][^>]*>(.*?)<\/font>/gi, '[color=$1]$2[/color]')
  t = t.replace(/<br\s*\/?>/gi, '\n')
  t = t.replace(/<[^>]+>/g, '')
  output.value = t
}
function ubbToHtml() {
  let t = input.value
  t = t.replace(/\[b\](.*?)\[\/b\]/gi, '<strong>$1</strong>')
  t = t.replace(/\[i\](.*?)\[\/i\]/gi, '<em>$1</em>')
  t = t.replace(/\[u\](.*?)\[\/u\]/gi, '<u>$1</u>')
  t = t.replace(/\[url=(.*?)\](.*?)\[\/url\]/gi, '<a href="$1">$2</a>')
  t = t.replace(/\[img\](.*?)\[\/img\]/gi, '<img src="$1" alt="">')
  t = t.replace(/\[color=(.*?)\](.*?)\[\/color\]/gi, '<font color="$1">$2</font>')
  t = t.replace(/\[size=(\d+)\](.*?)\[\/size\]/gi, '<font size="$1">$2</font>')
  t = t.replace(/\n/g, '<br>')
  output.value = t
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
