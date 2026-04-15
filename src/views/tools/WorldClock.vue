<template>
  <ToolLayout title="世界各地时间">
    <div class="world-clock">
      <div class="now-time">{{ currentTime }}</div>
      <div class="cities">
        <div class="city-card" v-for="city in cities" :key="city.name">
          <div class="city-name">{{ city.name }}</div>
          <div class="city-time">{{ getTime(city.offset) }}</div>
          <div class="city-zone">UTC{{ city.offset >= 0 ? '+' : '' }}{{ city.offset }}</div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const cities = [
  { name: '🇨🇳 北京', offset: 8 },
  { name: '🇭🇰 香港', offset: 8 },
  { name: '🇹🇼 台北', offset: 8 },
  { name: '🇸🇬 新加坡', offset: 8 },
  { name: '🇯🇵 东京', offset: 9 },
  { name: '🇰🇷 首尔', offset: 9 },
  { name: '🇦🇺 悉尼', offset: 10 },
  { name: '🇺🇸 洛杉矶', offset: -8 },
  { name: '🇺🇸 纽约', offset: -5 },
  { name: '🇬🇧 伦敦', offset: 0 },
  { name: '🇫🇷 巴黎', offset: 1 },
  { name: '🇩🇪 柏林', offset: 1 },
  { name: '🇷🇺 莫斯科', offset: 3 },
  { name: '🇮🇳 孟买', offset: 5.5 },
  { name: '🇧🇷 里约热内卢', offset: -3 },
]

const currentTime = ref('')
let timer = null

function pad(n) { return String(Math.floor(n)).padStart(2, '0') }

function getTime(offset) {
  const d = new Date()
  const utc = d.getTime() + d.getTimezoneOffset() * 60000
  const nd = new Date(utc + 3600000 * offset)
  return `${pad(nd.getHours())}:${pad(nd.getMinutes())}:${pad(nd.getSeconds())}`
}

function update() {
  const d = new Date()
  currentTime.value = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} 北京时间`
}

onMounted(() => { update(); timer = setInterval(update, 1000) })
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.world-clock { display: flex; flex-direction: column; gap: 16px; }
.now-time { text-align: center; font-size: 20px; font-weight: 600; color: #24292f; background: linear-gradient(135deg, #0969da, #0550ae); color: white; padding: 16px; border-radius: 12px; }
.cities { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px; }
.city-card { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 12px; text-align: center; }
.city-name { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
.city-time { font-size: 20px; font-weight: 700; font-family: 'Fira Code', monospace; color: #0969da; }
.city-zone { font-size: 11px; color: #666; margin-top: 2px; }
</style>
