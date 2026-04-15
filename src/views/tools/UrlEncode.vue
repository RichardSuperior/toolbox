<template>
  <ToolLayout title="URL 编解码" subtitle="URL地址的编码与解码转换" icon="🔗">
    <div class="card p-6 mb-4">
      <!-- 模式切换 -->
      <div class="flex gap-2 mb-5">
        <button
          v-for="m in modes" :key="m.value"
          @click="mode = m.value"
          :class="mode === m.value ? 'btn-primary' : 'btn-secondary'"
          class="px-4 py-2 text-sm"
        >{{ m.label }}</button>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <!-- 输入 -->
        <div>
          <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            {{ mode === 'encode' ? '原始文本' : 'URL编码字符串' }}
          </label>
          <textarea
            v-model="input"
            rows="10"
            class="input-base w-full font-mono text-sm resize-none"
            :placeholder="mode === 'encode' ? '输入要编码的文本，如：https://example.com/路径?key=值' : '输入要解码的URL编码字符串'"
          />
        </div>
        <!-- 输出 -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-[var(--text-secondary)]">
              {{ mode === 'encode' ? '编码结果' : '解码结果' }}
            </label>
            <button v-if="output" @click="copyOutput" class="text-xs text-primary-500 hover:text-primary-600">
              {{ copied ? '✓ 已复制' : '复制' }}
            </button>
          </div>
          <div
            class="min-h-[220px] bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 font-mono text-sm text-[var(--text-primary)] break-all whitespace-pre-wrap"
          >
            <span v-if="error" class="text-red-500">{{ error }}</span>
            <span v-else>{{ output || '结果将在此显示...' }}</span>
          </div>
        </div>
      </div>

      <div class="flex gap-3 mt-4">
        <button @click="swap" class="btn-secondary text-sm">⇄ 交换内容</button>
        <button @click="input = ''" class="btn-secondary text-sm">清空</button>
      </div>
    </div>

    <template #knowledge>
      <div class="text-sm text-[var(--text-secondary)] space-y-2">
        <p><strong>encodeURIComponent</strong>：对特殊字符（包括 <code class="bg-[var(--bg-secondary)] px-1 rounded">! ' ( ) * - _ . ~</code> 除外）进行编码，适合编码URL参数值。</p>
        <p><strong>encodeURI</strong>：只编码空格等少数字符，保留URL结构字符（<code class="bg-[var(--bg-secondary)] px-1 rounded">: / ? # [ ] @</code>），适合编码完整URL。</p>
        <p>中文字符会被编码为 UTF-8 百分号形式，如 "你好" → <code class="bg-[var(--bg-secondary)] px-1 rounded">%E4%BD%A0%E5%A5%BD</code>。</p>
      </div>
    </template>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const mode = ref('encode')
const input = ref('')
const copied = ref(false)
const error = ref('')

const modes = [
  { value: 'encode', label: '编码' },
  { value: 'decode', label: '解码' },
]

const output = computed(() => {
  if (!input.value) return ''
  error.value = ''
  try {
    if (mode.value === 'encode') {
      return encodeURIComponent(input.value)
    } else {
      return decodeURIComponent(input.value)
    }
  } catch (e) {
    error.value = '无效的URL编码字符串，请检查输入'
    return ''
  }
})

async function copyOutput() {
  if (!output.value) return
  await navigator.clipboard.writeText(output.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

function swap() {
  const prev = input.value
  input.value = output.value
  mode.value = mode.value === 'encode' ? 'decode' : 'encode'
}
</script>
