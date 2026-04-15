<template>
  <ToolLayout title="文本去重" subtitle="去除文本中的重复行，保留唯一内容" icon="🧹">
    <div class="card p-6 mb-4">
      <!-- 选项 -->
      <div class="flex flex-wrap gap-4 mb-5">
        <label class="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
          <input type="checkbox" v-model="ignoreCase" class="accent-primary-600 w-4 h-4" />
          忽略大小写
        </label>
        <label class="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
          <input type="checkbox" v-model="trimLines" class="accent-primary-600 w-4 h-4" />
          去除首尾空格
        </label>
        <label class="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
          <input type="checkbox" v-model="removeEmpty" class="accent-primary-600 w-4 h-4" />
          去除空行
        </label>
        <label class="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
          <input type="checkbox" v-model="sortResult" class="accent-primary-600 w-4 h-4" />
          排序结果
        </label>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-[var(--text-secondary)]">原始文本</label>
            <span class="text-xs text-[var(--text-secondary)]">{{ inputLines }} 行</span>
          </div>
          <textarea
            v-model="input"
            rows="14"
            class="input-base w-full font-mono text-sm resize-none"
            placeholder="每行一条内容，粘贴文本后自动去重..."
          />
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-[var(--text-secondary)]">去重结果</label>
            <div class="flex items-center gap-3">
              <span class="text-xs text-[var(--text-secondary)]">{{ outputLines }} 行（去除 {{ removedCount }} 条）</span>
              <button v-if="output" @click="copyOutput" class="text-xs text-primary-500 hover:text-primary-600">
                {{ copied ? '✓ 已复制' : '复制' }}
              </button>
            </div>
          </div>
          <div
            class="min-h-[308px] bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 font-mono text-sm text-[var(--text-primary)] whitespace-pre-wrap overflow-auto"
          >{{ output || '结果将在此显示...' }}</div>
        </div>
      </div>
    </div>

    <template #knowledge>
      <div class="text-sm text-[var(--text-secondary)] space-y-2">
        <p>文本去重工具按行进行处理，相同内容只保留第一次出现的那一行。</p>
        <p>勾选「忽略大小写」时，"Hello" 和 "hello" 视为重复项（输出保留先出现的原始大小写）。</p>
        <p>适合处理：重复的网址列表、用户名列表、关键词列表等场景。</p>
      </div>
    </template>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const input = ref('')
const ignoreCase = ref(false)
const trimLines = ref(true)
const removeEmpty = ref(true)
const sortResult = ref(false)
const copied = ref(false)

const inputLines = computed(() => input.value ? input.value.split('\n').length : 0)

const output = computed(() => {
  if (!input.value) return ''
  let lines = input.value.split('\n')
  if (trimLines.value) lines = lines.map(l => l.trim())
  if (removeEmpty.value) lines = lines.filter(l => l !== '')
  const seen = new Set()
  const unique = []
  for (const line of lines) {
    const key = ignoreCase.value ? line.toLowerCase() : line
    if (!seen.has(key)) {
      seen.add(key)
      unique.push(line)
    }
  }
  if (sortResult.value) unique.sort((a, b) => a.localeCompare(b))
  return unique.join('\n')
})

const outputLines = computed(() => output.value ? output.value.split('\n').filter(l => l !== '').length : 0)
const removedCount = computed(() => {
  const inCount = input.value ? input.value.split('\n').filter(l => !removeEmpty.value || l.trim() !== '').length : 0
  return Math.max(0, inCount - outputLines.value)
})

async function copyOutput() {
  if (!output.value) return
  await navigator.clipboard.writeText(output.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>
