<template>
  <ToolLayout title="公共 DNS 列表">
    <div class="dns-list">
      <div class="section" v-for="cat in dnsData" :key="cat.name">
        <h3 class="section-title">{{ cat.name }}</h3>
        <div class="table">
          <div class="row header">
            <div>服务商</div>
            <div>首选 DNS</div>
            <div>备用 DNS</div>
            <div>操作</div>
          </div>
          <div class="row" v-for="dns in cat.list" :key="dns.name">
            <div class="name">{{ dns.name }}</div>
            <div class="mono">{{ dns.primary }}</div>
            <div class="mono">{{ dns.secondary }}</div>
            <div><button class="copy-btn" @click="copy(dns.primary)">复制</button></div>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import ToolLayout from '../../components/ToolLayout.vue'
const dnsData = [
  {
    name: '🏛️ 公共 DNS',
    list: [
      { name: '阿里 DNS', primary: '223.5.5.5', secondary: '223.6.6.6' },
      { name: '腾讯 DNSPod', primary: '119.29.29.29', secondary: '182.254.116.116' },
      { name: '百度 DNS', primary: '180.76.76.76', secondary: '' },
      { name: 'CNNIC SDNS', primary: '1.2.4.8', secondary: '210.2.4.8' },
      { name: 'Google Public DNS', primary: '8.8.8.8', secondary: '8.8.4.4' },
      { name: 'Cloudflare', primary: '1.1.1.1', secondary: '1.0.0.1' },
      { name: 'OpenDNS', primary: '208.67.222.222', secondary: '208.67.220.220' },
      { name: 'Quad9', primary: '9.9.9.9', secondary: '149.112.112.112' },
    ],
  },
  {
    name: '🏢 各地电信 DNS',
    list: [
      { name: '北京电信', primary: '219.141.136.10', secondary: '219.141.140.10' },
      { name: '上海电信', primary: '202.96.209.5', secondary: '202.96.209.133' },
      { name: '广东电信', primary: '202.96.128.86', secondary: '202.96.128.166' },
    ],
  },
  {
    name: '🔵 各地联通 DNS',
    list: [
      { name: '北京联通', primary: '202.106.0.20', secondary: '202.106.196.115' },
      { name: '上海联通', primary: '210.22.70.3', secondary: '210.22.84.3' },
      { name: '广东联通', primary: '221.5.88.88', secondary: '' },
    ],
  },
]

function copy(text) {
  navigator.clipboard.writeText(text).then(() => alert('✅ 已复制: ' + text))
}
</script>

<style scoped>
.dns-list { display: flex; flex-direction: column; gap: 24px; }
.section-title { font-size: 16px; font-weight: 600; color: #24292f; margin-bottom: 8px; }
.table { border: 1px solid #d0d7de; border-radius: 8px; overflow: hidden; }
.row { display: grid; grid-template-columns: 140px 1fr 1fr 60px; padding: 10px 12px; border-bottom: 1px solid #d0d7de; align-items: center; }
.row:last-child { border-bottom: none; }
.header { background: #f6f8fa; font-weight: 600; font-size: 13px; }
.name { font-size: 13px; font-weight: 600; }
.mono { font-family: 'Fira Code', monospace; font-size: 12px; color: #0969da; }
.copy-btn { padding: 4px 10px; background: #0969da; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; }
</style>
