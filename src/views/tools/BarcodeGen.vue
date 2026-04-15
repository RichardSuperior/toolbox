<template>
  <ToolLayout title="条形码生成器">
    <div class="tool-wrap">
      <div class="form-row">
        <input v-model="text" class="text-input" placeholder="输入条形码内容（数字或文字）..." maxlength="100" />
        <select v-model="format" class="select">
          <option value="CODE128">CODE128</option>
          <option value="EAN13">EAN-13</option>
          <option value="CODE39">CODE39</option>
          <option value="ITF14">ITF-14</option>
        </select>
        <button class="btn" @click="generate">生成</button>
      </div>
      <div class="options-row">
        <label>宽度: <input type="range" v-model.number="width" min="1" max="4" step="0.5" /> {{ width }}x</label>
        <label>高度: <input type="range" v-model.number="height" min="40" max="150" step="10" /> {{ height }}px</label>
        <label>颜色: <input type="color" v-model="lineColor" /></label>
      </div>
      <div v-if="showCode" class="barcode-wrap">
        <svg id="barcode-svg"></svg>
      </div>
      <div v-if="showCode" class="actions">
        <button class="btn btn-outline" @click="download">下载 SVG</button>
      </div>
      <div v-if="!barcodeLib" class="tip-box">正在加载条形码库，请稍候...</div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const text = ref('1234567890'), format = ref('CODE128'), width = ref(2), height = ref(80), lineColor = ref('#000000')
const showCode = ref(false), barcodeLib = ref(false)

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js'
  script.onload = () => { barcodeLib.value = true }
  document.head.appendChild(script)
})

function generate() {
  if (!barcodeLib.value) { alert('条形码库尚未加载完成，请稍候'); return }
  if (!text.value.trim()) { alert('请输入内容'); return }
  try {
    showCode.value = true
    setTimeout(() => {
      window.JsBarcode('#barcode-svg', text.value, {
        format: format.value,
        width: width.value,
        height: height.value,
        lineColor: lineColor.value,
        displayValue: true,
        margin: 10
      })
    }, 50)
  } catch(e) { alert('生成失败: ' + e.message) }
}

function download() {
  const svg = document.getElementById('barcode-svg')
  if (!svg) return
  const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'barcode.svg'; a.click()
}
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 12px; }
.form-row { display: flex; gap: 8px; flex-wrap: wrap; }
.text-input { flex: 1; min-width: 200px; padding: 8px 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 14px; }
.select { padding: 8px 10px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 13px; }
.btn { padding: 8px 16px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.options-row { display: flex; gap: 20px; flex-wrap: wrap; font-size: 13px; align-items: center; }
.options-row label { display: flex; align-items: center; gap: 6px; }
.barcode-wrap { display: flex; justify-content: center; background: white; border: 1px solid #d0d7de; border-radius: 8px; padding: 20px; }
.actions { display: flex; gap: 8px; }
.tip-box { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 6px; padding: 12px; font-size: 13px; color: #666; }
</style>
