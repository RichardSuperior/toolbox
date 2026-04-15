<template>
  <div class="max-w-6xl mx-auto px-4 py-10 animate-fade-in">
    <!-- Hero区 -->
    <div class="text-center mb-10">
      <div class="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full text-xs font-medium mb-4">
        <span class="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse-slow"></span>
        共 {{ tools.length }} 个实用工具，持续更新中
      </div>
      <h1 class="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4 leading-tight">
        在线<span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent">工具箱</span>
      </h1>
      <p class="text-[var(--text-secondary)] text-lg max-w-xl mx-auto mb-8">
        简单、快速、实用 — 汇聚开发、设计、日常所需的各类在线工具
      </p>
      <!-- 搜索栏 -->
      <div class="relative max-w-lg mx-auto">
        <input 
          v-model="search" 
          type="text" 
          placeholder="搜索工具名称或功能..."
          class="input-base pl-12 pr-4 py-3.5 text-base rounded-2xl shadow-sm w-full"
        />
        <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
    </div>

    <!-- IP快速预览卡 -->
    <div class="card p-6 mb-10 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/10 dark:to-blue-900/10 border-primary-100 dark:border-primary-900/30">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div class="text-xs text-[var(--text-secondary)] mb-1 flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
            </svg>
            您当前的 IP 地址
          </div>
          <div class="text-2xl font-mono font-bold text-[var(--text-primary)]">
            {{ ip || '获取中...' }}
          </div>
        </div>
        <router-link to="/getIP" class="btn-primary">
          查看详细信息
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </router-link>
      </div>
    </div>

    <!-- 分类快捷入口 - 全部工具视图下显示 -->
    <div v-if="activeCategory === 'all' && !search.trim()" class="mb-8">
      <div class="category-grid">
        <div 
          v-for="cat in categoryWithCounts" 
          :key="cat.id"
          class="cat-card"
          @click="activeCategory = cat.id"
        >
          <div class="cat-icon">{{ cat.icon }}</div>
          <div class="cat-name">{{ cat.name }}</div>
          <div class="cat-count">{{ cat.count }} 个工具</div>
        </div>
      </div>
    </div>

    <!-- 分类过滤 -->
    <div class="flex flex-wrap items-center gap-2 mb-6">
      <button 
        v-for="cat in categoriesWithCounts" 
        :key="cat.id"
        @click="activeCategory = cat.id"
        class="flex items-center gap-1.5 px-4 py-2 text-sm rounded-full border transition-all duration-200"
        :class="activeCategory === cat.id 
          ? 'bg-primary-600 text-white border-primary-600 shadow-sm' 
          : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400'"
      >
        <span>{{ cat.icon }}</span> {{ cat.name }}
        <span class="text-xs opacity-70">({{ cat.count }})</span>
      </button>
    </div>

    <!-- 当前分类标题 -->
    <div v-if="activeCategory !== 'all'" class="mb-4 flex items-center gap-2">
      <span class="text-sm text-[var(--text-secondary)]">当前分类：</span>
      <span class="text-sm font-semibold text-primary-600">{{ currentCategoryName }}</span>
      <button @click="activeCategory = 'all'" class="text-sm text-[var(--text-secondary)] hover:text-primary-600 ml-2">← 返回全部</button>
    </div>

    <!-- 工具网格 -->
    <div v-if="filteredTools.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <ToolCard v-for="tool in filteredTools" :key="tool.id" :tool="tool" class="animate-slide-up" />
    </div>
    <div v-else class="text-center py-20 text-[var(--text-secondary)]">
      <div class="text-4xl mb-3">🔍</div>
      <div>没有找到相关工具</div>
    </div>

    <!-- 统计信息 -->
    <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.label" class="card p-5 text-center">
        <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ stat.value }}</div>
        <div class="text-xs text-[var(--text-secondary)] mt-1">{{ stat.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { tools, categories } from '../data/tools.js'
import ToolCard from '../components/ToolCard.vue'

const route = useRoute()
const search = ref('')
const activeCategory = ref('all')
const ip = ref('')

// 支持 ?cat=xxx URL 参数，从导航栏下拉点击跳转
watch(() => route.query.cat, (cat) => {
  if (cat) {
    const valid = categories.some(c => c.id === cat)
    if (valid) activeCategory.value = cat
  }
}, { immediate: true })

const categoryWithCounts = computed(() => 
  categories.filter(c => c.id !== 'all').map(cat => ({
    ...cat,
    count: tools.filter(t => t.category === cat.id).length
  })).filter(c => c.count > 0)
)

const categoriesWithCounts = computed(() => {
  const counts = {}
  tools.forEach(t => { counts[t.category] = (counts[t.category] || 0) + 1 })
  return categories.map(cat => ({
    ...cat,
    count: cat.id === 'all' ? tools.length : (counts[cat.id] || 0)
  })).filter(c => c.count > 0 || c.id === 'all')
})

const currentCategoryName = computed(() => {
  const cat = categories.find(c => c.id === activeCategory.value)
  return cat ? cat.name : ''
})

const filteredTools = computed(() => {
  let list = tools
  if (activeCategory.value !== 'all') {
    list = list.filter(t => t.category === activeCategory.value)
  }
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(t => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q))
  }
  return list
})

const stats = [
  { value: tools.length, label: '工具总数' },
  { value: new Set(tools.map(t => t.category)).size, label: '工具分类' },
  { value: '免费', label: '完全免费' },
  { value: '2026', label: '上线年份' },
]

onMounted(async () => {
  try {
    const res = await fetch('https://api.ipify.org?format=json')
    const data = await res.json()
    ip.value = data.ip
  } catch {
    ip.value = '获取失败'
  }
})
</script>

<style scoped>
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}
.cat-card {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}
.cat-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 2px 12px rgba(9, 105, 218, 0.1);
  transform: translateY(-2px);
}
.cat-icon { font-size: 28px; margin-bottom: 6px; }
.cat-name { font-weight: 600; font-size: 13px; color: var(--text-primary); margin-bottom: 2px; }
.cat-count { font-size: 11px; color: var(--text-secondary); }
</style>
