<template>
  <ToolLayout title="密码生成器" subtitle="生成高强度、安全可靠的随机密码" icon="🔑">
    <div class="card p-6 mb-4">
      <!-- 密码显示 -->
      <div class="flex items-center gap-3 mb-6">
        <div class="flex-1 font-mono text-xl tracking-widest bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-5 py-4 text-[var(--text-primary)] overflow-x-auto whitespace-nowrap">
          {{ password || '点击生成...' }}
        </div>
        <button @click="generatePassword" class="btn-primary px-4 py-3.5 rounded-xl shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </button>
        <button @click="copyPwd" class="btn-secondary px-4 py-3.5 rounded-xl shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
        </button>
      </div>

      <!-- 强度条 -->
      <div class="mb-6">
        <div class="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-2">
          <span>密码强度</span>
          <span :class="strengthColor" class="font-medium">{{ strengthLabel }}</span>
        </div>
        <div class="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-500" :class="strengthBarColor" :style="{ width: `${strength}%` }"></div>
        </div>
      </div>

      <!-- 配置 -->
      <div class="space-y-4">
        <!-- 长度 -->
        <div>
          <div class="flex items-center justify-between text-sm mb-2">
            <label class="text-[var(--text-secondary)] font-medium">密码长度</label>
            <span class="font-mono font-bold text-primary-600 dark:text-primary-400 text-base">{{ length }}</span>
          </div>
          <input type="range" v-model.number="length" min="4" max="64" class="w-full accent-primary-600" />
          <div class="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
            <span>4</span><span>16</span><span>32</span><span>48</span><span>64</span>
          </div>
        </div>

        <!-- 字符类型 -->
        <div class="grid grid-cols-2 gap-3">
          <label v-for="opt in options" :key="opt.key" class="flex items-center gap-3 p-3 border border-[var(--border-color)] rounded-lg cursor-pointer hover:border-primary-400 transition-colors" :class="opt.value ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/10' : ''">
            <input type="checkbox" v-model="opt.value" :disabled="opt.required" class="accent-primary-600 w-4 h-4" />
            <div>
              <div class="text-sm font-medium text-[var(--text-primary)]">{{ opt.label }}</div>
              <div class="text-xs text-[var(--text-secondary)] font-mono">{{ opt.sample }}</div>
            </div>
          </label>
        </div>

        <!-- 生成数量 -->
        <div class="flex items-center gap-4">
          <label class="text-sm text-[var(--text-secondary)] font-medium whitespace-nowrap">生成数量</label>
          <input type="number" v-model.number="count" min="1" max="20" class="input-base w-24 py-2" />
        </div>
      </div>

      <button @click="generatePassword" class="btn-primary w-full mt-5 justify-center py-3">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        重新生成
      </button>
    </div>

    <!-- 批量密码 -->
    <div v-if="passwords.length > 1" class="card p-5">
      <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-3">批量生成结果</h3>
      <div class="space-y-2">
        <div v-for="(p, i) in passwords" :key="i" class="flex items-center justify-between gap-3 py-2 px-3 bg-[var(--bg-secondary)] rounded-lg">
          <span class="font-mono text-sm text-[var(--text-primary)] truncate">{{ p }}</span>
          <button @click="copySingle(p, i)" class="text-xs text-[var(--text-secondary)] hover:text-primary-500 shrink-0">
            {{ copiedIdx === i ? '✓' : '复制' }}
          </button>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const length = ref(16)
const count = ref(1)
const password = ref('')
const passwords = ref([])
const copied = ref(false)
const copiedIdx = ref(-1)

const options = reactive([
  { key: 'upper', label: '大写字母', sample: 'A-Z', value: true, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
  { key: 'lower', label: '小写字母', sample: 'a-z', value: true, chars: 'abcdefghijklmnopqrstuvwxyz', required: true },
  { key: 'number', label: '数字', sample: '0-9', value: true, chars: '0123456789' },
  { key: 'symbol', label: '特殊字符', sample: '!@#$%&*', value: false, chars: '!@#$%^&*()-_=+[]{}|;:,.<>?' },
])

function generatePassword() {
  const charset = options.filter(o => o.value).map(o => o.chars).join('')
  if (!charset) return
  passwords.value = Array.from({ length: count.value }, () =>
    Array.from({ length: length.value }, () => charset[Math.floor(Math.random() * charset.length)]).join('')
  )
  password.value = passwords.value[0]
}

const strength = computed(() => {
  if (!password.value) return 0
  let score = 0
  if (password.value.length >= 8) score += 20
  if (password.value.length >= 12) score += 20
  if (password.value.length >= 16) score += 20
  if (/[A-Z]/.test(password.value)) score += 15
  if (/[0-9]/.test(password.value)) score += 15
  if (/[^A-Za-z0-9]/.test(password.value)) score += 10
  return Math.min(100, score)
})

const strengthLabel = computed(() => {
  if (strength.value >= 80) return '非常强'
  if (strength.value >= 60) return '强'
  if (strength.value >= 40) return '中等'
  return '弱'
})
const strengthColor = computed(() => {
  if (strength.value >= 80) return 'text-green-500'
  if (strength.value >= 60) return 'text-blue-500'
  if (strength.value >= 40) return 'text-amber-500'
  return 'text-red-500'
})
const strengthBarColor = computed(() => {
  if (strength.value >= 80) return 'bg-green-500'
  if (strength.value >= 60) return 'bg-blue-500'
  if (strength.value >= 40) return 'bg-amber-500'
  return 'bg-red-500'
})

async function copyPwd() {
  if (!password.value) return
  await navigator.clipboard.writeText(password.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
async function copySingle(p, i) {
  await navigator.clipboard.writeText(p)
  copiedIdx.value = i
  setTimeout(() => copiedIdx.value = -1, 2000)
}

onMounted(() => generatePassword())
</script>
