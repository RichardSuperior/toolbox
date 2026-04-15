<template>
  <div class="card overflow-hidden group cursor-pointer hover:-translate-y-0.5 transition-all duration-200" @click="$router.push(tool.path)">
    <div class="p-5">
      <div class="flex items-start justify-between mb-3">
        <div class="w-11 h-11 rounded-xl flex items-center justify-center text-2xl" :class="bgColors[tool.category]">
          {{ tool.icon }}
        </div>
        <span v-if="tool.hot" class="badge bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">HOT</span>
      </div>
      <h3 class="font-semibold text-[var(--text-primary)] text-sm mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {{ tool.name }}
      </h3>
      <p class="text-xs text-[var(--text-secondary)] line-clamp-2">{{ tool.desc }}</p>
    </div>
    <div class="px-5 pb-4">
      <div class="flex items-center justify-between">
        <span class="text-xs px-2 py-0.5 rounded-full" :class="tagColors[tool.category]">{{ categoryNames[tool.category] }}</span>
        <svg class="w-4 h-4 text-[var(--text-secondary)] group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  tool: { type: Object, required: true }
})

// 分类名称映射（覆盖所有9个分类）
const categoryNames = {
  json: 'JSON工具',
  format: '格式化转换',
  encrypt: '加解密',
  text: '文本数字',
  network: '网络工具',
  tools: '站长工具',
  calc: '计算工具',
  other: '其他工具',
  reference: '对照列表',
  android: '移动开发',
  article: '文章工具',
  world: '世界信息',
  culture: '历史文化',
}

// 背景色映射
const bgColors = {
  json: 'bg-blue-50 dark:bg-blue-900/20',
  format: 'bg-green-50 dark:bg-green-900/20',
  encrypt: 'bg-purple-50 dark:bg-purple-900/20',
  text: 'bg-cyan-50 dark:bg-cyan-900/20',
  network: 'bg-emerald-50 dark:bg-emerald-900/20',
  tools: 'bg-orange-50 dark:bg-orange-900/20',
  calc: 'bg-pink-50 dark:bg-pink-900/20',
  other: 'bg-slate-50 dark:bg-slate-800/50',
  reference: 'bg-amber-50 dark:bg-amber-900/20',
  android: 'bg-green-50 dark:bg-green-900/20',
  article: 'bg-teal-50 dark:bg-teal-900/20',
  world: 'bg-indigo-50 dark:bg-indigo-900/20',
  culture: 'bg-red-50 dark:bg-red-900/20',
}

// 标签色映射
const tagColors = {
  json: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  format: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  encrypt: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  text: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
  network: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  tools: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  calc: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
  other: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  reference: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  android: 'bg-green-200 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  article: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
  world: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  culture: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
}
</script>
