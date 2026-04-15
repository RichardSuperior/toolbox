<template>
  <ToolLayout title="进制转换" subtitle="二进制、八进制、十进制、十六进制互相转换" icon="🔢">
    <div class="card p-6 mb-4">
      <!-- 快速输入任意进制 -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-[var(--text-secondary)] mb-3">输入数值（支持任意进制前缀）</label>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div v-for="base in bases" :key="base.radix" class="relative">
            <div class="text-xs text-[var(--text-secondary)] mb-1.5 flex items-center gap-1.5">
              <span class="font-medium">{{ base.label }}</span>
              <span class="text-[var(--text-secondary)]/60">{{ base.prefix }}</span>
            </div>
            <input
              v-model="base.input"
              @input="onInput(base)"
              :placeholder="base.placeholder"
              class="input-base w-full font-mono text-sm"
              :class="base.error ? 'border-red-400' : ''"
            />
            <div v-if="base.error" class="text-xs text-red-400 mt-1">{{ base.error }}</div>
          </div>
        </div>
      </div>

      <!-- 常用颜色代码区（16进制对照） -->
      <div v-if="decValue !== null" class="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]">
        <div class="text-xs text-[var(--text-secondary)] mb-3">十进制值：<span class="font-mono font-bold text-[var(--text-primary)]">{{ decValue }}</span></div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div v-for="base in bases" :key="base.radix" class="flex items-center justify-between bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3 py-2">
            <div>
              <div class="text-xs text-[var(--text-secondary)]">{{ base.label }}</div>
              <div class="font-mono text-sm font-semibold text-[var(--text-primary)]">{{ base.prefix }}{{ base.result }}</div>
            </div>
            <button @click="copy(base.result, base.label)" class="text-xs text-primary-500 ml-2">
              {{ copiedLabel === base.label ? '✓' : '复制' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 批量转换 -->
      <div class="mt-5">
        <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-3">自定义进制转换</h3>
        <div class="flex flex-wrap gap-3 items-end">
          <div>
            <label class="text-xs text-[var(--text-secondary)] block mb-1">原始进制</label>
            <select v-model.number="customFrom" class="input-base py-2 text-sm">
              <option v-for="n in supportedBases" :key="n" :value="n">{{ n }} 进制</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-[var(--text-secondary)] block mb-1">目标进制</label>
            <select v-model.number="customTo" class="input-base py-2 text-sm">
              <option v-for="n in supportedBases" :key="n" :value="n">{{ n }} 进制</option>
            </select>
          </div>
          <div class="flex-1 min-w-32">
            <label class="text-xs text-[var(--text-secondary)] block mb-1">输入值</label>
            <input v-model="customInput" @input="convertCustom" class="input-base w-full font-mono text-sm" placeholder="输入数值..." />
          </div>
          <div class="flex-1 min-w-32">
            <label class="text-xs text-[var(--text-secondary)] block mb-1">转换结果</label>
            <div class="flex gap-2">
              <div class="input-base flex-1 font-mono text-sm bg-[var(--bg-secondary)] text-[var(--text-primary)]">
                <span v-if="customError" class="text-red-400 text-xs">{{ customError }}</span>
                <span v-else>{{ customResult || '—' }}</span>
              </div>
              <button v-if="customResult" @click="copy(customResult, 'custom')" class="btn-secondary text-xs px-3">
                {{ copiedLabel === 'custom' ? '✓' : '复制' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #knowledge>
      <div class="text-sm text-[var(--text-secondary)] space-y-2">
        <p><strong>二进制（Binary）</strong>：只有 0 和 1，是计算机底层数据的表示方式，前缀 0b。</p>
        <p><strong>八进制（Octal）</strong>：使用 0-7，常用于 Unix 文件权限（如 chmod 755），前缀 0o。</p>
        <p><strong>十六进制（Hex）</strong>：使用 0-9 和 A-F，广泛用于颜色值、内存地址、哈希值，前缀 0x。</p>
        <p>内存中 1 字节 = 8 位二进制 = 2 位十六进制，如 <code class="bg-[var(--bg-secondary)] px-1 rounded">0xFF = 255 = 11111111₂</code>。</p>
      </div>
    </template>
  </ToolLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const decValue = ref(null)
const copiedLabel = ref('')
const customFrom = ref(10)
const customTo = ref(16)
const customInput = ref('')
const customResult = ref('')
const customError = ref('')

const supportedBases = [2, 4, 8, 10, 16, 32, 36]

const bases = reactive([
  { radix: 2, label: '二进制', prefix: '0b', placeholder: '1010', input: '', result: '', error: '' },
  { radix: 8, label: '八进制', prefix: '0o', placeholder: '12', input: '', result: '', error: '' },
  { radix: 10, label: '十进制', prefix: '', placeholder: '10', input: '', result: '', error: '' },
  { radix: 16, label: '十六进制', prefix: '0x', placeholder: 'A', input: '', result: '', error: '' },
])

function onInput(active) {
  active.error = ''
  const raw = active.input.replace(/^0[box]/i, '').trim()
  if (!raw) {
    decValue.value = null
    bases.forEach(b => { b.result = ''; if (b !== active) b.input = '' })
    return
  }
  try {
    const dec = parseInt(raw, active.radix)
    if (isNaN(dec)) throw new Error('invalid')
    decValue.value = dec
    bases.forEach(b => {
      b.result = dec.toString(b.radix).toUpperCase()
      if (b !== active) b.input = b.result
    })
  } catch {
    active.error = '无效的' + active.label + '数值'
    decValue.value = null
  }
}

function convertCustom() {
  customError.value = ''
  customResult.value = ''
  if (!customInput.value) return
  try {
    const dec = parseInt(customInput.value.trim(), customFrom.value)
    if (isNaN(dec)) throw new Error()
    customResult.value = dec.toString(customTo.value).toUpperCase()
  } catch {
    customError.value = '无效的输入'
  }
}

async function copy(text, label) {
  await navigator.clipboard.writeText(text)
  copiedLabel.value = label
  setTimeout(() => copiedLabel.value = '', 2000)
}
</script>
