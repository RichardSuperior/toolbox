<template>
  <ToolLayout title="HTML 在线编辑器">
    <div class="html-editor">
      <div class="tool-bar">
        <button class="btn" @click="run">▶ 预览</button>
        <button class="btn btn-outline" @click="clearCode">清空</button>
      </div>
      <div class="editor-area">
        <div class="code-panel">
          <div class="label">HTML 代码</div>
          <textarea v-model="html" class="code-area" placeholder="<div>Hello</div>"></textarea>
        </div>
        <div class="preview-panel">
          <div class="label">预览效果</div>
          <iframe ref="previewRef" class="preview-frame" sandbox="allow-scripts"></iframe>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const html = ref('<style>\nbody { font-family: sans-serif; padding: 20px; }\n</style>\n<h1>Hello World</h1>\n<p>这是一个在线 HTML 编辑器</p>')
const previewRef = ref(null)

function run() {
  if (!previewRef.value) return
  const doc = previewRef.value.contentDocument
  doc.open()
  doc.write(html.value)
  doc.close()
}

function clearCode() { html.value = '' }
</script>

<style scoped>
.html-editor { display: flex; flex-direction: column; gap: 12px; }
.tool-bar { display: flex; gap: 8px; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.editor-area { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; height: 500px; }
.code-panel, .preview-panel { display: flex; flex-direction: column; }
.label { font-weight: 600; font-size: 14px; color: #24292f; margin-bottom: 6px; }
.code-area { flex: 1; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 13px; resize: none; background: #f6f8fa; box-sizing: border-box; }
.preview-frame { flex: 1; border: 1px solid #d0d7de; border-radius: 6px; background: white; }
@media (max-width: 768px) { .editor-area { grid-template-columns: 1fr; height: auto; } .preview-frame { height: 300px; } }
</style>
