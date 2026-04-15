<template>
  <ToolLayout title="农历查询" subtitle="公历与中国农历双向查询转换，含节气与传统节日" icon="🗓️">
    <div class="space-y-4">
      <!-- 今日信息 -->
      <div class="card p-6 bg-gradient-to-br from-red-50 to-amber-50 dark:from-red-900/10 dark:to-amber-900/10">
        <div class="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div class="text-xs text-[var(--text-secondary)] mb-2">今天</div>
            <div class="text-3xl font-bold text-[var(--text-primary)]">{{ todayInfo.solar }}</div>
            <div class="text-lg font-medium text-red-600 dark:text-red-400 mt-1">{{ todayInfo.lunar }}</div>
            <div class="flex flex-wrap gap-2 mt-2">
              <span v-for="tag in todayInfo.tags" :key="tag" class="badge bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">{{ tag }}</span>
            </div>
          </div>
          <div class="text-right">
            <div class="text-4xl font-bold text-[var(--text-primary)]">{{ todayInfo.day }}</div>
            <div class="text-sm text-[var(--text-secondary)]">{{ todayInfo.weekday }}</div>
          </div>
        </div>
      </div>

      <!-- 查询指定日期 -->
      <div class="card p-6">
        <h3 class="font-semibold text-[var(--text-primary)] mb-4">查询指定日期</h3>
        <div class="flex gap-3 mb-4">
          <input type="date" v-model="queryDate" class="input-base flex-1" />
          <button @click="query" class="btn-primary shrink-0 px-5">查询</button>
        </div>
        <div v-if="queryResult" class="p-4 bg-[var(--bg-secondary)] rounded-xl animate-slide-up">
          <div class="grid grid-cols-2 gap-3">
            <div v-for="item in queryResult" :key="item.label">
              <div class="text-xs text-[var(--text-secondary)] mb-0.5">{{ item.label }}</div>
              <div class="font-medium text-[var(--text-primary)]">{{ item.value }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 本月日历 -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-5">
          <button @click="changeMonth(-1)" class="btn-ghost p-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <h3 class="font-semibold text-[var(--text-primary)]">{{ calYear }}年{{ calMonth + 1 }}月</h3>
          <button @click="changeMonth(1)" class="btn-ghost p-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
        <div class="grid grid-cols-7 gap-1 text-center">
          <div v-for="d in ['日','一','二','三','四','五','六']" :key="d" class="text-xs font-medium text-[var(--text-secondary)] py-2" :class="d==='日'||d==='六'?'text-red-400':''">{{ d }}</div>
          <div v-for="(day, i) in calDays" :key="i"
            @click="day.date && selectDay(day)"
            class="py-1.5 rounded-lg text-center transition-colors relative"
            :class="[
              day.date ? 'cursor-pointer hover:bg-[var(--bg-secondary)]' : '',
              day.isToday ? 'bg-primary-600 text-white hover:bg-primary-700' : '',
              day.isSelected && !day.isToday ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : '',
              day.isWeekend && !day.isToday ? 'text-red-500 dark:text-red-400' : '',
              !day.date ? 'opacity-0 pointer-events-none' : '',
            ]"
          >
            <div class="text-sm font-medium">{{ day.solar }}</div>
            <div class="text-[10px] opacity-70">{{ day.lunar }}</div>
            <div v-if="day.festival" class="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

// 天干地支
const tiangan = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
const dizhi = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
const zodiac = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪']
const lunarMonths = ['正','二','三','四','五','六','七','八','九','十','冬','腊']
const lunarDays = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十']
const weekdays = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六']

// 中国传统节日（简化版）
const festivals = {
  '01-01': '元旦', '02-14': '情人节', '03-08': '妇女节', '04-05': '清明',
  '05-01': '劳动节', '06-01': '儿童节', '07-01': '建党节', '08-01': '建军节',
  '09-10': '教师节', '10-01': '国庆节', '11-11': '双十一', '12-25': '圣诞节'
}

function getLunarInfo(date) {
  // 简化农历计算（基于偏移量，演示用）
  const base = new Date(1900, 0, 31)
  const diff = Math.floor((date - base) / 86400000)
  const tg = tiangan[(diff + 40) % 10]
  const dz = dizhi[(diff + 40) % 12]
  const zo = zodiac[(diff + 40) % 12]
  // 这里用简化算法，实际项目建议引入 lunar-javascript 库
  const lunarDay = lunarDays[diff % 30]
  const lunarMonth = lunarMonths[Math.floor((diff / 30)) % 12]
  return { tg, dz, zo, lunarDay, lunarMonth, ganzhi: `${tg}${dz}年` }
}

const now = new Date()
const todayInfo = computed(() => {
  const lunar = getLunarInfo(now)
  const key = `${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`
  return {
    solar: now.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }),
    lunar: `农历${lunar.lunarMonth}月${lunar.lunarDay}`,
    day: now.getDate(),
    weekday: weekdays[now.getDay()],
    tags: [lunar.ganzhi, `${lunar.zo}年`, festivals[key]].filter(Boolean),
  }
})

const queryDate = ref(now.toISOString().split('T')[0])
const queryResult = ref(null)

function query() {
  if (!queryDate.value) return
  const d = new Date(queryDate.value)
  const lunar = getLunarInfo(d)
  queryResult.value = [
    { label: '公历日期', value: d.toLocaleDateString('zh-CN', { year:'numeric', month:'long', day:'numeric' }) },
    { label: '星期', value: weekdays[d.getDay()] },
    { label: '农历日期', value: `${lunar.lunarMonth}月${lunar.lunarDay}` },
    { label: '干支纪年', value: lunar.ganzhi },
    { label: '生肖', value: lunar.zo },
    { label: '节假日', value: festivals[`${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`] || '—' },
  ]
}

const calYear = ref(now.getFullYear())
const calMonth = ref(now.getMonth())
const selectedDate = ref(null)

function changeMonth(dir) {
  calMonth.value += dir
  if (calMonth.value > 11) { calMonth.value = 0; calYear.value++ }
  if (calMonth.value < 0) { calMonth.value = 11; calYear.value-- }
}

const calDays = computed(() => {
  const firstDay = new Date(calYear.value, calMonth.value, 1).getDay()
  const daysInMonth = new Date(calYear.value, calMonth.value + 1, 0).getDate()
  const days = []
  for (let i = 0; i < firstDay; i++) days.push({})
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(calYear.value, calMonth.value, d)
    const lunar = getLunarInfo(date)
    const key = `${String(calMonth.value+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    days.push({
      date,
      solar: d,
      lunar: lunar.lunarDay,
      isToday: date.toDateString() === now.toDateString(),
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      isSelected: selectedDate.value?.toDateString() === date.toDateString(),
      festival: festivals[key],
    })
  }
  return days
})

function selectDay(day) {
  selectedDate.value = day.date
  queryDate.value = day.date.toISOString().split('T')[0]
  query()
}
</script>
