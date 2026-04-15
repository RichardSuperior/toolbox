<template>
  <ToolLayout title="在线调色板">
    <div class="palette">
      <div class="color-bar">
        <div class="preview" :style="{ background: currentColor }">
          <span class="hex-text">{{ currentColor }}</span>
        </div>
      </div>
      <div class="palette-grid">
        <div class="color-swatch" v-for="c in colors" :key="c" :style="{ background: c }" @click="copy(c)" :title="c"></div>
      </div>
      <div class="presets">
        <h3>预设色板</h3>
        <div class="preset-row" v-for="p in presets" :key="p.name">
          <span class="preset-name">{{ p.name }}</span>
          <div class="preset-colors">
            <div class="swatch" v-for="c in p.colors" :key="c" :style="{ background: c }" @click="copy(c)"></div>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const currentColor = ref('#0969da')
const colors = ['#FF6B6B','#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7','#DDA0DD','#98D8C8','#F7DC6F','#BB8FCE','#85C1E9','#F8B500','#E74C3C','#27AE60','#3498DB','#9B59B6','#1ABC9C','#E67E22','#2C3E50','#34495E']
const presets = [
  { name: '扁平化配色', colors: ['#3498DB','#E74C3C','#2ECC71','#F39C12','#9B59B6','#1ABC9C'] },
  { name: 'Material Design', colors: ['#F44336','#E91E63','#9C27B0','#673AB7','#3F51B5','#2196F3'] },
  { name: '渐变风', colors: ['#667EEA','#764BA2','#F093FB','#F5576C','#4FACFE','#00F2FE'] },
  { name: '暖色调', colors: ['#FF416C','#FF4B2B','#F7971E','#FFD200','#FF6B6B','#EE0979'] },
  { name: '冷色调', colors: ['#00C9FF','#92FE9D','#3C3B3F','#605C3C','#FC466B','#3F5EFB'] },
  { name: '莫兰迪', colors: ['#A8D8EA','#AA96DA','#FCBAD3','#FFFFD2','#E8D5B7','#B8B8B8'] },
]
function copy(c) { currentColor.value = c; navigator.clipboard.writeText(c).then(() => alert('已复制: ' + c)) }
</script>

<style scoped>
.palette { display: flex; flex-direction: column; gap: 20px; }
.preview { width: 100%; height: 100px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.hex-text { font-size: 20px; font-weight: 700; color: white; text-shadow: 0 1px 3px rgba(0,0,0,0.3); }
.palette-grid { display: flex; flex-wrap: wrap; gap: 6px; }
.color-swatch { width: 40px; height: 40px; border-radius: 6px; cursor: pointer; transition: transform 0.2s; }
.color-swatch:hover { transform: scale(1.15); }
.presets { display: flex; flex-direction: column; gap: 12px; }
.presets h3 { font-size: 15px; font-weight: 600; }
.preset-row { display: flex; gap: 12px; align-items: center; background: #f6f8fa; border-radius: 8px; padding: 10px 14px; }
.preset-name { font-size: 13px; font-weight: 600; min-width: 100px; }
.preset-colors { display: flex; gap: 4px; flex-wrap: wrap; }
.swatch { width: 32px; height: 32px; border-radius: 4px; cursor: pointer; }
</style>
