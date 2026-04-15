<template>
  <ToolLayout title="常用 User-Agent">
    <div class="ua-list">
      <div class="card" v-for="(ua, i) in uaList" :key="i" @click="copy(ua)">
        <div class="ua-name">{{ ua.name }}</div>
        <div class="ua-text">{{ ua.value }}</div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import ToolLayout from '../../components/ToolLayout.vue'
const uaList = [
  { name: 'Chrome (Windows)', value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
  { name: 'Chrome (macOS)', value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
  { name: 'Firefox (Windows)', value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0' },
  { name: 'Safari (macOS)', value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15' },
  { name: 'Edge (Windows)', value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0' },
  { name: 'iPhone Safari', value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1' },
  { name: 'Android Chrome', value: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36' },
  { name: 'Python Requests', value: 'python-requests/2.31.0' },
  { name: 'curl', value: 'curl/8.4.0' },
  { name: 'Node.js axios', value: 'axios/1.6.0' },
]
function copy(ua) { navigator.clipboard.writeText(ua.value).then(() => alert('已复制: ' + ua.name)) }
</script>

<style scoped>
.ua-list { display: flex; flex-direction: column; gap: 8px; }
.card { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 12px; cursor: pointer; transition: all 0.2s; }
.card:hover { background: #eaeef2; border-color: #0969da; }
.ua-name { font-weight: 600; font-size: 13px; color: #24292f; margin-bottom: 4px; }
.ua-text { font-family: 'Fira Code', monospace; font-size: 11px; color: #0969da; word-break: break-all; }
</style>
