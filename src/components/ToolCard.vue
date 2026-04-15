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

const categoryNames = {
  text: '字符工具',
  network: '网络工具',
  date: '日期工具',
  image: '图形工具',
}

const bgColors = {
  text: 'bg-blue-50 dark:bg-blue-900/20',
  network: 'bg-green-50 dark:bg-green-900/20',
  date: 'bg-purple-50 dark:bg-purple-900/20',
  image: 'bg-orange-50 dark:bg-orange-900/20',
}

const tagColors = {
  text: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  network: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  date: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  image: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
}
</script>
