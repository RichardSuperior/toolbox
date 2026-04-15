<template>
  <ToolLayout title="图片转 Base64">
    <div class="img-base64">
      <div class="drop-zone" @drop.prevent="onDrop" @dragover.prevent @click="$refs.fileInput.click()">
        <input ref="fileInput" type="file" accept="image/*" style="display:none" @change="onFileChange" />
        <div>📂 拖拽或点击上传图片</div>
      </div>
      <div v-if="result" class="result">
        <img :src="result" class="preview-img" />
        <div class="code-box">{{ result }}</div>
        <button class="btn" @click="copy">复制 Base64</button>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const result = ref(''), fileInput = ref(null)

function onFileChange(e) { const f = e.target.files[0]; if (f) readFile(f) }
function onDrop(e) { const f = e.dataTransfer.files[0]; if (f) readFile(f) }

function readFile(file) {
  const reader = new FileReader()
  reader.onload = (e) => { result.value = e.target.result }
  reader.readAsDataURL(file)
}

function copy() { if (!result.value) return; navigator.clipboard.writeText(result.value).then(() => alert('已复制')) }
</script>

<style scoped>
.img-base64 { display: flex; flex-direction: column; gap: 12px; }
.drop-zone { border: 2px dashed #d0d7de; border-radius: 8px; padding: 40px; text-align: center; cursor: pointer; color: #666; font-size: 14px; }
.drop-zone:hover { border-color: #0969da; background: #f6f8fa; }
.result { display: flex; flex-direction: column; gap: 8px; }
.preview-img { max-width: 200px; max-height: 200px; border-radius: 8px; border: 1px solid #d0d7de; }
.code-box { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 6px; padding: 12px; font-family: 'Fira Code', monospace; font-size: 11px; word-break: break-all; max-height: 120px; overflow-y: auto; }
.btn { padding: 8px 16px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; align-self: flex-start; }
</style>
