<template>
  <ToolLayout title="关键词密度分析">
    <div class="tool-wrap">
      <div class="toolbar">
        <button class="btn" @click="analyze">▶ 分析</button>
        <button class="btn btn-outline" @click="clear">清空</button>
        <label class="opt-label">最小词频: <input type="number" v-model.number="minFreq" min="1" max="20" class="num-input" /></label>
        <label class="opt-label">最大词长: <input type="number" v-model.number="maxLen" min="1" max="10" class="num-input" /></label>
      </div>
      <div class="editor-wrap">
        <div>
          <div class="label">文章内容</div>
          <textarea v-model="input" rows="16" class="code-area" placeholder="粘贴文章内容..."></textarea>
        </div>
        <div>
          <div class="label">关键词密度分析结果</div>
          <div v-if="results.length" class="results-panel">
            <div class="stats-row">
              <span>总字数: {{ totalChars }}</span>
              <span>总词数: {{ totalWords }}</span>
            </div>
            <div class="keyword-list">
              <div v-for="item in results" :key="item.word" class="keyword-item">
                <span class="kw-word">{{ item.word }}</span>
                <div class="kw-bar-wrap">
                  <div class="kw-bar" :style="{ width: item.pct + '%' }"></div>
                </div>
                <span class="kw-freq">{{ item.freq }}次</span>
                <span class="kw-pct">{{ item.pct.toFixed(2) }}%</span>
              </div>
            </div>
          </div>
          <div v-else class="empty-hint">点击"分析"查看结果</div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const input = ref(''), results = ref([]), totalChars = ref(0), totalWords = ref(0)
const minFreq = ref(2), maxLen = ref(6)
const stopWords = new Set(['的','了','是','在','和','有','我','你','他','她','它','们','这','那','也','都','就','到','而','与','为','以','来','去','说','不','很','但','及','对','于','从','被','把','因','所','其','如','还'])

function analyze() {
  if (!input.value.trim()) { alert('请输入文章内容'); return }
  totalChars.value = input.value.replace(/\s/g, '').length
  const words = input.value.match(/[\u4e00-\u9fa5]{2,}/g) || []
  totalWords.value = words.length
  const freq = {}
  words.forEach(w => {
    if (w.length <= maxLen.value && !stopWords.has(w)) {
      freq[w] = (freq[w] || 0) + 1
    }
    // 2-gram
    for (let i = 0; i < w.length - 1; i++) {
      const bi = w.slice(i, i+2)
      if (!stopWords.has(bi)) freq[bi] = (freq[bi] || 0) + 1
    }
  })
  const maxFreq = Math.max(...Object.values(freq))
  results.value = Object.entries(freq)
    .filter(([, v]) => v >= minFreq.value)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([word, freq]) => ({ word, freq, pct: (freq / maxFreq) * 100 }))
}
function clear() { input.value = ''; results.value = [] }
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 12px; }
.toolbar { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.opt-label { font-size: 13px; display: flex; align-items: center; gap: 6px; }
.num-input { width: 55px; padding: 4px 8px; border: 1px solid #d0d7de; border-radius: 4px; font-size: 13px; }
.label { font-size: 12px; color: #666; font-weight: 600; margin-bottom: 4px; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.code-area { width: 100%; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 14px; resize: vertical; box-sizing: border-box; }
.results-panel { border: 1px solid #d0d7de; border-radius: 8px; padding: 12px; height: 380px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; }
.stats-row { display: flex; gap: 16px; font-size: 13px; color: #666; padding-bottom: 8px; border-bottom: 1px solid #eee; }
.keyword-list { display: flex; flex-direction: column; gap: 6px; }
.keyword-item { display: flex; align-items: center; gap: 8px; }
.kw-word { width: 70px; font-size: 13px; font-weight: 600; }
.kw-bar-wrap { flex: 1; height: 8px; background: #eee; border-radius: 4px; overflow: hidden; }
.kw-bar { height: 100%; background: #0969da; border-radius: 4px; transition: width 0.3s; }
.kw-freq { width: 40px; font-size: 12px; color: #666; text-align: right; }
.kw-pct { width: 55px; font-size: 12px; color: #0969da; text-align: right; }
.empty-hint { border: 1px dashed #d0d7de; border-radius: 8px; padding: 60px; text-align: center; color: #999; font-size: 14px; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
