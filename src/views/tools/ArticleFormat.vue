<template>
  <ToolLayout title="文章自动排版">
    <div class="tool-wrap">
      <div class="toolbar">
        <button class="btn" @click="format">▶ 排版</button>
        <button class="btn btn-outline" @click="clear">清空</button>
        <button class="btn btn-outline" @click="copy" v-if="output">复制结果</button>
        <label class="opt-label"><input type="checkbox" v-model="addIndent" /> 段落首行缩进</label>
        <label class="opt-label"><input type="checkbox" v-model="removeBlank" /> 删除多余空行</label>
        <label class="opt-label"><input type="checkbox" v-model="addSpace" /> 中英文间加空格</label>
      </div>
      <div class="editor-wrap">
        <div class="editor-col">
          <div class="label">原始文本</div>
          <textarea v-model="input" rows="20" class="code-area" placeholder="粘贴需要排版的文章内容..."></textarea>
        </div>
        <div class="editor-col">
          <div class="label">排版结果</div>
          <textarea v-model="output" rows="20" readonly class="code-area output"></textarea>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const input = ref(''), output = ref('')
const addIndent = ref(true), removeBlank = ref(true), addSpace = ref(true)
function format() {
  let t = input.value
  if (removeBlank.value) t = t.replace(/\n{3,}/g, '\n\n')
  const lines = t.split('\n').map(l => l.trim()).filter(l => l || !removeBlank.value)
  if (addIndent.value) {
    output.value = lines.map(l => l ? '\u3000\u3000' + l : l).join('\n')
  } else {
    output.value = lines.join('\n')
  }
  if (addSpace.value) {
    output.value = output.value.replace(/([\u4e00-\u9fa5])([A-Za-z0-9])/g, '$1 $2').replace(/([A-Za-z0-9])([\u4e00-\u9fa5])/g, '$1 $2')
  }
}
function clear() { input.value = ''; output.value = '' }
function copy() { navigator.clipboard.writeText(output.value).then(() => alert('✅ 已复制')) }
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 12px; }
.toolbar { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.opt-label { font-size: 13px; display: flex; align-items: center; gap: 4px; cursor: pointer; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.editor-col { display: flex; flex-direction: column; gap: 6px; }
.label { font-size: 12px; color: #666; font-weight: 600; }
.code-area { width: 100%; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 14px; resize: vertical; line-height: 1.7; box-sizing: border-box; }
.output { background: #f6f8fa; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
