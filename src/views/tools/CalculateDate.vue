<template>
  <ToolLayout title="日期计算器" subtitle="计算两个日期之间的差值、工作日数等时间信息" icon="📅">
    <div class="space-y-4">
      <!-- 日期差计算 -->
      <div class="card p-6">
        <h3 class="font-semibold text-[var(--text-primary)] mb-4">日期差计算</h3>
        <div class="grid sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label class="text-xs font-medium text-[var(--text-secondary)] mb-2 block">开始日期</label>
            <input type="date" v-model="startDate" class="input-base" />
          </div>
          <div>
            <label class="text-xs font-medium text-[var(--text-secondary)] mb-2 block">结束日期</label>
            <input type="date" v-model="endDate" class="input-base" />
          </div>
        </div>

        <div v-if="dateDiff !== null" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div v-for="item in diffItems" :key="item.label" class="bg-[var(--bg-secondary)] rounded-xl p-4 text-center">
            <div class="text-2xl font-bold" :class="item.color">{{ item.value }}</div>
            <div class="text-xs text-[var(--text-secondary)] mt-1">{{ item.label }}</div>
          </div>
        </div>

        <!-- 快速设置 -->
        <div class="flex flex-wrap gap-2 mt-4">
          <button v-for="q in quickSets" :key="q.label" @click="applyQuick(q)" class="btn-ghost text-xs py-1.5">{{ q.label }}</button>
        </div>
      </div>

      <!-- 日期加减 -->
      <div class="card p-6">
        <h3 class="font-semibold text-[var(--text-primary)] mb-4">日期加减</h3>
        <div class="flex flex-wrap items-end gap-3 mb-4">
          <div>
            <label class="text-xs font-medium text-[var(--text-secondary)] mb-2 block">基准日期</label>
            <input type="date" v-model="baseDate" class="input-base w-44" />
          </div>
          <div class="flex items-end gap-2">
            <button @click="calcDir='+'" :class="calcDir==='+'?'btn-primary':'btn-secondary'" class="py-3 w-10 justify-center">+</button>
            <button @click="calcDir='-'" :class="calcDir==='-'?'btn-primary':'btn-secondary'" class="py-3 w-10 justify-center">−</button>
          </div>
          <div>
            <label class="text-xs font-medium text-[var(--text-secondary)] mb-2 block">天数</label>
            <input type="number" v-model.number="addDays" min="0" class="input-base w-24" />
          </div>
          <div class="text-sm text-[var(--text-secondary)] self-center">天</div>
        </div>
        <div v-if="calcResult" class="p-4 bg-[var(--bg-secondary)] rounded-xl">
          <div class="text-xs text-[var(--text-secondary)] mb-1">计算结果</div>
          <div class="text-xl font-bold text-primary-600 dark:text-primary-400">{{ calcResult }}</div>
          <div class="text-sm text-[var(--text-secondary)]">{{ calcResultWeekday }}</div>
        </div>
      </div>

      <!-- 倒计时 -->
      <div class="card p-6">
        <h3 class="font-semibold text-[var(--text-primary)] mb-4">重要日期倒计时</h3>
        <div class="grid sm:grid-cols-3 gap-3">
          <div v-for="event in countdowns" :key="event.name" class="bg-[var(--bg-secondary)] rounded-xl p-4 text-center">
            <div class="text-lg mb-1">{{ event.icon }}</div>
            <div class="text-xs text-[var(--text-secondary)] mb-1">{{ event.name }}</div>
            <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ event.days }}</div>
            <div class="text-xs text-[var(--text-secondary)]">天后</div>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const today = new Date().toISOString().split('T')[0]
const startDate = ref(today)
const endDate = ref(today)
const baseDate = ref(today)
const calcDir = ref('+')
const addDays = ref(30)

const dateDiff = computed(() => {
  if (!startDate.value || !endDate.value) return null
  const d1 = new Date(startDate.value)
  const d2 = new Date(endDate.value)
  return Math.round((d2 - d1) / 86400000)
})

const diffItems = computed(() => {
  if (dateDiff.value === null) return []
  const d = Math.abs(dateDiff.value)
  return [
    { label: '总天数', value: d, color: 'text-primary-600 dark:text-primary-400' },
    { label: '周数', value: (d / 7).toFixed(1), color: 'text-blue-600 dark:text-blue-400' },
    { label: '月数（约）', value: (d / 30.44).toFixed(1), color: 'text-purple-600 dark:text-purple-400' },
    { label: '年数（约）', value: (d / 365.25).toFixed(2), color: 'text-green-600 dark:text-green-400' },
  ]
})

const quickSets = [
  { label: '今天 ± 7天', s: 0, e: 7 },
  { label: '今天 ± 30天', s: 0, e: 30 },
  { label: '今天 ± 100天', s: 0, e: 100 },
  { label: '今年全年', s: null, e: null, fn: () => {
    const y = new Date().getFullYear()
    startDate.value = `${y}-01-01`
    endDate.value = `${y}-12-31`
  }},
]

function applyQuick(q) {
  if (q.fn) { q.fn(); return }
  const d = new Date()
  startDate.value = d.toISOString().split('T')[0]
  const d2 = new Date(d.getTime() + q.e * 86400000)
  endDate.value = d2.toISOString().split('T')[0]
}

const weekdays = ['日', '一', '二', '三', '四', '五', '六']

const calcResult = computed(() => {
  if (!baseDate.value) return ''
  const d = new Date(baseDate.value)
  d.setDate(d.getDate() + (calcDir.value === '+' ? addDays.value : -addDays.value))
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
})

const calcResultWeekday = computed(() => {
  if (!baseDate.value) return ''
  const d = new Date(baseDate.value)
  d.setDate(d.getDate() + (calcDir.value === '+' ? addDays.value : -addDays.value))
  return `星期${weekdays[d.getDay()]}`
})

const countdowns = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const events = [
    { name: '元旦', icon: '🎉', date: new Date(`${now.getMonth() >= 0 && now.getDate() > 1 ? year + 1 : year}-01-01`) },
    { name: '五一劳动节', icon: '🌹', date: new Date(`${year}-05-01`) },
    { name: '国庆节', icon: '🇨🇳', date: new Date(`${year}-10-01`) },
    { name: '圣诞节', icon: '🎄', date: new Date(`${year}-12-25`) },
    { name: '元宵节', icon: '🏮', date: (() => {
      const d = new Date(`${year}-01-01`); d.setDate(15); return d
    })() },
    { name: '中秋节', icon: '🌕', date: new Date(`${year}-09-29`) },
  ]
  return events.map(e => {
    let d = new Date(e.date)
    if (d < now) d.setFullYear(d.getFullYear() + 1)
    const days = Math.ceil((d - now) / 86400000)
    return { ...e, days }
  }).filter(e => e.days > 0).sort((a, b) => a.days - b.days).slice(0, 6)
})
</script>
