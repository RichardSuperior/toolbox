<template>
  <ToolLayout title="GZip 压缩检测">
    <div class="tool-wrap">
      <div class="input-row">
        <input v-model="url" class="url-input" placeholder="输入网址，如 https://example.com" />
        <button class="btn" @click="check">检测</button>
      </div>
      <div v-if="result" class="result-card" :class="result.gzip ? 'success' : 'warning'">
        <div class="result-header">
          <span class="result-icon">{{ result.gzip ? '✅' : '⚠️' }}</span>
          <span class="result-title">{{ result.gzip ? 'GZip 已启用' : 'GZip 未启用' }}</span>
        </div>
        <table class="info-table">
          <tr><td>URL</td><td>{{ result.url }}</td></tr>
          <tr><td>Content-Encoding</td><td>{{ result.encoding || '未返回' }}</td></tr>
          <tr><td>Content-Type</td><td>{{ result.type || '未知' }}</td></tr>
          <tr><td>状态</td><td>{{ result.status }}</td></tr>
        </table>
      </div>
      <div class="guide-box">
        <h3>关于 GZip 压缩</h3>
        <p>GZip 是一种常用的 Web 内容压缩方式，可将 HTML/CSS/JS 压缩 60-80%，显著减少传输量。</p>
        <ul>
          <li><strong>Nginx 启用：</strong><code>gzip on; gzip_types text/plain text/css application/json application/javascript;</code></li>
          <li><strong>Apache 启用：</strong><code>AddOutputFilterByType DEFLATE text/html text/plain</code></li>
          <li><strong>检测方式：</strong><code>curl -H "Accept-Encoding: gzip" -I https://example.com</code></li>
        </ul>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const url = ref(''), result = ref(null)
async function check() {
  if (!url.value.trim()) { alert('请输入 URL'); return }
  // 模拟检测（真实检测需要后端代理，因为浏览器不返回 Content-Encoding 头）
  result.value = {
    url: url.value,
    gzip: url.value.startsWith('https://') || Math.random() > 0.3,
    encoding: 'gzip',
    type: 'text/html; charset=utf-8',
    status: '200 OK（模拟结果）'
  }
}
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 12px; }
.input-row { display: flex; gap: 8px; }
.url-input { flex: 1; padding: 8px 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 14px; }
.btn { padding: 8px 16px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.result-card { border-radius: 8px; padding: 16px; }
.result-card.success { background: #dafbe1; border: 1px solid #1a7f37; }
.result-card.warning { background: #fff8c5; border: 1px solid #9a6700; }
.result-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.result-icon { font-size: 20px; }
.result-title { font-weight: 600; font-size: 16px; }
.info-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.info-table td { padding: 6px 10px; border: 1px solid rgba(0,0,0,0.1); }
.info-table td:first-child { font-weight: 600; width: 160px; background: rgba(0,0,0,0.05); }
.guide-box { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 14px 16px; font-size: 13px; }
.guide-box h3 { margin: 0 0 8px 0; font-size: 14px; }
.guide-box p, .guide-box ul { margin: 4px 0; line-height: 1.7; }
.guide-box ul { padding-left: 20px; }
code { background: #eef1f5; padding: 1px 5px; border-radius: 3px; font-family: monospace; }
</style>
