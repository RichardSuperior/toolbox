<template>
  <ToolLayout title="文章内容采集">
    <div class="tool-wrap">
      <div class="tip-box">⚠️ 受浏览器跨域限制，无法直接抓取第三方网页。此工具提供模拟演示，实际使用请通过后端代理或浏览器扩展实现。</div>
      <div class="input-row">
        <input v-model="url" class="url-input" placeholder="输入网页 URL，如 https://example.com/article" />
        <button class="btn" @click="collect">采集</button>
        <button class="btn btn-outline" @click="copy" v-if="result">复制结果</button>
      </div>
      <div v-if="result" class="result-area">
        <pre>{{ result }}</pre>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const url = ref(''), result = ref('')
function collect() {
  if (!url.value.trim()) { alert('请输入 URL'); return }
  result.value = `[模拟采集结果]\n\n标题：示例文章标题\n作者：Unknown\n发布时间：${new Date().toLocaleDateString()}\n\n正文内容：\n受浏览器同源策略限制，前端无法直接请求跨域资源。\n\n建议方案：\n1. 使用 Node.js + cheerio 在服务端抓取\n2. 使用 Python requests + BeautifulSoup\n3. 安装浏览器扩展解除跨域限制\n4. 使用代理服务器转发请求\n\n当前 URL：${url.value}`
}
function copy() { navigator.clipboard.writeText(result.value).then(() => alert('✅ 已复制')) }
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 12px; }
.tip-box { background: #fff8c5; border: 1px solid #d4a017; border-radius: 6px; padding: 10px 14px; font-size: 13px; color: #856404; }
.input-row { display: flex; gap: 8px; }
.url-input { flex: 1; padding: 8px 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 14px; }
.btn { padding: 8px 16px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; white-space: nowrap; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.result-area { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 6px; padding: 16px; }
pre { white-space: pre-wrap; font-size: 13px; font-family: monospace; margin: 0; }
</style>
