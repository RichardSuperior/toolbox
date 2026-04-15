<template>
  <ToolLayout title="ICO 图标生成器">
    <div class="tool-wrap">
      <div class="upload-area" @dragover.prevent @drop.prevent="handleDrop" @click="fileInput.click()">
        <input ref="fileInput" type="file" accept="image/*" style="display:none" @change="handleFile" />
        <div class="upload-icon">🖼️</div>
        <div class="upload-text">点击或拖放图片到此处</div>
        <div class="upload-hint">支持 PNG、JPG、GIF、BMP、SVG 等格式</div>
      </div>
      <div v-if="srcUrl" class="preview-section">
        <div class="preview-row">
          <div class="preview-item">
            <div class="preview-label">原图预览</div>
            <img :src="srcUrl" class="preview-img" />
          </div>
          <div class="preview-item">
            <div class="preview-label">ICO 预览（32x32）</div>
            <canvas ref="icoCanvas" class="ico-preview"></canvas>
          </div>
        </div>
        <div class="size-select">
          <div class="size-label">选择尺寸：</div>
          <label v-for="s in sizes" :key="s" class="size-option">
            <input type="checkbox" v-model="selectedSizes" :value="s" /> {{ s }}x{{ s }}
          </label>
        </div>
        <div class="actions">
          <button class="btn" @click="download">下载 ICO</button>
          <button class="btn btn-outline" @click="downloadPng">下载 PNG</button>
        </div>
      </div>
      <div class="guide-box">
        <p>💡 生成的 ICO 文件为 PNG 格式封装，兼容主流浏览器 favicon 使用。</p>
        <p>建议使用 <strong>透明背景 PNG</strong> 图片，效果最佳。</p>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const fileInput = ref(null), icoCanvas = ref(null)
const srcUrl = ref(''), sizes = [16, 32, 48, 64, 128, 256]
const selectedSizes = ref([16, 32, 48])

function handleFile(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = ev => {
    srcUrl.value = ev.target.result
    renderPreview(ev.target.result)
  }
  reader.readAsDataURL(file)
}
function handleDrop(e) {
  const file = e.dataTransfer.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = ev => { srcUrl.value = ev.target.result; renderPreview(ev.target.result) }
  reader.readAsDataURL(file)
}
function renderPreview(src) {
  const img = new Image()
  img.onload = () => {
    const c = icoCanvas.value
    if (!c) return
    c.width = 32; c.height = 32
    const ctx = c.getContext('2d')
    ctx.clearRect(0, 0, 32, 32)
    ctx.drawImage(img, 0, 0, 32, 32)
  }
  img.src = src
}
function download() {
  const img = new Image()
  img.onload = () => {
    const size = selectedSizes.value[0] || 32
    const c = document.createElement('canvas')
    c.width = size; c.height = size
    c.getContext('2d').drawImage(img, 0, 0, size, size)
    const a = document.createElement('a')
    a.download = 'favicon.ico'
    a.href = c.toDataURL('image/png')
    a.click()
  }
  img.src = srcUrl.value
}
function downloadPng() {
  const img = new Image()
  img.onload = () => {
    const c = document.createElement('canvas')
    c.width = 256; c.height = 256
    c.getContext('2d').drawImage(img, 0, 0, 256, 256)
    const a = document.createElement('a')
    a.download = 'favicon.png'
    a.href = c.toDataURL('image/png')
    a.click()
  }
  img.src = srcUrl.value
}
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 16px; }
.upload-area { border: 2px dashed #0969da; border-radius: 12px; padding: 40px; text-align: center; cursor: pointer; transition: background 0.2s; }
.upload-area:hover { background: #f0f6ff; }
.upload-icon { font-size: 40px; margin-bottom: 8px; }
.upload-text { font-size: 16px; font-weight: 600; color: #0969da; }
.upload-hint { font-size: 13px; color: #666; margin-top: 4px; }
.preview-section { display: flex; flex-direction: column; gap: 14px; }
.preview-row { display: flex; gap: 20px; flex-wrap: wrap; }
.preview-item { display: flex; flex-direction: column; gap: 6px; }
.preview-label { font-size: 12px; font-weight: 600; color: #666; }
.preview-img { max-width: 120px; max-height: 120px; border: 1px solid #d0d7de; border-radius: 6px; }
.ico-preview { width: 64px; height: 64px; border: 1px solid #d0d7de; border-radius: 6px; image-rendering: pixelated; }
.size-select { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; font-size: 13px; }
.size-label { font-weight: 600; }
.size-option { display: flex; align-items: center; gap: 4px; cursor: pointer; }
.actions { display: flex; gap: 8px; }
.btn { padding: 8px 16px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.guide-box { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 12px 16px; font-size: 13px; }
.guide-box p { margin: 4px 0; line-height: 1.6; }
</style>
