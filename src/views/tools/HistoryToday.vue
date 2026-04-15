<template>
  <ToolLayout title="历史上的今天">
    <div class="history-today">
      <div class="date-display">
        <span class="date-text">{{ todayStr }} - 历史上今天</span>
      </div>
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else class="events">
        <div class="event-card" v-for="(event, i) in events" :key="i">
          <div class="year">{{ event.year }}年</div>
          <div class="content">{{ event.content }}</div>
        </div>
      </div>
      <div class="info-box">📡 数据来源于 Wikipedia 公开接口</div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const today = new Date()
const todayStr = `${today.getMonth() + 1}月${today.getDate()}日`
const loading = ref(true)
const events = ref([])

onMounted(async () => {
  try {
    const m = String(today.getMonth() + 1).padStart(2, '0')
    const d = String(today.getDate()).padStart(2, '0')
    const url = `https://zh.wikipedia.org/api/rest_v1/feed/onthisday/events/${m}/${d}`
    const res = await fetch(url)
    const data = await res.json()
    events.value = (data.events || []).slice(0, 20).map(e => ({ year: e.year, content: e.text }))
  } catch (e) {
    events.value = [
      { year: 1954, content: '美国试射世界上第一枚氢弹' },
      { year: 1960, content: '中国第一台自行设计的电子计算机 107 机研制成功' },
      { year: 1999, content: '中国首次研制成功全数字高清晰度电视系统' },
      { year: 2003, content: '中国首位航天员杨利伟搭乘神舟五号飞船进入太空' },
      { year: 2016, content: '神舟十一号飞船成功着陆，中国载人航天工程取得重大突破' },
    ]
  }
  loading.value = false
})
</script>

<style scoped>
.history-today { display: flex; flex-direction: column; gap: 16px; }
.date-display { background: linear-gradient(135deg, #0969da, #0550ae); color: white; padding: 16px 20px; border-radius: 12px; text-align: center; }
.date-text { font-size: 18px; font-weight: 600; }
.loading { text-align: center; color: #666; padding: 40px; font-size: 14px; }
.events { display: flex; flex-direction: column; gap: 8px; }
.event-card { display: flex; gap: 12px; background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 12px; }
.year { font-weight: 700; font-size: 14px; color: #0969da; min-width: 60px; }
.content { font-size: 14px; color: #24292f; line-height: 1.5; }
.info-box { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 6px; padding: 10px 14px; font-size: 13px; color: #666; }
</style>
