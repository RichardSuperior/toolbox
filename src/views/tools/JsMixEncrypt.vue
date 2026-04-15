<template>
  <ToolLayout title="JS 混合加密">
    <div class="js-mix">
      <div class="tool-bar">
        <button class="btn" @click="mixEncrypt">混合加密</button>
        <button class="btn btn-outline" @click="copyResult">复制</button>
        <button class="btn btn-outline" @click="clearAll">清空</button>
      </div>
      <div class="editor-wrap">
        <div class="input-wrap">
          <div class="label">输入 JS 代码</div>
          <textarea v-model="input" class="code-area" placeholder="function test(){ alert('Hello'); }"></textarea>
        </div>
        <div class="output-wrap">
          <div class="label">加密结果</div>
          <textarea v-model="output" class="code-area" readonly></textarea>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const input = ref('')
const output = ref('')

function mixEncrypt() {
  const code = input.value
  let encoded = ''
  for (let i = 0; i < code.length; i++) {
    encoded += code.charCodeAt(i).toString(36) + (i < code.length - 1 ? ',' : '')
  }
  const randomName = 'x' + Math.random().toString(36).substr(2, 6)
  output.value = `var ${randomName}=[${encoded}];${randomName}=String.fromCharCode.apply(null,${randomName});eval(${randomName})`
}

function copyResult() {
  if (!output.value) return
  navigator.clipboard.writeText(output.value).then(() => alert('✅ 已复制'))
}

function clearAll() { input.value = ''; output.value = '' }
</script>

<style scoped>
.js-mix { display: flex; flex-direction: column; gap: 12px; }
.tool-bar { display: flex; gap: 8px; flex-wrap: wrap; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn:hover { background: #0860ca; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.btn-outline:hover { background: #f6f8fa; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.label { font-weight: 600; font-size: 14px; color: #24292f; margin-bottom: 6px; }
.code-area { width: 100%; min-height: 300px; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 13px; resize: vertical; background: #f6f8fa; box-sizing: border-box; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
