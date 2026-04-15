<template>
  <ToolLayout title="文字特效工具">
    <div class="tool-wrap">
      <div class="form-row">
        <textarea v-model="input" rows="4" class="main-input" placeholder="输入文字内容..."></textarea>
      </div>
      <div class="effects-grid">
        <div v-for="effect in effects" :key="effect.name" class="effect-card" @click="apply(effect)">
          <div class="effect-name">{{ effect.name }}</div>
          <div class="effect-preview">{{ effect.fn(preview) }}</div>
        </div>
      </div>
      <div v-if="output" class="result-section">
        <div class="result-label">{{ selectedEffect }} 效果：</div>
        <textarea v-model="output" rows="4" readonly class="code-area"></textarea>
        <button class="btn" @click="copy">复制</button>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const input = ref('代码蜂巢'), output = ref(''), selectedEffect = ref('')
const preview = computed(() => input.value.slice(0, 5) || '示例')
const effects = [
  { name: '空格分隔', fn: t => [...t].join(' ') },
  { name: '倒序排列', fn: t => [...t].reverse().join('') },
  { name: '全角转换', fn: t => [...t].map(c => { const code = c.charCodeAt(0); return code >= 0x21 && code <= 0x7E ? String.fromCharCode(code + 0xFEE0) : c }).join('') },
  { name: '方块文字', fn: t => [...t].join('□') },
  { name: '星号包围', fn: t => '★ ' + t + ' ★' },
  { name: '双括号', fn: t => '【' + t + '】' },
  { name: '书名号', fn: t => '《' + t + '》' },
  { name: '引号包围', fn: t => '"' + t + '"' },
  { name: '波浪线', fn: t => '～' + t + '～' },
  { name: '竖排', fn: t => [...t].join('\n') },
  { name: '重复两遍', fn: t => t + t },
  { name: '中间点', fn: t => [...t].join('·') },
  { name: '带括号数字', fn: t => [...t].map((c, i) => `(${i+1})${c}`).join(' ') },
  { name: '方块包围', fn: t => '▣' + [...t].join('▣') + '▣' },
  { name: '箭头引导', fn: t => '→ ' + t },
  { name: '彩蛋emoji', fn: t => '🎉' + t + '🎉' },
]
function apply(eff) {
  selectedEffect.value = eff.name
  output.value = eff.fn(input.value)
}
function copy() { navigator.clipboard.writeText(output.value).then(() => alert('✅ 已复制')) }
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 14px; }
.main-input { width: 100%; padding: 12px; border: 2px solid #d0d7de; border-radius: 8px; font-size: 16px; resize: none; box-sizing: border-box; }
.effects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 8px; }
.effect-card { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 12px; cursor: pointer; transition: all 0.15s; }
.effect-card:hover { background: #f0f6ff; border-color: #0969da; }
.effect-name { font-size: 12px; font-weight: 600; color: #0969da; margin-bottom: 6px; }
.effect-preview { font-size: 14px; color: #333; word-break: break-all; }
.result-section { display: flex; flex-direction: column; gap: 8px; }
.result-label { font-size: 13px; font-weight: 600; }
.code-area { width: 100%; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 14px; resize: none; box-sizing: border-box; background: #f6f8fa; }
.btn { padding: 8px 18px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; align-self: flex-start; }
</style>
