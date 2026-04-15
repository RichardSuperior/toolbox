<template>
  <ToolLayout title="Base64 编解码" subtitle="快速、安全的文本与 Base64 格式互转工具" icon="🔤">
    <!-- 模式切换 -->
    <div class="card p-6 mb-4">
      <div class="flex items-center gap-3 mb-5">
        <div class="flex bg-[var(--bg-secondary)] rounded-lg p-1 text-sm">
          <button 
            @click="mode = 'encode'" 
            :class="mode === 'encode' ? 'bg-white dark:bg-slate-700 shadow-sm text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'"
            class="px-4 py-1.5 rounded-md font-medium transition-all"
          >编码</button>
          <button 
            @click="mode = 'decode'" 
            :class="mode === 'decode' ? 'bg-white dark:bg-slate-700 shadow-sm text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'"
            class="px-4 py-1.5 rounded-md font-medium transition-all"
          >解码</button>
        </div>
        <span class="text-xs text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-2 py-1 rounded-md">
          当前：{{ mode === 'encode' ? '文本 → Base64' : 'Base64 → 文本' }}
        </span>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <!-- 输入 -->
        <div>
          <label class="flex items-center justify-between text-xs font-medium text-[var(--text-secondary)] mb-2">
            <span>{{ mode === 'encode' ? '原始文本' : 'Base64 字符串' }}</span>
            <span>{{ input.length }} 字符</span>
          </label>
          <textarea 
            v-model="input" 
            :placeholder="mode === 'encode' ? '在此输入需要编码的文本...' : '在此输入 Base64 字符串...'"
            class="input-base h-48 font-mono text-sm"
          ></textarea>
        </div>
        <!-- 输出 -->
        <div>
          <label class="flex items-center justify-between text-xs font-medium text-[var(--text-secondary)] mb-2">
            <span>{{ mode === 'encode' ? '编码结果' : '解码结果' }}</span>
            <span>{{ output.length }} 字符</span>
          </label>
          <textarea 
            :value="output" 
            readonly 
            placeholder="结果将自动出现在这里..."
            class="input-base h-48 font-mono text-sm bg-[var(--bg-secondary)]"
          ></textarea>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex items-center gap-3 mt-4 flex-wrap">
        <button @click="copyOutput" class="btn-primary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
          {{ copied ? '已复制!' : '复制结果' }}
        </button>
        <button @click="swapIO" class="btn-secondary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
          </svg>
          交换内容
        </button>
        <button @click="input = ''; " class="btn-ghost">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
          清空
        </button>
        <!-- 错误提示 -->
        <span v-if="error" class="text-xs text-red-500 flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"/>
          </svg>
          {{ error }}
        </span>
      </div>
    </div>

    <template #knowledge>
      <div class="space-y-3 text-sm text-[var(--text-secondary)]">
        <p><strong class="text-[var(--text-primary)]">Base64 是什么？</strong>Base64 是一种基于64个可打印字符来表示二进制数据的表示方法，常用于在HTTP协议环境下传递较长的标识信息。</p>
        <p><strong class="text-[var(--text-primary)]">常见用途：</strong>图片内联到HTML、JWT令牌传输、邮件附件编码、API参数传递。</p>
        <p class="flex items-start gap-2">
          <svg class="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"/>
          </svg>
          <span><strong class="text-amber-600 dark:text-amber-400">注意：</strong>Base64 是编码，不是加密！任何人都可以轻易解码，请勿用于存储敏感信息。</span>
        </p>
      </div>
    </template>
  </ToolLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const mode = ref('encode')
const input = ref('')
const error = ref('')
const copied = ref(false)

const output = computed(() => {
  if (!input.value) return ''
  try {
    if (mode.value === 'encode') {
      error.value = ''
      // 使用 TextEncoder 正确处理 Unicode 字符
      const bytes = new TextEncoder().encode(input.value)
      let binary = ''
      bytes.forEach(b => binary += String.fromCharCode(b))
      return btoa(binary)
    } else {
      error.value = ''
      // 使用 TextDecoder 正确处理 Unicode 字符
      const binary = atob(input.value)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
      return new TextDecoder().decode(bytes)
    }
  } catch (e) {
    error.value = mode.value === 'decode' ? '无效的 Base64 字符串' : '编码失败'
    return ''
  }
})

watch(mode, () => {
  input.value = ''
  error.value = ''
})

async function copyOutput() {
  if (!output.value) return
  await navigator.clipboard.writeText(output.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

function swapIO() {
  const out = output.value
  mode.value = mode.value === 'encode' ? 'decode' : 'encode'
  input.value = out
}
</script>
