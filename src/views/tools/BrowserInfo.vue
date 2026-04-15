<template>
  <ToolLayout title="获取浏览器信息">
    <div class="browser-info">
      <div class="info-list">
        <div class="info-row"><span class="label">User Agent</span><span class="value mono">{{ ua }}</span></div>
        <div class="info-row"><span class="label">浏览器</span><span class="value">{{ browser }}</span></div>
        <div class="info-row"><span class="label">操作系统</span><span class="value">{{ os }}</span></div>
        <div class="info-row"><span class="label">屏幕分辨率</span><span class="value">{{ screen.width }} × {{ screen.height }}</span></div>
        <div class="info-row"><span class="label">窗口尺寸</span><span class="value">{{ windowSize.w }} × {{ windowSize.h }}</span></div>
        <div class="info-row"><span class="label">色彩深度</span><span class="value">{{ colorDepth }} 位</span></div>
        <div class="info-row"><span class="label">像素比</span><span class="value">{{ pixelRatio }}x</span></div>
        <div class="info-row"><span class="label">语言</span><span class="value">{{ language }}</span></div>
        <div class="info-row"><span class="label">时区</span><span class="value">{{ timezone }}</span></div>
        <div class="info-row"><span class="label">Cookie Enabled</span><span class="value">{{ cookieEnabled ? '是' : '否' }}</span></div>
        <div class="info-row"><span class="label">在线状态</span><span class="value">{{ online ? '在线' : '离线' }}</span></div>
        <div class="info-row"><span class="label">Referrer</span><span class="value mono">{{ referrer || '无' }}</span></div>
        <div class="info-row"><span class="label">当前 URL</span><span class="value mono small">{{ currentUrl }}</span></div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const ua = ref(navigator.userAgent)
const browser = ref('')
const os = ref('')
const screen = ref({ width: screen.width, height: screen.height })
const windowSize = ref({ w: window.innerWidth, h: window.innerHeight })
const colorDepth = ref(screen.colorDepth)
const pixelRatio = ref(window.devicePixelRatio)
const language = ref(navigator.language)
const timezone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone)
const cookieEnabled = ref(navigator.cookieEnabled)
const online = ref(navigator.onLine)
const referrer = ref(document.referrer)
const currentUrl = ref(location.href)

function detectBrowser() {
  const ua = navigator.userAgent
  if (ua.includes('Edg')) return 'Microsoft Edge'
  if (ua.includes('Chrome') && !ua.includes('Chromium')) return 'Google Chrome'
  if (ua.includes('Firefox')) return 'Mozilla Firefox'
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari'
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera'
  return '未知浏览器'
}

function detectOS() {
  const ua = navigator.userAgent
  if (ua.includes('Win')) return 'Windows ' + (ua.includes('Windows NT 10') ? '10/11' : ua.includes('Windows NT 6.3') ? '8.1' : '其他')
  if (ua.includes('Mac')) return 'macOS'
  if (ua.includes('Linux')) return 'Linux'
  if (ua.includes('Android')) return 'Android'
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS'
  return '未知系统'
}

onMounted(() => {
  browser.value = detectBrowser()
  os.value = detectOS()
})
</script>

<style scoped>
.browser-info { display: flex; flex-direction: column; gap: 8px; }
.info-list { display: flex; flex-direction: column; gap: 0; border: 1px solid #d0d7de; border-radius: 8px; overflow: hidden; }
.info-row { display: flex; padding: 10px 14px; border-bottom: 1px solid #d0d7de; }
.info-row:last-child { border-bottom: none; }
.label { width: 140px; font-weight: 600; color: #666; font-size: 13px; flex-shrink: 0; }
.value { flex: 1; font-size: 13px; color: #24292f; word-break: break-all; }
.mono { font-family: 'Fira Code', monospace; font-size: 12px; }
.small { font-size: 11px; }
</style>
