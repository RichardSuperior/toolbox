<template>
  <ToolLayout title="时间戳转换" subtitle="Unix 时间戳与日期时间互相转换" icon="⏱️">
    <div class="card p-6 mb-4">
      <!-- 当前时间 -->
      <div class="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-xl mb-6">
        <div>
          <div class="text-xs text-[var(--text-secondary)] mb-1">当前时间戳（秒）</div>
          <div class="font-mono text-lg font-bold text-[var(--text-primary)]">{{ nowTs }}</div>
        </div>
        <div class="text-center">
          <div class="text-xs text-[var(--text-secondary)] mb-1">当前时间</div>
          <div class="font-mono text-sm text-[var(--text-primary)]">{{ nowStr }}</div>
        </div>
        <button @click="refreshNow" class="btn-secondary text-sm">🔄 刷新</button>
      </div>

      <!-- 时间戳 → 日期 -->
      <div class="mb-6">
        <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-3">时间戳 → 日期时间</h3>
        <div class="flex gap-3">
          <input
            v-model="ts2dateInput"
            type="number"
            class="input-base flex-1 font-mono"
            placeholder="输入时间戳，如 1700000000"
            @input="convertTs2Date"
          />
          <div class="flex gap-2">
            <button @click="ts2dateInput = Math.floor(Date.now()/1000); convertTs2Date()" class="btn-secondary text-xs">秒级</button>
            <button @click="ts2dateInput = Date.now(); convertTs2Date()" class="btn-secondary text-xs">毫秒级</button>
          </div>
        </div>
        <div v-if="ts2dateResult" class="mt-3 grid grid-cols-2 gap-3">
          <div v-for="item in ts2dateResult" :key="item.label" class="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg">
            <div class="text-xs text-[var(--text-secondary)] mb-1">{{ item.label }}</div>
            <div class="font-mono text-sm text-[var(--text-primary)]">{{ item.value }}</div>
          </div>
        </div>
      </div>

      <!-- 日期 → 时间戳 -->
      <div>
        <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-3">日期时间 → 时间戳</h3>
        <div class="flex gap-3 flex-wrap">
          <input
            v-model="date2tsInput"
            type="datetime-local"
            class="input-base flex-1 font-mono"
            @input="convertDate2Ts"
          />
          <button @click="setNowDatetime" class="btn-secondary text-sm">填入当前时间</button>
        </div>
        <div v-if="date2tsResult" class="mt-3 grid grid-cols-2 gap-3">
          <div v-for="item in date2tsResult" :key="item.label" class="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg">
            <div class="text-xs text-[var(--text-secondary)] mb-1">{{ item.label }}</div>
            <div class="flex items-center justify-between">
              <span class="font-mono text-sm text-[var(--text-primary)]">{{ item.value }}</span>
              <button @click="copy(item.value, item.label)" class="text-xs text-primary-500 ml-2">
                {{ copiedLabel === item.label ? '✓' : '复制' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #knowledge>
      <div class="text-sm text-[var(--text-secondary)] space-y-2">
        <p><strong>Unix 时间戳</strong>：从 1970 年 1 月 1 日 00:00:00 UTC 到指定时间的秒数（或毫秒数）。</p>
        <p>JavaScript 中 <code class="bg-[var(--bg-secondary)] px-1 rounded">Date.now()</code> 返回毫秒级时间戳；<code class="bg-[var(--bg-secondary)] px-1 rounded">Math.floor(Date.now()/1000)</code> 返回秒级。</p>
        <p>当前时间戳（秒）约为 10 位数字；毫秒级约为 13 位数字。</p>
        <p>注意：时间戳本身不含时区信息，转换时需注意本地时区与 UTC 的差异。</p>
      </div>
    </template>
  </ToolLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const nowTs = ref('')
const nowStr = ref('')
const ts2dateInput = ref('')
const ts2dateResult = ref(null)
const date2tsInput = ref('')
const date2tsResult = ref(null)
const copiedLabel = ref('')

let timer = null

function formatDate(d) {
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function refreshNow() {
  const d = new Date()
  nowTs.value = Math.floor(d.getTime() / 1000)
  nowStr.value = formatDate(d)
}

function convertTs2Date() {
  const raw = ts2dateInput.value
  if (!raw) { ts2dateResult.value = null; return }
  let ts = Number(raw)
  if (String(raw).length <= 10) ts *= 1000
  const d = new Date(ts)
  if (isNaN(d.getTime())) { ts2dateResult.value = null; return }
  ts2dateResult.value = [
    { label: '本地时间', value: formatDate(d) },
    { label: 'UTC 时间', value: d.toUTCString() },
    { label: 'ISO 8601', value: d.toISOString() },
    { label: '星期', value: ['日', '一', '二', '三', '四', '五', '六'][d.getDay()] + '（周' + ['日', '一', '二', '三', '四', '五', '六'][d.getDay()] + '）' },
  ]
}

function convertDate2Ts() {
  if (!date2tsInput.value) { date2tsResult.value = null; return }
  const d = new Date(date2tsInput.value)
  if (isNaN(d.getTime())) { date2tsResult.value = null; return }
  date2tsResult.value = [
    { label: '时间戳（秒）', value: Math.floor(d.getTime() / 1000) },
    { label: '时间戳（毫秒）', value: d.getTime() },
    { label: 'ISO 8601', value: d.toISOString() },
    { label: 'UTC 时间', value: d.toUTCString() },
  ]
}

function setNowDatetime() {
  const d = new Date()
  const pad = n => String(n).padStart(2, '0')
  date2tsInput.value = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  convertDate2Ts()
}

async function copy(value, label) {
  await navigator.clipboard.writeText(String(value))
  copiedLabel.value = label
  setTimeout(() => copiedLabel.value = '', 2000)
}

onMounted(() => {
  refreshNow()
  timer = setInterval(refreshNow, 1000)
})
onUnmounted(() => clearInterval(timer))
</script>
