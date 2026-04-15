<template>
  <ToolLayout title="IP 地址查询" subtitle="查看当前网络的IP地址、地理位置及网络信息" icon="🌐">
    <div class="space-y-4">
      <!-- 主IP卡 -->
      <div class="card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
        <div class="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div class="text-xs text-[var(--text-secondary)] mb-2 flex items-center gap-1.5">
              <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              您的当前 IP 地址
            </div>
            <div class="text-4xl font-mono font-bold text-[var(--text-primary)] mb-1">
              {{ ipInfo.ip || '获取中...' }}
            </div>
            <div v-if="ipInfo.city" class="text-sm text-[var(--text-secondary)] flex items-center gap-1">
              📍 {{ ipInfo.city }}, {{ ipInfo.region }}, {{ ipInfo.country }}
            </div>
          </div>
          <div class="flex gap-2">
            <button @click="copyIP" class="btn-secondary">
              {{ copiedIP ? '已复制!' : '复制 IP' }}
            </button>
            <button @click="fetchIP" class="btn-ghost">
              <svg class="w-4 h-4" :class="loading ? 'animate-spin' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 详情卡 -->
      <div v-if="ipInfo.ip" class="card p-6">
        <h3 class="font-semibold text-[var(--text-primary)] mb-4">详细信息</h3>
        <div class="grid sm:grid-cols-2 gap-3">
          <div v-for="item in detailItems" :key="item.label" class="flex items-start justify-between py-2.5 border-b border-[var(--border-color)] last:border-0">
            <span class="text-sm text-[var(--text-secondary)]">{{ item.label }}</span>
            <span class="text-sm font-medium text-[var(--text-primary)] text-right max-w-xs">{{ item.value || '—' }}</span>
          </div>
        </div>
      </div>

      <!-- 查询其他IP -->
      <div class="card p-6">
        <h3 class="font-semibold text-[var(--text-primary)] mb-4">查询指定 IP</h3>
        <div class="flex gap-3">
          <input v-model="customIP" type="text" placeholder="输入 IP 地址..." class="input-base flex-1" @keyup.enter="fetchCustomIP" />
          <button @click="fetchCustomIP" class="btn-primary shrink-0" :disabled="!customIP.trim()">查询</button>
        </div>
        <div v-if="customResult" class="mt-4 p-4 bg-[var(--bg-secondary)] rounded-xl text-sm space-y-2">
          <div v-for="(val, key) in customResult" :key="key" class="flex justify-between">
            <span class="text-[var(--text-secondary)]">{{ key }}</span>
            <span class="text-[var(--text-primary)] font-medium">{{ val }}</span>
          </div>
        </div>
      </div>

      <!-- API说明 -->
      <div class="card p-5">
        <h3 class="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          API 访问
        </h3>
        <p class="text-sm text-[var(--text-secondary)] mb-3">支持通过命令行快速查询 IP：</p>
        <div class="bg-slate-900 text-green-400 rounded-xl p-4 font-mono text-sm">
          <div class="text-slate-500 text-xs mb-1"># macOS / Linux</div>
          <div>$ curl https://api.ipify.org</div>
        </div>
      </div>
    </div>

    <template #knowledge>
      <div class="space-y-2 text-sm text-[var(--text-secondary)]">
        <p><strong class="text-[var(--text-primary)]">IP 地址</strong>是网络设备的唯一标识符，分为 IPv4（如 192.168.1.1）和 IPv6 两种格式。</p>
        <p>本工具展示的是您的<strong class="text-[var(--text-primary)]">公网 IP</strong>，即您的网络出口地址，可能与本地局域网 IP 不同。</p>
      </div>
    </template>
  </ToolLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const loading = ref(false)
const copiedIP = ref(false)
const ipInfo = ref({})
const customIP = ref('')
const customResult = ref(null)

const detailItems = computed(() => [
  { label: 'IP 地址', value: ipInfo.value.ip },
  { label: '城市', value: ipInfo.value.city },
  { label: '省份/地区', value: ipInfo.value.region },
  { label: '国家', value: ipInfo.value.country },
  { label: '时区', value: ipInfo.value.timezone },
  { label: '运营商/组织', value: ipInfo.value.org },
])

async function fetchIP() {
  loading.value = true
  try {
    const res = await fetch('https://ipapi.co/json/')
    ipInfo.value = await res.json()
  } catch {
    // fallback
    try {
      const r2 = await fetch('https://api.ipify.org?format=json')
      const d = await r2.json()
      ipInfo.value = { ip: d.ip }
    } catch {}
  } finally {
    loading.value = false
  }
}

async function fetchCustomIP() {
  if (!customIP.value.trim()) return
  try {
    const res = await fetch(`https://ipapi.co/${customIP.value}/json/`)
    const data = await res.json()
    customResult.value = {
      'IP': data.ip,
      '城市': data.city,
      '省份': data.region,
      '国家': data.country_name,
      '时区': data.timezone,
      '运营商': data.org,
    }
  } catch {
    customResult.value = { '错误': '查询失败，请检查 IP 格式' }
  }
}

async function copyIP() {
  if (!ipInfo.value.ip) return
  await navigator.clipboard.writeText(ipInfo.value.ip)
  copiedIP.value = true
  setTimeout(() => copiedIP.value = false, 2000)
}

onMounted(fetchIP)
</script>
