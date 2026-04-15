<template>
  <ToolLayout title="正则测试" subtitle="在线正则表达式测试与调试工具" icon="🧪">
    <div class="card p-6 mb-4">
      <!-- 正则输入 -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">正则表达式</label>
        <div class="flex items-stretch gap-2">
          <span class="flex items-center px-3 bg-[var(--bg-secondary)] border border-r-0 border-[var(--border-color)] rounded-l-xl text-[var(--text-secondary)] font-mono">/</span>
          <input
            v-model="pattern"
            class="input-base flex-1 font-mono rounded-none border-x-0"
            placeholder="输入正则表达式，如：\d+"
            @input="runTest"
          />
          <span class="flex items-center px-3 bg-[var(--bg-secondary)] border border-l-0 border-[var(--border-color)] rounded-r-xl text-[var(--text-secondary)] font-mono">/</span>
          <!-- 标志 -->
          <div class="flex gap-1.5 items-center ml-1">
            <button
              v-for="flag in flags"
              :key="flag.key"
              @click="flag.on = !flag.on; runTest()"
              :class="flag.on ? 'bg-primary-500 text-white border-primary-500' : 'btn-secondary'"
              class="w-8 h-8 font-mono text-sm border rounded-lg flex items-center justify-center"
              :title="flag.desc"
            >{{ flag.key }}</button>
          </div>
        </div>
        <div v-if="regexError" class="mt-2 text-sm text-red-400">❌ {{ regexError }}</div>
      </div>

      <!-- 测试文本 -->
      <div class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <label class="text-sm font-medium text-[var(--text-secondary)]">测试文本</label>
          <span v-if="!regexError && pattern" class="text-xs text-[var(--text-secondary)]">
            找到 <span class="font-bold text-primary-500">{{ matchCount }}</span> 个匹配
          </span>
        </div>
        <div class="relative">
          <textarea
            v-model="testText"
            rows="8"
            class="input-base w-full font-mono text-sm resize-none"
            placeholder="输入要测试的文本..."
            @input="runTest"
          />
        </div>
        <!-- 高亮结果（叠加层） -->
        <div
          v-if="!regexError && pattern && highlighted"
          class="mt-2 p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl font-mono text-sm text-[var(--text-primary)] whitespace-pre-wrap break-all"
          v-html="highlighted"
        />
      </div>

      <!-- 匹配详情 -->
      <div v-if="matches.length > 0">
        <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-3">匹配详情</h3>
        <div class="space-y-2 max-h-64 overflow-y-auto">
          <div
            v-for="(m, i) in matches"
            :key="i"
            class="flex items-start gap-3 p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg"
          >
            <span class="shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs flex items-center justify-center font-bold">{{ i+1 }}</span>
            <div class="flex-1 min-w-0">
              <div class="font-mono text-sm text-[var(--text-primary)] break-all">「{{ m.value }}」</div>
              <div class="text-xs text-[var(--text-secondary)] mt-0.5">位置 {{ m.index }} ~ {{ m.index + m.value.length }}</div>
              <div v-if="m.groups && m.groups.length > 0" class="mt-1.5 flex flex-wrap gap-1.5">
                <span v-for="(g, gi) in m.groups" :key="gi" class="text-xs bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded">
                  组{{ gi+1 }}：{{ g ?? '未匹配' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 快速模板 -->
      <div class="mt-5">
        <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-3">常用正则</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tpl in templates"
            :key="tpl.label"
            @click="useTemplate(tpl)"
            class="btn-secondary text-xs py-1.5"
          >{{ tpl.label }}</button>
        </div>
      </div>
    </div>

    <template #knowledge>
      <div class="text-sm text-[var(--text-secondary)] space-y-1.5">
        <p><strong>标志位说明：</strong></p>
        <p><code class="bg-[var(--bg-secondary)] px-1 rounded">g</code>（global）：全局匹配，找出所有匹配而不是只找第一个。</p>
        <p><code class="bg-[var(--bg-secondary)] px-1 rounded">i</code>（ignoreCase）：忽略大小写。</p>
        <p><code class="bg-[var(--bg-secondary)] px-1 rounded">m</code>（multiline）：多行模式，<code class="bg-[var(--bg-secondary)] px-1 rounded">^</code>/<code class="bg-[var(--bg-secondary)] px-1 rounded">$</code> 匹配每行开头/结尾。</p>
        <p><code class="bg-[var(--bg-secondary)] px-1 rounded">s</code>（dotAll）：<code class="bg-[var(--bg-secondary)] px-1 rounded">.</code> 匹配包括换行符在内的所有字符。</p>
      </div>
    </template>
  </ToolLayout>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const pattern = ref('')
const testText = ref('')
const regexError = ref('')
const matches = ref([])

const flags = reactive([
  { key: 'g', desc: '全局匹配', on: true },
  { key: 'i', desc: '忽略大小写', on: false },
  { key: 'm', desc: '多行模式', on: false },
  { key: 's', desc: '点号匹配换行', on: false },
])

const flagStr = computed(() => flags.filter(f => f.on).map(f => f.key).join(''))
const matchCount = computed(() => matches.value.length)

const templates = [
  { label: '手机号', pattern: '1[3-9]\\d{9}', text: '联系我：13800138000 或 18999999999' },
  { label: '邮箱', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', text: 'user@example.com test@gmail.com' },
  { label: 'IPv4', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', text: '192.168.1.1 和 10.0.0.1' },
  { label: 'URL', pattern: 'https?://[\\w\\-.]+(?:/[\\w\\-./?%&=]*)?', text: 'https://example.com/path?q=1' },
  { label: '中文', pattern: '[\\u4e00-\\u9fff]+', text: '这是中文 mixed with English' },
  { label: '日期', pattern: '\\d{4}[-/]\\d{1,2}[-/]\\d{1,2}', text: '2026-04-15 和 2025/12/31' },
  { label: '整数', pattern: '-?\\d+', text: '价格：100，折扣：-20，合计：80' },
  { label: '十六进制色值', pattern: '#[0-9a-fA-F]{3,6}', text: '#fff #FF0000 #1a2b3c' },
]

function runTest() {
  regexError.value = ''
  matches.value = []
  if (!pattern.value || !testText.value) return
  try {
    const re = new RegExp(pattern.value, flagStr.value)
    const allMatches = []
    if (flags[0].on) { // global
      let m
      const re2 = new RegExp(pattern.value, flagStr.value)
      while ((m = re2.exec(testText.value)) !== null) {
        allMatches.push({ value: m[0], index: m.index, groups: m.slice(1) })
        if (!re2.global) break
      }
    } else {
      const m = re.exec(testText.value)
      if (m) allMatches.push({ value: m[0], index: m.index, groups: m.slice(1) })
    }
    matches.value = allMatches
  } catch (e) {
    regexError.value = e.message
  }
}

const highlighted = computed(() => {
  if (!pattern.value || !testText.value || regexError.value) return ''
  try {
    const re = new RegExp(pattern.value, flagStr.value.includes('g') ? flagStr.value : flagStr.value + 'g')
    return testText.value
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(re, m => `<mark class="bg-yellow-200 dark:bg-yellow-700/60 rounded px-0.5">${m.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</mark>`)
  } catch { return '' }
})

function useTemplate(tpl) {
  pattern.value = tpl.pattern
  testText.value = tpl.text
  runTest()
}
</script>
