<template>
  <ToolLayout title="ICP 备案查询">
    <div class="tool-wrap">
      <div class="tip-box">ℹ️ 受跨域限制，此工具提供 ICP 备案查询入口和使用说明，实际查询请访问官方平台。</div>
      <div class="search-row">
        <input v-model="domain" class="domain-input" placeholder="输入域名，如 example.com" @keyup.enter="query" />
        <button class="btn" @click="query">查询</button>
      </div>
      <div v-if="showLinks" class="links-section">
        <div class="section-title">前往官方平台查询 "{{ domain }}"</div>
        <div class="links-grid">
          <a v-for="link in queryLinks" :key="link.name" :href="link.url" target="_blank" class="link-card">
            <div class="link-icon">{{ link.icon }}</div>
            <div class="link-name">{{ link.name }}</div>
            <div class="link-desc">{{ link.desc }}</div>
          </a>
        </div>
      </div>
      <div class="guide-box">
        <h3>ICP 备案说明</h3>
        <ul>
          <li>ICP 备案（Internet Content Provider）是中国大陆网站运营的法定要求</li>
          <li>备案号格式：粤ICP备XXXXXXXX号 / 京ICP证XXXXXXXX号</li>
          <li>经营性网站需申请 ICP 许可证，非经营性网站备案即可</li>
          <li>未备案网站在中国大陆境内无法正常访问</li>
          <li>备案信息需在网站底部显示并链接至工信部查询系统</li>
        </ul>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const domain = ref(''), showLinks = ref(false)
const queryLinks = computed(() => [
  { name: '工业和信息化部', icon: '🏛️', url: `https://beian.miit.gov.cn/`, desc: '官方 ICP 备案查询系统' },
  { name: 'ICP 备案查询网', icon: '🔍', url: `https://www.beianx.cn/search/${domain.value}`, desc: '第三方聚合查询' },
  { name: '站长工具', icon: '🛠️', url: `https://icp.chinaz.com/${domain.value}`, desc: '站长ICP查询' },
  { name: '天眼查', icon: '👁️', url: `https://www.tianyancha.com/`, desc: '企业信息综合查询' },
])
function query() {
  if (!domain.value.trim()) { alert('请输入域名'); return }
  showLinks.value = true
}
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 16px; }
.tip-box { background: #ddf4ff; border: 1px solid #54aeff; border-radius: 6px; padding: 10px 14px; font-size: 13px; color: #0550ae; }
.search-row { display: flex; gap: 8px; }
.domain-input { flex: 1; padding: 10px 14px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 15px; }
.btn { padding: 10px 20px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
.section-title { font-size: 14px; font-weight: 600; margin-bottom: 10px; }
.links-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; }
.link-card { display: flex; flex-direction: column; gap: 4px; padding: 14px; background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; text-decoration: none; color: inherit; transition: all 0.15s; }
.link-card:hover { background: #f0f6ff; border-color: #0969da; }
.link-icon { font-size: 24px; }
.link-name { font-weight: 600; font-size: 14px; color: #0969da; }
.link-desc { font-size: 12px; color: #666; }
.guide-box { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 14px 16px; font-size: 13px; }
.guide-box h3 { margin: 0 0 8px; font-size: 14px; }
.guide-box ul { margin: 0; padding-left: 20px; line-height: 1.8; }
</style>
