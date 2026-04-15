<template>
  <ToolLayout title="HTTP 请求头信息">
    <div class="tool-wrap">
      <div class="tip-box">ℹ️ 以下是您当前浏览器发送的请求信息（客户端可见部分）。完整服务端请求头需通过后端接口获取。</div>
      <div class="info-grid">
        <div v-for="item in headers" :key="item.name" class="info-item">
          <div class="info-name">{{ item.name }}</div>
          <div class="info-value">{{ item.value }}</div>
        </div>
      </div>
      <div class="section-title">常见 HTTP 请求头说明</div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>请求头</th><th>说明</th><th>示例值</th></tr></thead>
          <tbody>
            <tr v-for="h in commonHeaders" :key="h.name">
              <td><code>{{ h.name }}</code></td>
              <td>{{ h.desc }}</td>
              <td class="example">{{ h.example }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const headers = ref([
  { name: 'User-Agent', value: navigator.userAgent },
  { name: 'Language', value: navigator.language },
  { name: 'Platform', value: navigator.platform },
  { name: 'Cookie Enabled', value: navigator.cookieEnabled ? '是' : '否' },
  { name: 'Screen', value: `${screen.width}x${screen.height}` },
  { name: 'Color Depth', value: `${screen.colorDepth}-bit` },
  { name: 'Online', value: navigator.onLine ? '在线' : '离线' },
  { name: 'Connection', value: navigator.connection ? navigator.connection.effectiveType || '未知' : '未知' },
])
const commonHeaders = [
  { name: 'Accept', desc: '客户端能处理的内容类型', example: 'text/html,application/json' },
  { name: 'Accept-Encoding', desc: '支持的压缩算法', example: 'gzip, deflate, br' },
  { name: 'Accept-Language', desc: '首选语言', example: 'zh-CN,zh;q=0.9' },
  { name: 'Authorization', desc: '认证信息', example: 'Bearer eyJhbGci...' },
  { name: 'Cache-Control', desc: '缓存控制', example: 'no-cache' },
  { name: 'Content-Type', desc: '请求体类型（POST）', example: 'application/json' },
  { name: 'Cookie', desc: '携带 Cookie', example: 'session=abc123' },
  { name: 'Host', desc: '目标主机名', example: 'example.com' },
  { name: 'Origin', desc: '请求来源（CORS）', example: 'https://example.com' },
  { name: 'Referer', desc: '来源页面 URL', example: 'https://google.com' },
  { name: 'User-Agent', desc: '客户端标识', example: 'Mozilla/5.0...' },
  { name: 'X-Requested-With', desc: 'Ajax 标识', example: 'XMLHttpRequest' },
  { name: 'X-Forwarded-For', desc: '代理经过的 IP', example: '203.0.113.195' },
]
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 16px; }
.tip-box { background: #ddf4ff; border: 1px solid #54aeff; border-radius: 6px; padding: 10px 14px; font-size: 13px; color: #0550ae; }
.info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 8px; }
.info-item { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 6px; padding: 10px 14px; }
.info-name { font-size: 12px; font-weight: 600; color: #666; margin-bottom: 4px; }
.info-value { font-size: 13px; word-break: break-all; font-family: monospace; }
.section-title { font-size: 15px; font-weight: 600; border-bottom: 2px solid #0969da; padding-bottom: 6px; }
.table-wrap { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th, .data-table td { padding: 8px 12px; border: 1px solid #d0d7de; text-align: left; }
.data-table th { background: #f6f8fa; font-weight: 600; }
.data-table tr:hover { background: #f0f6ff; }
.example { color: #666; font-family: monospace; font-size: 12px; }
code { background: #eef1f5; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
</style>
