<template>
  <ToolLayout title="WHOIS 域名查询">
    <div class="tool-wrap">
      <div class="tip-box">ℹ️ 受跨域限制，提供 WHOIS 查询入口和使用说明。</div>
      <div class="search-row">
        <input v-model="domain" class="domain-input" placeholder="输入域名，如 example.com" @keyup.enter="showLinks = true" />
        <button class="btn" @click="showLinks = true">查询</button>
      </div>
      <div v-if="showLinks" class="links-section">
        <div class="section-title">在以下平台查询 "{{ domain }}"</div>
        <div class="links-grid">
          <a v-for="l in queryLinks" :key="l.name" :href="l.url" target="_blank" class="link-card">
            <div class="link-icon">{{ l.icon }}</div>
            <div class="link-name">{{ l.name }}</div>
            <div class="link-desc">{{ l.desc }}</div>
          </a>
        </div>
      </div>
      <div class="guide-box">
        <h3>WHOIS 查询说明</h3>
        <ul>
          <li>WHOIS 可查询域名的注册信息，包括注册人、邮箱、注册日期、到期日期等</li>
          <li>中国大陆域名（.cn/.中国）需到 <strong>中国互联网络信息中心（CNNIC）</strong> 查询</li>
          <li>通用顶级域名（.com/.net 等）可通过 ICANN WHOIS 查询</li>
          <li>命令行查询：<code>whois example.com</code></li>
          <li>出于隐私保护，许多域名启用了 WHOIS 隐私保护服务</li>
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
  { name: 'ICANN WHOIS', icon: '🌐', url: `https://lookup.icann.org/en/lookup?name=${domain.value}`, desc: 'ICANN 官方查询' },
  { name: '站长工具 WHOIS', icon: '🛠️', url: `https://whois.chinaz.com/${domain.value}`, desc: '中文 WHOIS 查询' },
  { name: 'Who.is', icon: '🔍', url: `https://who.is/whois/${domain.value}`, desc: '国际 WHOIS 查询' },
  { name: 'CNNIC', icon: '🏛️', url: `https://www.cnnic.cn/`, desc: '中国域名查询' },
  { name: 'NameSilo', icon: '📋', url: `https://www.namesilo.com/whois/${domain.value}`, desc: '域名注册商查询' },
  { name: 'DomainTools', icon: '📊', url: `https://whois.domaintools.com/${domain.value}`, desc: '专业域名情报' },
])
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 16px; }
.tip-box { background: #ddf4ff; border: 1px solid #54aeff; border-radius: 6px; padding: 10px 14px; font-size: 13px; color: #0550ae; }
.search-row { display: flex; gap: 8px; }
.domain-input { flex: 1; padding: 10px 14px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 15px; }
.btn { padding: 10px 20px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
.section-title { font-size: 14px; font-weight: 600; margin-bottom: 10px; }
.links-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
.link-card { display: flex; flex-direction: column; gap: 4px; padding: 14px; background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; text-decoration: none; color: inherit; transition: all 0.15s; }
.link-card:hover { background: #f0f6ff; border-color: #0969da; }
.link-icon { font-size: 24px; }
.link-name { font-weight: 600; font-size: 14px; color: #0969da; }
.link-desc { font-size: 12px; color: #666; }
.guide-box { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 14px 16px; font-size: 13px; }
.guide-box h3 { margin: 0 0 8px; font-size: 14px; }
.guide-box ul { margin: 0; padding-left: 20px; line-height: 1.8; }
code { background: #eef1f5; padding: 1px 5px; border-radius: 3px; font-family: monospace; }
</style>
