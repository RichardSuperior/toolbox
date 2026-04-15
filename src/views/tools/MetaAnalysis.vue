<template>
  <ToolLayout title="网页 Meta 分析">
    <div class="tool-wrap">
      <div class="tip-box">ℹ️ 受跨域限制，直接抓取外部网页的 meta 信息需要后端代理。此工具提供手动粘贴分析和常用平台入口。</div>
      <div class="tabs">
        <button class="tab" :class="{ active: mode === 'paste' }" @click="mode = 'paste'">粘贴 HTML 分析</button>
        <button class="tab" :class="{ active: mode === 'query' }" @click="mode = 'query'">在线查询工具</button>
      </div>
      <div v-if="mode === 'paste'">
        <div class="label">粘贴网页源码</div>
        <textarea v-model="html" rows="10" class="code-area" placeholder="粘贴网页 HTML 源码（可通过浏览器右键查看源代码获取）..."></textarea>
        <button class="btn" @click="analyze" style="margin-top:8px">分析</button>
        <div v-if="metas.length" class="meta-list">
          <div v-for="m in metas" :key="m.name + m.property" class="meta-item">
            <div class="meta-key">{{ m.name || m.property || m.http }}</div>
            <div class="meta-value">{{ m.content }}</div>
          </div>
        </div>
      </div>
      <div v-if="mode === 'query'" class="links-grid">
        <a v-for="t in tools" :key="t.name" :href="t.url" target="_blank" class="tool-card">
          <div class="tool-icon">{{ t.icon }}</div>
          <div class="tool-name">{{ t.name }}</div>
          <div class="tool-desc">{{ t.desc }}</div>
        </a>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const mode = ref('paste'), html = ref(''), metas = ref([])
const tools = [
  { name: 'Meta Tags IO', icon: '🔖', url: 'https://metatags.io/', desc: '可视化预览 Meta 标签' },
  { name: 'Open Graph Debugger', icon: '📘', url: 'https://developers.facebook.com/tools/debug/', desc: 'Facebook OG 调试器' },
  { name: 'Twitter Card Validator', icon: '🐦', url: 'https://cards-dev.twitter.com/validator', desc: 'Twitter Card 验证' },
  { name: '站长工具', icon: '🔍', url: 'https://tool.chinaz.com/meta.aspx', desc: 'Meta 标签查询' },
  { name: 'SEO Site Checkup', icon: '✅', url: 'https://seositecheckup.com/', desc: 'SEO 全面检测' },
  { name: '小黑工具', icon: '🛠️', url: 'https://www.xiaoheiban.cn/', desc: '多功能 SEO 工具' },
]
function analyze() {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html.value, 'text/html')
  const metaTags = doc.querySelectorAll('meta')
  metas.value = [...metaTags].map(m => ({
    name: m.getAttribute('name') || '',
    property: m.getAttribute('property') || '',
    http: m.getAttribute('http-equiv') || '',
    content: m.getAttribute('content') || ''
  })).filter(m => m.content)
  if (!metas.value.length) alert('未找到 meta 标签')
}
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 12px; }
.tip-box { background: #ddf4ff; border: 1px solid #54aeff; border-radius: 6px; padding: 10px 14px; font-size: 13px; color: #0550ae; }
.tabs { display: flex; gap: 6px; }
.tab { padding: 6px 16px; border: 1px solid #d0d7de; border-radius: 6px; background: white; cursor: pointer; font-size: 13px; }
.tab.active { background: #0969da; color: white; border-color: #0969da; }
.label { font-size: 12px; font-weight: 600; color: #666; margin-bottom: 4px; }
.code-area { width: 100%; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: monospace; font-size: 13px; resize: vertical; box-sizing: border-box; }
.btn { padding: 8px 16px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.meta-list { display: flex; flex-direction: column; gap: 6px; margin-top: 12px; }
.meta-item { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 6px; padding: 10px 14px; }
.meta-key { font-size: 12px; font-weight: 600; color: #0969da; margin-bottom: 4px; }
.meta-value { font-size: 13px; word-break: break-all; }
.links-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
.tool-card { display: flex; flex-direction: column; gap: 4px; padding: 14px; background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; text-decoration: none; color: inherit; transition: all 0.15s; }
.tool-card:hover { background: #f0f6ff; border-color: #0969da; }
.tool-icon { font-size: 24px; }
.tool-name { font-weight: 600; font-size: 14px; color: #0969da; }
.tool-desc { font-size: 12px; color: #666; }
</style>
