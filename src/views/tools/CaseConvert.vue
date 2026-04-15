<template>
  <ToolLayout title="大小写转换" subtitle="英文文本大小写及命名风格转换" icon="🔠">
    <div class="card p-6 mb-4">
      <div class="mb-5">
        <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">输入文本</label>
        <textarea
          v-model="input"
          rows="5"
          class="input-base w-full font-mono text-sm resize-none"
          placeholder="输入要转换的文本..."
        />
      </div>

      <!-- 转换结果列表 -->
      <div class="space-y-3">
        <div
          v-for="item in results"
          :key="item.label"
          class="flex items-center justify-between gap-4 p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl"
        >
          <div class="min-w-0 flex-1">
            <div class="text-xs text-[var(--text-secondary)] mb-1">{{ item.label }}</div>
            <div class="font-mono text-sm text-[var(--text-primary)] break-all">{{ item.value || '—' }}</div>
          </div>
          <button
            v-if="item.value"
            @click="copy(item.value, item.label)"
            class="shrink-0 btn-secondary text-xs py-1.5 px-3"
          >
            {{ copiedLabel === item.label ? '✓ 已复制' : '复制' }}
          </button>
        </div>
      </div>
    </div>

    <template #knowledge>
      <div class="text-sm text-[var(--text-secondary)] space-y-1.5">
        <p><strong>camelCase（小驼峰）</strong>：首词小写，后续词首字母大写，如 <code class="bg-[var(--bg-secondary)] px-1 rounded">helloWorld</code>，常用于 JS 变量名。</p>
        <p><strong>PascalCase（大驼峰）</strong>：每个词首字母大写，如 <code class="bg-[var(--bg-secondary)] px-1 rounded">HelloWorld</code>，常用于类名。</p>
        <p><strong>snake_case（下划线）</strong>：词间用下划线连接，如 <code class="bg-[var(--bg-secondary)] px-1 rounded">hello_world</code>，常用于 Python/数据库字段。</p>
        <p><strong>kebab-case（短横线）</strong>：词间用短横线连接，如 <code class="bg-[var(--bg-secondary)] px-1 rounded">hello-world</code>，常用于 HTML 属性/CSS 类名。</p>
      </div>
    </template>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const input = ref('')
const copiedLabel = ref('')

function splitWords(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase → words
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean)
}

const results = computed(() => {
  if (!input.value.trim()) return []
  const words = splitWords(input.value)
  return [
    { label: '全部大写', value: input.value.toUpperCase() },
    { label: '全部小写', value: input.value.toLowerCase() },
    { label: '首字母大写', value: input.value.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()) },
    { label: 'camelCase（小驼峰）', value: words.map((w, i) => i === 0 ? w : w[0].toUpperCase() + w.slice(1)).join('') },
    { label: 'PascalCase（大驼峰）', value: words.map(w => w[0].toUpperCase() + w.slice(1)).join('') },
    { label: 'snake_case（下划线）', value: words.join('_') },
    { label: 'UPPER_SNAKE_CASE', value: words.join('_').toUpperCase() },
    { label: 'kebab-case（短横线）', value: words.join('-') },
    { label: '每词首字母大写', value: words.map(w => w[0].toUpperCase() + w.slice(1)).join(' ') },
  ]
})

async function copy(text, label) {
  await navigator.clipboard.writeText(text)
  copiedLabel.value = label
  setTimeout(() => copiedLabel.value = '', 2000)
}
</script>
