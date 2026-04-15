<template>
  <ToolLayout title="在线画板">
    <div class="tool-wrap">
      <div class="toolbar">
        <label>颜色: <input type="color" v-model="color" /></label>
        <label>粗细: <input type="range" v-model.number="lineWidth" min="1" max="30" /> {{ lineWidth }}px</label>
        <button class="btn" @click="mode = 'draw'" :class="{ active: mode === 'draw' }">✏️ 画笔</button>
        <button class="btn" @click="mode = 'erase'" :class="{ active: mode === 'erase' }">🧹 橡皮</button>
        <button class="btn btn-outline" @click="clearCanvas">清空</button>
        <button class="btn btn-outline" @click="saveImage">💾 保存</button>
      </div>
      <canvas ref="canvas" class="draw-canvas"
        @mousedown="startDraw" @mousemove="draw" @mouseup="stopDraw" @mouseleave="stopDraw"
        @touchstart.prevent="startDrawTouch" @touchmove.prevent="drawTouch" @touchend="stopDraw"
      ></canvas>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const canvas = ref(null), color = ref('#000000'), lineWidth = ref(3), mode = ref('draw')
let ctx = null, painting = false, lastX = 0, lastY = 0

onMounted(() => {
  const c = canvas.value
  c.width = c.offsetWidth || 800
  c.height = 500
  ctx = c.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, c.width, c.height)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
})

function getPos(e) {
  const rect = canvas.value.getBoundingClientRect()
  return { x: e.clientX - rect.left, y: e.clientY - rect.top }
}
function startDraw(e) {
  painting = true
  const { x, y } = getPos(e)
  lastX = x; lastY = y
}
function draw(e) {
  if (!painting) return
  const { x, y } = getPos(e)
  ctx.strokeStyle = mode.value === 'erase' ? '#ffffff' : color.value
  ctx.lineWidth = mode.value === 'erase' ? lineWidth.value * 5 : lineWidth.value
  ctx.beginPath()
  ctx.moveTo(lastX, lastY)
  ctx.lineTo(x, y)
  ctx.stroke()
  lastX = x; lastY = y
}
function stopDraw() { painting = false }
function startDrawTouch(e) {
  const t = e.touches[0]
  const rect = canvas.value.getBoundingClientRect()
  lastX = t.clientX - rect.left; lastY = t.clientY - rect.top
  painting = true
}
function drawTouch(e) {
  if (!painting) return
  const t = e.touches[0]
  const rect = canvas.value.getBoundingClientRect()
  const x = t.clientX - rect.left, y = t.clientY - rect.top
  ctx.strokeStyle = mode.value === 'erase' ? '#ffffff' : color.value
  ctx.lineWidth = lineWidth.value
  ctx.beginPath(); ctx.moveTo(lastX, lastY); ctx.lineTo(x, y); ctx.stroke()
  lastX = x; lastY = y
}
function clearCanvas() {
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)
}
function saveImage() {
  const a = document.createElement('a')
  a.download = 'drawing.png'
  a.href = canvas.value.toDataURL('image/png')
  a.click()
}
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 10px; }
.toolbar { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; font-size: 13px; }
.toolbar label { display: flex; align-items: center; gap: 6px; }
.btn { padding: 6px 12px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn.active { background: #9a3bcf; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.draw-canvas { width: 100%; height: 500px; border: 2px solid #d0d7de; border-radius: 8px; cursor: crosshair; background: white; touch-action: none; }
</style>
