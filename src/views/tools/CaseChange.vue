<template>
  <ToolLayout title="英文大小写转换">
    <div class="tool-wrap">
      <div class="toolbar">
        <button class="btn" @click="toUpper">全部大写</button>
        <button class="btn" @click="toLower">全部小写</button>
        <button class="btn" @click="toTitle">首字母大写</button>
        <button class="btn" @click="toCamel">驼峰</button>
        <button class="btn" @click="toSnake">下划线</button>
        <button class="btn" @click="toToggle">大小写互换</button>
        <button class="btn btn-outline" @click="clear">清空</button>
        <button class="btn btn-outline" @click="copy" v-if="output">复制</button>
      </div>
      <div class="editor-wrap">
        <div>
          <div class="label">输入</div>
          <textarea v-model="input" rows="14" class="code-area" placeholder="输入英文文本..." @input="convert"></textarea>
        </div>
        <div>
          <div class="label">输出</div>
          <textarea v-model="output" rows="14" readonly class="code-area output"></textarea>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const input = ref(''), output = ref('')
function toUpper() { output.value = input.value.toUpperCase() }
function toLower() { output.value = input.value.toLowerCase() }
function toTitle() { output.value = input.value.replace(/\b\w/g, c => c.toUpperCase()) }
function toCamel() {
  output.value = input.value.toLowerCase().replace(/[-_\s]+(.)/g, (_, c) => c.toUpperCase())
}
function toSnake() {
  output.value = input.value.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/[\s-]+/g, '_').toLowerCase()
}
function toToggle() { output.value = [...input.value].map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('') }
function clear() { input.value = ''; output.value = '' }
function copy() { navigator.clipboard.writeText(output.value).then(() => alert('✅ 已复制')) }
function convert() {}
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 12px; }
.toolbar { display: flex; gap: 8px; flex-wrap: wrap; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.label { font-size: 12px; color: #666; font-weight: 600; margin-bottom: 4px; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.code-area { width: 100%; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 14px; resize: vertical; box-sizing: border-box; }
.output { background: #f6f8fa; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
