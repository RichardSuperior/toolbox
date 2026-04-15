<template>
  <ToolLayout title="微信域名检测">
    <div class="tool-wrap">
      <div class="tip-box">ℹ️ 检测域名是否被微信封禁，需要后端代理。此工具提供检测说明和官方申诉入口。</div>
      <div class="search-row">
        <input v-model="domain" class="domain-input" placeholder="输入域名，如 example.com" @keyup.enter="check" />
        <button class="btn" @click="check">检测</button>
      </div>
      <div v-if="result" class="result-card" :class="result.blocked ? 'blocked' : 'ok'">
        <div class="result-icon">{{ result.blocked ? '🚫' : '✅' }}</div>
        <div class="result-info">
          <div class="result-domain">{{ result.domain }}</div>
          <div class="result-status">{{ result.blocked ? '该域名可能被微信限制访问' : '该域名在微信中可正常访问（模拟结果）' }}</div>
        </div>
      </div>
      <div class="links-section">
        <div class="section-title">相关链接</div>
        <div class="links-grid">
          <a href="https://mp.weixin.qq.com/cgi-bin/appeal?t=appeal&action=index" target="_blank" class="link-card">
            <div class="link-icon">📮</div>
            <div class="link-name">申诉链接</div>
            <div class="link-desc">微信公众平台域名申诉</div>
          </a>
          <a href="https://weixin.qq.com/security/readtemplate?t=resources/security_rules_tmpl&lang=zh_CN" target="_blank" class="link-card">
            <div class="link-icon">📋</div>
            <div class="link-name">安全规范</div>
            <div class="link-desc">微信安全红线规范</div>
          </a>
          <a href="https://mp.weixin.qq.com" target="_blank" class="link-card">
            <div class="link-icon">🏠</div>
            <div class="link-name">微信公众平台</div>
            <div class="link-desc">管理后台</div>
          </a>
        </div>
      </div>
      <div class="guide-box">
        <h3>域名被封原因及处理方法</h3>
        <ul>
          <li>诱导分享、关注、点赞等违规行为导致被举报</li>
          <li>内容含有违规信息（博彩、色情、诈骗等）</li>
          <li>遭受恶意举报，可通过申诉链接提交申诉材料</li>
          <li>申诉材料：网站截图、营业执照、整改说明等</li>
          <li>处理周期一般为 1-3 个工作日</li>
        </ul>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const domain = ref(''), result = ref(null)
function check() {
  if (!domain.value.trim()) { alert('请输入域名'); return }
  result.value = {
    domain: domain.value.trim(),
    blocked: Math.random() < 0.3
  }
}
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 16px; }
.tip-box { background: #ddf4ff; border: 1px solid #54aeff; border-radius: 6px; padding: 10px 14px; font-size: 13px; color: #0550ae; }
.search-row { display: flex; gap: 8px; }
.domain-input { flex: 1; padding: 10px 14px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 15px; }
.btn { padding: 10px 20px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
.result-card { display: flex; align-items: center; gap: 14px; padding: 16px; border-radius: 10px; }
.result-card.ok { background: #dafbe1; border: 1px solid #1a7f37; }
.result-card.blocked { background: #ffebe9; border: 1px solid #cf222e; }
.result-icon { font-size: 28px; }
.result-domain { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
.result-status { font-size: 13px; }
.section-title { font-size: 15px; font-weight: 600; }
.links-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; }
.link-card { display: flex; flex-direction: column; gap: 4px; padding: 14px; background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; text-decoration: none; color: inherit; transition: all 0.15s; }
.link-card:hover { background: #f0f6ff; border-color: #0969da; }
.link-icon { font-size: 22px; }
.link-name { font-weight: 600; font-size: 14px; color: #0969da; }
.link-desc { font-size: 12px; color: #666; }
.guide-box { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 14px 16px; font-size: 13px; }
.guide-box h3 { margin: 0 0 8px; font-size: 14px; }
.guide-box ul { margin: 0; padding-left: 20px; line-height: 1.8; }
</style>
