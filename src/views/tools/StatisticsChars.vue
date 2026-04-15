<template>
  <ToolLayout title="字符统计" subtitle="统计文本的字符数、词数、行数、段落数等信息" icon="📊">
    <div class="card p-6">
      <textarea 
        v-model="text" 
        placeholder="在此粘贴或输入需要统计的文本..."
        class="input-base h-56 mb-6 text-sm"
      ></textarea>

      <!-- 统计网格 -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div v-for="s in stats" :key="s.label" class="bg-[var(--bg-secondary)] rounded-xl p-4 text-center">
          <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ s.value }}</div>
          <div class="text-xs text-[var(--text-secondary)] mt-1">{{ s.label }}</div>
        </div>
      </div>

      <!-- 字符频率分析 -->
      <div v-if="text" class="mt-6 pt-5 border-t border-[var(--border-color)]">
        <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-3">字符频率 Top 10</h3>
        <div class="space-y-2">
          <div v-for="item in topChars" :key="item.char" class="flex items-center gap-3">
            <span class="font-mono w-6 text-center text-sm bg-[var(--bg-secondary)] rounded px-1">
              {{ item.char === ' ' ? '空格' : item.char }}
            </span>
            <div class="flex-1 h-5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-primary-500 to-accent rounded-full transition-all duration-500"
                   :style="{ width: `${(item.count / maxFreq * 100)}%` }"></div>
            </div>
            <span class="text-xs text-[var(--text-secondary)] w-8 text-right">{{ item.count }}</span>
          </div>
        </div>
      </div>

      <!-- 操作 -->
      <div class="flex gap-3 mt-5">
        <button @click="text = ''" class="btn-ghost">清空</button>
        <button @click="copyStats" class="btn-secondary">复制统计结果</button>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const text = ref('')

const stats = computed(() => [
  { label: '总字符', value: text.value.length },
  { label: '不含空格', value: text.value.replace(/\s/g, '').length },
  { label: '汉字数', value: (text.value.match(/[\u4e00-\u9fa5]/g) || []).length },
  { label: '英文词数', value: text.value.trim() ? (text.value.match(/\b[a-zA-Z]+\b/g) || []).length : 0 },
  { label: '行数', value: text.value ? text.value.split('\n').length : 0 },
  { label: '段落数', value: text.value ? text.value.split(/\n\s*\n/).filter(p => p.trim()).length : 0 },
])

const topChars = computed(() => {
  if (!text.value) return []
  const freq = {}
  for (const ch of text.value) {
    if (ch === '\n' || ch === '\r') continue
    freq[ch] = (freq[ch] || 0) + 1
  }
  return Object.entries(freq)
    .map(([char, count]) => ({ char, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
})

const maxFreq = computed(() => topChars.value[0]?.count || 1)

async function copyStats() {
  const result = stats.value.map(s => `${s.label}: ${s.value}`).join('\n')
  await navigator.clipboard.writeText(result)
}
</script>
