<template>
  <ToolLayout title="文本内容替换">
    <div class="tool-wrap">
      <div class="options-row">
        <div class="option-item">
          <label>查找</label>
          <input v-model="search" class="opt-input" placeholder="输入查找内容..." />
        </div>
        <div class="option-item">
          <label>替换为</label>
          <input v-model="replace" class="opt-input" placeholder="替换内容（为空则删除）" />
        </div>
        <div class="option-flags">
          <label><input type="checkbox" v-model="useRegex" /> 正则</label>
          <label><input type="checkbox" v-model="caseSensitive" /> 区分大小写</label>
          <label><input type="checkbox" v-model="replaceAll" /> 全部替换</label>
        </div>
      </div>
      <div class="toolbar">
        <button class="btn" @click="doReplace">▶ 替换</button>
        <button class="btn btn-outline" @click="clear">清空</button>
        <button class="btn btn-outline" @click="copy" v-if="output">复制</button>
      </div>
      <div class="editor-wrap">
        <div><div class="label">原始文本</div>
          <textarea v-model="input" rows="14" class="code-area" placeholder="粘贴原始文本..."></textarea></div>
        <div><div class="label">替换结果</div>
          <textarea v-model="output" rows="14" readonly class="code-area output"></textarea></div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const input = ref(''), output = ref(''), search = ref(''), replace = ref('')
const useRegex = ref(false), caseSensitive = ref(false), replaceAll = ref(true)
function doReplace() {
  if (!search.value) { output.value = input.value; return }
  try {
    if (useRegex.value) {
      const flags = (replaceAll.value ? 'g' : '') + (caseSensitive.value ? '' : 'i')
      output.value = input.value.replace(new RegExp(search.value, flags), replace.value)
    } else {
      if (replaceAll.value) {
        const esc = search.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const flags = caseSensitive.value ? 'g' : 'gi'
        output.value = input.value.replace(new RegExp(esc, flags), replace.value)
      } else {
        const idx = caseSensitive.value ? input.value.indexOf(search.value) : input.value.toLowerCase().indexOf(search.value.toLowerCase())
        if (idx === -1) { output.value = input.value; return }
        output.value = input.value.slice(0, idx) + replace.value + input.value.slice(idx + search.value.length)
      }
    }
  } catch(e) { alert('正则错误: ' + e.message) }
}
function clear() { input.value = ''; output.value = '' }
function copy() { navigator.clipboard.writeText(output.value).then(() => alert('✅ 已复制')) }
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 12px; }
.options-row { display: flex; gap: 12px; flex-wrap: wrap; background: #f6f8fa; padding: 12px; border-radius: 8px; border: 1px solid #d0d7de; align-items: flex-end; }
.option-item { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 160px; }
.option-item label { font-size: 12px; font-weight: 600; color: #555; }
.opt-input { padding: 7px 10px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 13px; }
.option-flags { display: flex; gap: 12px; align-items: center; font-size: 13px; }
.option-flags label { display: flex; align-items: center; gap: 4px; cursor: pointer; }
.toolbar { display: flex; gap: 8px; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.label { font-size: 12px; color: #666; font-weight: 600; margin-bottom: 4px; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.code-area { width: 100%; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 13px; resize: vertical; box-sizing: border-box; }
.output { background: #f6f8fa; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
