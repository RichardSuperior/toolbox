<template>
  <ToolLayout title="rem 与 px 转换">
    <div class="rem-px">
      <div class="row"><label>基准字体大小（px）</label><input v-model.number="base" type="number" class="num-input" placeholder="默认16" /></div>
      <div class="grid">
        <div class="col">
          <div class="label">px → rem</div>
          <div class="row"><input v-model.number="px" class="num-input" placeholder="16" /><button class="btn" @click="pxToRem">转换</button></div>
          <div class="result">{{ pxResult }}</div>
        </div>
        <div class="col">
          <div class="label">rem → px</div>
          <div class="row"><input v-model.number="rem" class="num-input" placeholder="1" /><button class="btn" @click="remToPx">转换</button></div>
          <div class="result">{{ remResult }}</div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const base = ref(16), px = ref(16), rem = ref(1)
const pxResult = ref(''), remResult = ref('')
function pxToRem() { pxResult.value = `${(px.value / base.value).toFixed(4)} rem` }
function remToPx() { remResult.value = `${rem.value * base.value} px` }
</script>

<style scoped>
.rem-px { display: flex; flex-direction: column; gap: 16px; max-width: 600px; }
.row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.row label { font-weight: 600; font-size: 14px; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.col { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 16px; display: flex; flex-direction: column; gap: 8px; }
.label { font-weight: 600; font-size: 14px; }
.num-input { padding: 8px 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 14px; flex: 1; }
.btn { padding: 8px 16px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
.result { font-size: 20px; font-weight: 700; font-family: 'Fira Code', monospace; color: #0969da; }
@media (max-width: 500px) { .grid { grid-template-columns: 1fr; } }
</style>
