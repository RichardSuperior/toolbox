<template>
  <ToolLayout title="RGB 颜色转换">
    <div class="rgb-color">
      <div class="controls">
        <div class="color-preview" :style="{ background: previewColor }"></div>
        <div class="sliders">
          <div class="slider-row"><label>R <span class="val">{{ r }}</span></label><input type="range" min="0" max="255" v-model.number="r" /></div>
          <div class="slider-row"><label>G <span class="val">{{ g }}</span></label><input type="range" min="0" max="255" v-model.number="g" /></div>
          <div class="slider-row"><label>B <span class="val">{{ b }}</span></label><input type="range" min="0" max="255" v-model.number="b" /></div>
        </div>
        <div class="hex-input"><input v-model="hexInput" @change="hexToRgb" placeholder="#0969DA" class="text-input" /></div>
      </div>
      <div class="outputs">
        <div class="out-row" @click="copy('HEX')">HEX: <span class="mono">{{ hexColor }}</span> <span class="copy-hint">点击复制</span></div>
        <div class="out-row" @click="copy('RGB')">RGB: <span class="mono">rgb({{ r }}, {{ g }}, {{ b }})</span> <span class="copy-hint">点击复制</span></div>
        <div class="out-row" @click="copy('HSL')">HSL: <span class="mono">{{ hslStr }}</span> <span class="copy-hint">点击复制</span></div>
        <div class="out-row" @click="copy('CSS')">CSS: <span class="mono">#{{ hexColor }}</span> <span class="copy-hint">点击复制</span></div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const r = ref(9), g = ref(105), b = ref(218)
const hexInput = ref('')
const hexColor = computed(() => r.value.toString(16).padStart(2,'0') + g.value.toString(16).padStart(2,'0') + b.value.toString(16).padStart(2,'0'))
const previewColor = computed(() => `#${hexColor.value}`)
const hslStr = computed(() => {
  const r1 = r.value / 255, g1 = g.value / 255, b1 = b.value / 255
  const max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1)
  let h, s, l = (max + min) / 2
  if (max === min) { h = s = 0 } else { const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min); switch(max){ case r1: h = ((g1-b1)/d+(g1<b1?6:0))/6; break; case g1: h = ((b1-r1)/d+2)/6; break; case b1: h = ((r1-g1)/d+4)/6; break } }
  return `hsl(${Math.round(h*360)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`
})
function hexToRgb() {
  const hex = hexInput.value.replace('#', '')
  if (hex.length === 6) { r.value = parseInt(hex.slice(0,2), 16); g.value = parseInt(hex.slice(2,4), 16); b.value = parseInt(hex.slice(4,6), 16) }
}
function copy(type) { navigator.clipboard.writeText(type === 'HEX' ? '#'+hexColor.value : type === 'RGB' ? `rgb(${r.value}, ${g.value}, ${b.value})` : type === 'HSL' ? hslStr.value : '#'+hexColor.value).then(() => alert('已复制')) }
</script>

<style scoped>
.rgb-color { display: flex; flex-direction: column; gap: 16px; max-width: 500px; }
.controls { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
.color-preview { width: 120px; height: 120px; border-radius: 16px; border: 2px solid #d0d7de; transition: background 0.2s; }
.sliders { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.slider-row { display: flex; flex-direction: column; gap: 2px; }
.slider-row label { font-size: 13px; color: #666; display: flex; justify-content: space-between; }
.val { font-weight: 600; color: #333; }
input[type=range] { width: 100%; accent-color: #0969da; }
.hex-input { width: 100%; }
.text-input { width: 100%; padding: 8px 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 14px; font-family: 'Fira Code', monospace; box-sizing: border-box; }
.outputs { display: flex; flex-direction: column; gap: 4px; }
.out-row { padding: 10px 14px; background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 6px; font-size: 14px; cursor: pointer; transition: all 0.2s; display: flex; gap: 8px; align-items: center; }
.out-row:hover { background: #eaeef2; }
.mono { font-family: 'Fira Code', monospace; color: #0969da; }
.copy-hint { font-size: 11px; color: #999; margin-left: auto; }
</style>
