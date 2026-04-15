<template>
  <ToolLayout title="Unicode 转换" subtitle="文本与Unicode编码互相转换" icon="🔣">
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
        <div>
          <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            {{ mode === 'encode' ? '输入文本' : 'Unicode 编码' }}
          </label>
          <textarea
            v-model="input"
            rows="10"
            class="input-base w-full font-mono text-sm resize-none"
            :placeholder="mode === 'encode' ? '输入文本，如：你好世界' : '输入Unicode编码，如：\\u4f60\\u597d'"
          />
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-[var(--text-secondary)]">
              {{ mode === 'encode' ? 'Unicode 编码' : '解码结果' }}
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
        <p>Unicode 是国际标准字符集，为世界上几乎所有书面语言的字符提供了唯一编号。</p>
        <p>在 JavaScript 中，使用 <code class="bg-[var(--bg-secondary)] px-1 rounded">\uXXXX</code> 格式表示 Unicode 字符，如 <code class="bg-[var(--bg-secondary)] px-1 rounded">\u4e2d\u6587</code> 表示"中文"。</p>
        <p>汉字 Unicode 范围为 U+4E00 ~ U+9FFF（基本汉字区段）。</p>
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
  { value: 'encode', label: '文本 → Unicode' },
  { value: 'decode', label: 'Unicode → 文本' },
]

const output = computed(() => {
  if (!input.value) return ''
  error.value = ''
  try {
    if (mode.value === 'encode') {
      return input.value.split('').map(c => {
        const code = c.codePointAt(0)
        if (code > 127) {
          return code > 0xFFFF
            ? `\\u{${code.toString(16).toUpperCase()}}`
            : `\\u${code.toString(16).padStart(4, '0').toUpperCase()}`
        }
        return c
      }).join('')
    } else {
      // 支持 \uXXXX 和 \u{XXXXX} 格式
      return input.value
        .replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
        .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    }
  } catch (e) {
    error.value = '转换失败，请检查输入格式'
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
  input.value = output.value
  mode.value = mode.value === 'encode' ? 'decode' : 'encode'
}
</script>
