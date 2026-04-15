<template>
  <ToolLayout title="JSON 格式化" subtitle="JSON 格式化、压缩、校验与转义" icon="📋">
    <div class="card p-6 mb-4">
      <!-- 工具栏 -->
      <div class="flex flex-wrap gap-2 mb-4">
        <button @click="format" class="btn-primary text-sm">✨ 格式化</button>
        <button @click="compress" class="btn-secondary text-sm">📦 压缩</button>
        <button @click="validate" class="btn-secondary text-sm">✅ 校验</button>
        <button @click="escape" class="btn-secondary text-sm">⤵ 转义</button>
        <button @click="unescape" class="btn-secondary text-sm">⤴ 去转义</button>
        <div class="flex items-center gap-2 ml-auto">
          <label class="text-xs text-[var(--text-secondary)]">缩进</label>
          <select v-model="indent" class="input-base py-1.5 px-2 text-xs w-20">
            <option :value="2">2空格</option>
            <option :value="4">4空格</option>
            <option value="	">Tab</option>
          </select>
        </div>
      </div>

      <!-- 编辑区 -->
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-[var(--text-secondary)]">输入 JSON</label>
            <button @click="input = ''" class="text-xs text-[var(--text-secondary)] hover:text-red-400">清空</button>
          </div>
          <textarea
            v-model="input"
            rows="18"
            class="input-base w-full font-mono text-sm resize-none"
            placeholder='{"name":"SuperiorHui","version":"1.0"}'
          />
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-[var(--text-secondary)]">输出结果</label>
            <button v-if="output" @click="copyOutput" class="text-xs text-primary-500 hover:text-primary-600">
              {{ copied ? '✓ 已复制' : '复制' }}
            </button>
          </div>
          <div
            :class="['min-h-[400px] bg-[var(--bg-secondary)] border rounded-xl p-4 font-mono text-sm whitespace-pre overflow-auto',
              statusClass]"
            style="max-height: 500px;"
          >{{ output || '结果将在此显示...' }}</div>
        </div>
      </div>

      <!-- 状态提示 -->
      <div v-if="message" :class="['mt-3 px-4 py-2 rounded-lg text-sm', msgClass]">
        {{ message }}
      </div>
    </div>

    <template #knowledge>
      <div class="text-sm text-[var(--text-secondary)] space-y-2">
        <p><strong>格式化</strong>：将 JSON 字符串美化为可读格式，添加缩进和换行。</p>
        <p><strong>压缩</strong>：去除所有空格和换行，压缩为单行，减小传输体积。</p>
        <p><strong>转义</strong>：将格式化后的 JSON 字符串中的引号、换行等特殊字符进行转义，适合嵌入字符串使用。</p>
        <p><strong>校验</strong>：检测 JSON 是否符合标准格式，输出具体错误位置。</p>
      </div>
    </template>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const input = ref('')
const output = ref('')
const message = ref('')
const copied = ref(false)
const indent = ref(2)
const status = ref('idle') // idle | success | error | info

const statusClass = computed(() => {
  if (status.value === 'error') return 'border-red-300 dark:border-red-800 text-red-500'
  if (status.value === 'success') return 'border-[var(--border-color)] text-[var(--text-primary)]'
  return 'border-[var(--border-color)] text-[var(--text-primary)]'
})

const msgClass = computed(() => {
  if (status.value === 'error') return 'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400'
  if (status.value === 'success') return 'bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 text-green-600 dark:text-green-400'
  return 'bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 text-blue-600 dark:text-blue-400'
})

function tryParse(str) {
  return JSON.parse(str.trim())
}

function format() {
  try {
    const obj = tryParse(input.value)
    output.value = JSON.stringify(obj, null, indent.value)
    message.value = '✅ JSON 有效，格式化成功'
    status.value = 'success'
  } catch (e) {
    output.value = ''
    message.value = `❌ JSON 解析失败：${e.message}`
    status.value = 'error'
  }
}

function compress() {
  try {
    const obj = tryParse(input.value)
    output.value = JSON.stringify(obj)
    message.value = `✅ 压缩成功（${output.value.length} 字节）`
    status.value = 'success'
  } catch (e) {
    output.value = ''
    message.value = `❌ 解析失败：${e.message}`
    status.value = 'error'
  }
}

function validate() {
  try {
    tryParse(input.value)
    message.value = '✅ JSON 格式有效'
    status.value = 'success'
    output.value = '有效的 JSON ✓'
  } catch (e) {
    message.value = `❌ 无效的 JSON：${e.message}`
    status.value = 'error'
    output.value = ''
  }
}

function escape() {
  try {
    const obj = tryParse(input.value)
    const formatted = JSON.stringify(obj, null, indent.value)
    output.value = JSON.stringify(formatted)
    message.value = '✅ 转义成功'
    status.value = 'success'
  } catch (e) {
    // 直接转义输入文本
    output.value = JSON.stringify(input.value)
    message.value = 'ℹ️ 作为字符串转义'
    status.value = 'info'
  }
}

function unescape() {
  try {
    const unescaped = JSON.parse(input.value.trim())
    if (typeof unescaped === 'string') {
      output.value = unescaped
      message.value = '✅ 去转义成功'
      status.value = 'success'
    } else {
      output.value = JSON.stringify(unescaped, null, indent.value)
      message.value = '✅ 解析成功'
      status.value = 'success'
    }
  } catch (e) {
    message.value = `❌ 去转义失败：${e.message}`
    status.value = 'error'
    output.value = ''
  }
}

async function copyOutput() {
  await navigator.clipboard.writeText(output.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>
