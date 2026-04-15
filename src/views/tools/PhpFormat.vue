<template>
  <ToolLayout title="PHP 代码格式化">
    <div class="fmt-tool">
      <div class="tool-bar">
        <button class="btn" @click="format">格式化</button>
        <button class="btn" @click="copyResult">复制</button>
        <button class="btn btn-outline" @click="clearAll">清空</button>
      </div>
      <div class="editor-wrap">
        <textarea v-model="input" class="code-area" placeholder="<?php echo 'Hello'; $arr=array(1,2,3); ?>"></textarea>
        <textarea v-model="output" class="code-area" readonly placeholder="格式化结果..."></textarea>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const input = ref(''), output = ref('')

function format() {
  output.value = input.value
    .replace(/<\?php\s*/g, '<?php\n')
    .replace(/\s*\?>/g, '\n?>')
    .replace(/\{\s*/g, '{\n')
    .replace(/\}\s*/g, '\n}\n')
    .replace(/;\s*/g, ';\n')
    .replace(/\n{2,}/g, '\n')
    .trim()
}

function copyResult() { if (!output.value) return; navigator.clipboard.writeText(output.value).then(() => alert('✅ 已复制')) }
function clearAll() { input.value = ''; output.value = '' }
</script>

<style scoped>
.fmt-tool { display: flex; flex-direction: column; gap: 12px; }
.tool-bar { display: flex; gap: 8px; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.code-area { width: 100%; min-height: 350px; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 13px; resize: vertical; background: #f6f8fa; box-sizing: border-box; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
