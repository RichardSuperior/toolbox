<template>
  <ToolLayout title="随机数生成" subtitle="生成指定范围和数量的随机整数或小数" icon="🎲">
    <div class="card p-6">
      <div class="grid sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label class="text-xs font-medium text-[var(--text-secondary)] mb-2 block">最小值</label>
          <input type="number" v-model.number="min" class="input-base" />
        </div>
        <div>
          <label class="text-xs font-medium text-[var(--text-secondary)] mb-2 block">最大值</label>
          <input type="number" v-model.number="max" class="input-base" />
        </div>
        <div>
          <label class="text-xs font-medium text-[var(--text-secondary)] mb-2 block">生成数量</label>
          <input type="number" v-model.number="count" min="1" max="100" class="input-base" />
        </div>
        <div>
          <label class="text-xs font-medium text-[var(--text-secondary)] mb-2 block">类型</label>
          <div class="flex gap-2">
            <button @click="isFloat=false" :class="!isFloat ? 'btn-primary' : 'btn-secondary'" class="flex-1 justify-center">整数</button>
            <button @click="isFloat=true" :class="isFloat ? 'btn-primary' : 'btn-secondary'" class="flex-1 justify-center">小数</button>
          </div>
        </div>
      </div>

      <div v-if="error" class="mb-3 px-4 py-2 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg text-sm text-red-600 dark:text-red-400">
        {{ error }}
      </div>
      <button @click="generate" class="btn-primary w-full justify-center py-3 mb-5 text-base">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        生成随机数
      </button>

      <div v-if="results.length">
        <div v-if="results.length === 1" class="text-center">
          <div class="text-6xl font-mono font-bold text-primary-600 dark:text-primary-400 py-8">{{ results[0] }}</div>
          <button @click="copySingle(results[0])" class="btn-secondary mx-auto">复制</button>
        </div>
        <div v-else>
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm text-[var(--text-secondary)]">共 {{ results.length }} 个</span>
            <button @click="copyAll" class="btn-secondary text-xs py-1.5">复制全部</button>
          </div>
          <div class="grid grid-cols-4 sm:grid-cols-6 gap-2">
            <div v-for="(n, i) in results" :key="i" 
              @click="copySingle(n, i)"
              class="bg-[var(--bg-secondary)] rounded-lg p-3 text-center font-mono text-sm font-medium text-[var(--text-primary)] cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-colors"
              :class="copiedIdx === i ? 'bg-green-100 dark:bg-green-900/20 text-green-600' : ''"
            >
              {{ n }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const min = ref(1)
const max = ref(100)
const count = ref(1)
const isFloat = ref(false)
const results = ref([])
const copiedIdx = ref(-1)

const error = ref('')

function generate() {
  if (min.value >= max.value) {
    error.value = '最小值必须小于最大值'
    results.value = []
    return
  }
  if (count.value < 1 || count.value > 100) {
    error.value = '生成数量需在 1 ~ 100 之间'
    results.value = []
    return
  }
  error.value = ''
  results.value = Array.from({ length: count.value }, () => {
    const v = Math.random() * (max.value - min.value) + min.value
    return isFloat.value ? parseFloat(v.toFixed(4)) : Math.floor(v)
  })
}

async function copySingle(n, i) {
  await navigator.clipboard.writeText(String(n))
  copiedIdx.value = i ?? 0
  setTimeout(() => copiedIdx.value = -1, 1500)
}

async function copyAll() {
  await navigator.clipboard.writeText(results.value.join(', '))
}
</script>
