<template>
  <ToolLayout title="死链检测">
    <div class="tool-wrap">
      <div class="tip-box">⚠️ 受浏览器跨域限制，无法直接请求外部 URL。此工具提供说明和建议方案。</div>
      <div class="input-row">
        <textarea v-model="urls" rows="6" class="url-area" placeholder="每行输入一个 URL，如&#10;https://example.com/page1&#10;https://example.com/page2"></textarea>
      </div>
      <button class="btn" @click="check">检测（模拟）</button>
      <div v-if="results.length" class="results">
        <div v-for="r in results" :key="r.url" class="result-item" :class="r.status">
          <span class="status-icon">{{ r.icon }}</span>
          <span class="result-url">{{ r.url }}</span>
          <span class="result-note">{{ r.note }}</span>
        </div>
      </div>
      <div class="guide-box">
        <h3>实用方案</h3>
        <ul>
          <li>使用 Python <code>requests</code> 批量检测 HTTP 状态码</li>
          <li>使用 <code>wget --spider</code> 命令行检测</li>
          <li>使用 Google Search Console 检查站点死链</li>
          <li>使用 Screaming Frog SEO Spider 工具</li>
          <li>使用 <code>curl -I url</code> 查看响应头</li>
        </ul>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const urls = ref(''), results = ref([])
function check() {
  const list = urls.value.trim().split('\n').filter(Boolean)
  if (!list.length) { alert('请输入至少一个 URL'); return }
  results.value = list.map(url => ({
    url,
    status: Math.random() > 0.3 ? 'ok' : 'error',
    icon: Math.random() > 0.3 ? '✅' : '❌',
    note: Math.random() > 0.3 ? '200 OK（模拟）' : '404 Not Found（模拟）'
  }))
}
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 12px; }
.tip-box { background: #fff8c5; border: 1px solid #d4a017; border-radius: 6px; padding: 10px 14px; font-size: 13px; color: #856404; }
.url-area { width: 100%; padding: 10px 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 13px; font-family: monospace; resize: vertical; box-sizing: border-box; }
.btn { padding: 8px 18px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; align-self: flex-start; }
.results { display: flex; flex-direction: column; gap: 6px; }
.result-item { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 6px; background: #f6f8fa; }
.result-item.ok { border-left: 3px solid #1a7f37; }
.result-item.error { border-left: 3px solid #cf222e; }
.status-icon { font-size: 14px; }
.result-url { flex: 1; font-size: 13px; font-family: monospace; word-break: break-all; }
.result-note { font-size: 12px; color: #666; white-space: nowrap; }
.guide-box { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 14px 16px; }
.guide-box h3 { margin: 0 0 8px 0; font-size: 14px; }
.guide-box ul { margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.8; }
code { background: #eef1f5; padding: 1px 5px; border-radius: 3px; font-family: monospace; }
</style>
