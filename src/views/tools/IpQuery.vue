<template>
  <ToolLayout title="IP 地址归属地查询">
    <div class="ip-query">
      <div class="tool-bar">
        <input v-model="ip" class="ip-input" placeholder="输入 IP 地址，如：8.8.8.8" @keyup.enter="query" />
        <button class="btn" @click="query">查询</button>
      </div>
      <div v-if="result" class="result-card">
        <div class="result-row"><span class="label">IP 地址</span><span class="value">{{ result.ip }}</span></div>
        <div class="result-row"><span class="label">国家</span><span class="value">{{ result.country }}</span></div>
        <div class="result-row"><span class="label">省份</span><span class="value">{{ result.region }}</span></div>
        <div class="result-row"><span class="label">城市</span><span class="value">{{ result.city }}</span></div>
        <div class="result-row"><span class="label">运营商</span><span class="value">{{ result.isp }}</span></div>
        <div class="result-row"><span class="label">经纬度</span><span class="value">{{ result.lat }}, {{ result.lon }}</span></div>
      </div>
      <div v-if="loading" class="loading">查询中...</div>
      <div v-if="error" class="error-msg">{{ error }}</div>
      <div class="info-box">
        💡 使用 ip-api.com 公开接口，支持全球 IP 查询
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const ip = ref(''), result = ref(null), loading = ref(false), error = ref('')

async function query() {
  if (!ip.value.trim()) return
  loading.value = true; error.value = ''
  try {
    const res = await fetch(`http://ip-api.com/json/${ip.value}?fields=status,country,regionName,city,isp,lat,lon,query`)
    const data = await res.json()
    if (data.status === 'fail') { error.value = '查询失败，请检查 IP 地址格式'; result.value = null }
    else { result.value = { ip: data.query, country: data.country, region: data.regionName, city: data.city, isp: data.isp, lat: data.lat, lon: data.lon } }
  } catch (e) { error.value = '网络错误: ' + e.message }
  finally { loading.value = false }
}
</script>

<style scoped>
.ip-query { display: flex; flex-direction: column; gap: 12px; }
.tool-bar { display: flex; gap: 8px; }
.ip-input { flex: 1; padding: 8px 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 14px; }
.btn { padding: 8px 16px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
.result-card { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; overflow: hidden; }
.result-row { display: flex; padding: 10px 14px; border-bottom: 1px solid #d0d7de; }
.result-row:last-child { border-bottom: none; }
.label { width: 80px; font-weight: 600; color: #666; font-size: 13px; }
.value { flex: 1; font-size: 13px; color: #24292f; }
.loading { color: #0969da; font-size: 14px; }
.error-msg { color: #cf222e; font-size: 14px; }
.info-box { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 6px; padding: 10px 14px; font-size: 13px; color: #666; }
</style>
