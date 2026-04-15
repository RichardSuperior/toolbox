<template>
  <ToolLayout title="子网掩码计算器">
    <div class="subnet-calc">
      <div class="input-row">
        <input v-model="ip" class="ip-input" placeholder="IP 地址，如：192.168.1.100" @keyup.enter="calculate" />
        <input v-model="mask" class="ip-input" placeholder="子网掩码，如：255.255.255.0 或 /24" @keyup.enter="calculate" />
        <button class="btn" @click="calculate">计算</button>
      </div>
      <div v-if="result" class="result-grid">
        <div class="result-item"><span class="label">网络地址</span><span class="value">{{ result.network }}</span></div>
        <div class="result-item"><span class="label">广播地址</span><span class="value">{{ result.broadcast }}</span></div>
        <div class="result-item"><span class="label">子网掩码</span><span class="value">{{ result.mask }}</span></div>
        <div class="result-item"><span class="label">CIDR 表示</span><span class="value">/{{ result.cidr }}</span></div>
        <div class="result-item"><span class="label">可用 IP 数</span><span class="value">{{ result.usable }}</span></div>
        <div class="result-item"><span class="label">IP 范围</span><span class="value small">{{ result.range }}</span></div>
        <div class="result-item"><span class="label">主机位数</span><span class="value">{{ result.hostBits }} 位</span></div>
        <div class="result-item"><span class="label">子网数量</span><span class="value">{{ result.subnetCount }}</span></div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const ip = ref('192.168.1.100'), mask = ref('255.255.255.0'), result = ref(null)

function ipToNum(str) {
  return str.split('.').reduce((a, b) => (a << 8) + parseInt(b), 0) >>> 0
}

function numToIp(n) {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.')
}

function maskToCidr(m) {
  if (m.startsWith('/')) return parseInt(m.slice(1))
  const num = ipToNum(m)
  return num.toString(2).split('1').length - 1
}

function cidrToMask(cidr) {
  return numToIp(cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0)
}

function calculate() {
  try {
    const ipNum = ipToNum(ip.value)
    const cidr = maskToCidr(mask.value)
    const maskNum = cidrToMask(cidr)
    const network = (ipNum & maskNum) >>> 0
    const broadcast = (network | (~maskNum >>> 0)) >>> 0
    const usable = Math.max(0, broadcast - network - 1)
    const hostBits = 32 - cidr
    result.value = {
      network: numToIp(network), broadcast: numToIp(broadcast),
      mask: numToIp(maskNum), cidr,
      usable: usable === 0 ? '无（/32）' : usable.toLocaleString(),
      range: usable === 0 ? '无' : `${numToIp(network + 1)} ~ ${numToIp(broadcast - 1)}`,
      hostBits, subnetCount: cidr < 24 ? Math.pow(2, 24 - cidr) : '无数',
    }
  } catch (e) { alert('❌ 输入格式错误') }
}
</script>

<style scoped>
.subnet-calc { display: flex; flex-direction: column; gap: 16px; }
.input-row { display: flex; gap: 8px; flex-wrap: wrap; }
.ip-input { flex: 1; padding: 8px 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 14px; font-family: 'Fira Code', monospace; min-width: 180px; }
.btn { padding: 8px 16px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
.result-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px; }
.result-item { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 4px; }
.result-item .label { font-size: 12px; color: #666; }
.result-item .value { font-size: 14px; font-weight: 600; font-family: 'Fira Code', monospace; color: #24292f; }
.result-item .small { font-size: 11px; }
</style>
