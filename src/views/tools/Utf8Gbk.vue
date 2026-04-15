<template>
  <ToolLayout title="UTF-8/GBK 编码转换">
    <div class="tool-wrap">
      <div class="info-box">
        <p>🔤 <strong>编码说明</strong></p>
        <p>浏览器内部使用 UTF-16，前端 JS 无法直接进行 UTF-8 ↔ GBK 互转。以下提供 UTF-8 字节查看和常用转换说明。</p>
      </div>
      <div class="tabs">
        <button class="tab" :class="{active:tab==='utf8'}" @click="tab='utf8'">UTF-8 字节查看</button>
        <button class="tab" :class="{active:tab==='escape'}" @click="tab='escape'">URL 编码转换</button>
        <button class="tab" :class="{active:tab==='guide'}" @click="tab='guide'">转换指南</button>
      </div>
      <div v-if="tab==='utf8'">
        <div class="toolbar">
          <button class="btn" @click="showUtf8">查看 UTF-8 字节</button>
          <button class="btn btn-outline" @click="clear">清空</button>
        </div>
        <div class="editor-wrap">
          <div><div class="label">输入文本</div>
            <textarea v-model="input" rows="10" class="code-area" placeholder="输入文本..."></textarea></div>
          <div><div class="label">UTF-8 字节（16进制）</div>
            <textarea v-model="output" rows="10" readonly class="code-area output"></textarea></div>
        </div>
      </div>
      <div v-if="tab==='escape'">
        <div class="toolbar">
          <button class="btn" @click="encodeUrl">URL 编码</button>
          <button class="btn" @click="decodeUrl">URL 解码</button>
          <button class="btn btn-outline" @click="clear">清空</button>
        </div>
        <div class="editor-wrap">
          <div><div class="label">输入</div>
            <textarea v-model="input" rows="10" class="code-area" placeholder="输入文本或URL编码..."></textarea></div>
          <div><div class="label">输出</div>
            <textarea v-model="output" rows="10" readonly class="code-area output"></textarea></div>
        </div>
      </div>
      <div v-if="tab==='guide'" class="guide-box">
        <h3>UTF-8 转 GBK 的正确方式</h3>
        <ul>
          <li><strong>Python：</strong><code>text.encode('utf-8').decode('gbk', errors='ignore')</code></li>
          <li><strong>Node.js：</strong>使用 <code>iconv-lite</code> 包：<code>iconv.decode(buf, 'gbk')</code></li>
          <li><strong>Java：</strong><code>new String(bytes, "GBK")</code></li>
          <li><strong>PHP：</strong><code>mb_convert_encoding($str, 'GBK', 'UTF-8')</code></li>
          <li><strong>命令行：</strong><code>iconv -f UTF-8 -t GBK input.txt -o output.txt</code></li>
        </ul>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const tab = ref('utf8'), input = ref(''), output = ref('')
function showUtf8() {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(input.value)
  output.value = Array.from(bytes).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ')
}
function encodeUrl() { output.value = encodeURIComponent(input.value) }
function decodeUrl() {
  try { output.value = decodeURIComponent(input.value) }
  catch(e) { alert('解码失败: ' + e.message) }
}
function clear() { input.value = ''; output.value = '' }
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 12px; }
.info-box { background: #fff8c5; border: 1px solid #d4a017; border-radius: 8px; padding: 12px 16px; font-size: 13px; }
.info-box p { margin: 4px 0; }
.tabs { display: flex; gap: 6px; }
.tab { padding: 6px 16px; border: 1px solid #d0d7de; border-radius: 6px; background: white; cursor: pointer; font-size: 13px; }
.tab.active { background: #0969da; color: white; border-color: #0969da; }
.toolbar { display: flex; gap: 8px; margin-bottom: 8px; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.label { font-size: 12px; color: #666; font-weight: 600; margin-bottom: 4px; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.code-area { width: 100%; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: monospace; font-size: 13px; resize: vertical; box-sizing: border-box; }
.output { background: #f6f8fa; }
.guide-box { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 14px 16px; font-size: 13px; }
.guide-box h3 { margin: 0 0 10px; font-size: 14px; }
.guide-box ul { margin: 0; padding-left: 20px; line-height: 1.9; }
code { background: #eef1f5; padding: 1px 5px; border-radius: 3px; font-family: monospace; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
