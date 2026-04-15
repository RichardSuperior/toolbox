<template>
  <ToolLayout title="Emoji 混合" subtitle="将两个 Emoji 合成独特的混合 Emoji" icon="🎨">
    <div class="card p-6">
      <!-- 选择区 -->
      <div class="flex items-center justify-center gap-6 mb-8 flex-wrap">
        <div class="text-center">
          <div class="text-6xl mb-3 cursor-pointer hover:scale-110 transition-transform select-none" @click="showPicker1 = !showPicker1; showPicker2 = false">{{ emoji1 }}</div>
          <div class="text-xs text-[var(--text-secondary)]">点击选择</div>
        </div>
        <div class="text-2xl text-[var(--text-secondary)]">+</div>
        <div class="text-center">
          <div class="text-6xl mb-3 cursor-pointer hover:scale-110 transition-transform select-none" @click="showPicker2 = !showPicker2; showPicker1 = false">{{ emoji2 }}</div>
          <div class="text-xs text-[var(--text-secondary)]">点击选择</div>
        </div>
        <div class="text-2xl text-[var(--text-secondary)]">=</div>
        <div class="text-center">
          <div class="w-[72px] h-[72px] mb-3 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-transform" @click="copyResult" :title="resultUrl ? '点击复制' : ''">
            <img v-if="resultUrl && resultUrl !== 'error'" :src="resultUrl" class="w-16 h-16" @error="resultUrl = 'error'" />
            <span v-else class="text-6xl">{{ resultUrl === 'error' ? '❓' : '⏳' }}</span>
          </div>
          <div class="text-xs text-[var(--text-secondary)]">{{ copied ? '已复制!' : (resultUrl === 'error' ? '不支持此组合' : '合成结果') }}</div>
        </div>
      </div>

      <!-- Emoji选择器 -->
      <div v-if="showPicker1 || showPicker2" class="mb-6 p-4 bg-[var(--bg-secondary)] rounded-xl">
        <div class="text-xs text-[var(--text-secondary)] mb-3">选择 Emoji {{ showPicker1 ? '1' : '2' }}</div>
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="e in emojiList" :key="e"
            @click="selectEmoji(e)"
            class="text-2xl p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >{{ e }}</button>
        </div>
      </div>

      <!-- 随机按钮 -->
      <div class="flex gap-3 justify-center">
        <button @click="randomPair" class="btn-primary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          随机混合
        </button>
        <button v-if="resultUrl && resultUrl !== 'error'" @click="copyResult" class="btn-secondary">
          {{ copied ? '已复制!' : '复制链接' }}
        </button>
      </div>

      <!-- 说明 -->
      <div class="mt-6 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl text-sm text-amber-700 dark:text-amber-400">
        💡 Emoji 混合基于 Google Emoji Kitchen 技术，并非所有组合都有合成结果，不支持的组合将显示 ❓
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, watch } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const emojiList = ['😀','😂','😍','🥰','😎','🤩','😭','😡','🤔','😴','👍','👋','🙏','💪','🎉','🎊','🔥','💯','❤️','⭐','🌈','🦋','🐶','🐱','🐸','🍕','🍣','☕','🎮','🏆']

const emoji1 = ref('😀')
const emoji2 = ref('❤️')
const resultUrl = ref('')
const showPicker1 = ref(false)
const showPicker2 = ref(false)
const copied = ref(false)

// Emoji Kitchen 版本列表，逐个尝试
const kitchenVersions = ['20201001', '20210218', '20210521', '20211115', '20220110', '20220203', '20220406', '20220506', '20220815', '20221101', '20230126', '20230301']

function getEmojiCode(emoji) {
  return [...emoji]
    .map(c => c.codePointAt(0).toString(16))
    .filter(c => c !== 'fe0f') // 去掉变体选择符
    .join('-')
}

async function fetchMix() {
  resultUrl.value = ''
  const code1 = getEmojiCode(emoji1.value)
  const code2 = getEmojiCode(emoji2.value)
  
  // 尝试两种顺序 + 多个版本
  const pairs = [
    [code1, code2],
    [code2, code1],
  ]
  
  for (const version of kitchenVersions) {
    for (const [a, b] of pairs) {
      const url = `https://www.gstatic.com/android/keyboard/emojikitchen/${version}/u${a}/u${a}_u${b}.png`
      try {
        const res = await fetch(url, { method: 'HEAD', mode: 'no-cors' })
        // no-cors 请求总是 opaque，改用 img 标签测试
        const testUrl = url
        const ok = await testImageLoad(testUrl)
        if (ok) {
          resultUrl.value = testUrl
          return
        }
      } catch {
        // 继续尝试
      }
    }
  }
  resultUrl.value = 'error'
}

function testImageLoad(url) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
    // 3秒超时
    setTimeout(() => resolve(false), 3000)
  })
}

watch([emoji1, emoji2], () => {
  fetchMix()
}, { immediate: true })

function selectEmoji(e) {
  if (showPicker1.value) { emoji1.value = e; showPicker1.value = false }
  else { emoji2.value = e; showPicker2.value = false }
}

function randomPair() {
  emoji1.value = emojiList[Math.floor(Math.random() * emojiList.length)]
  emoji2.value = emojiList[Math.floor(Math.random() * emojiList.length)]
}

async function copyResult() {
  if (!resultUrl.value || resultUrl.value === 'error') return
  await navigator.clipboard.writeText(resultUrl.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>
