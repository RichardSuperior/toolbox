<template>
  <ToolLayout title="科学计算器">
    <div class="calc">
      <div class="display">
        <div class="expr">{{ expr }}</div>
        <div class="result">{{ result }}</div>
      </div>
      <div class="keypad">
        <div class="row" v-for="(row, i) in keys" :key="i">
          <button v-for="key in row" :key="key.label" class="key" :class="key.type || ''" @click="onKey(key)">{{ key.label }}</button>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const expr = ref(''), result = ref('0')

const keys = [
  [{ label: 'sin', type: 'func' }, { label: 'cos', type: 'func' }, { label: 'tan', type: 'func' }, { label: '√', type: 'func' }],
  [{ label: 'π', type: 'const' }, { label: 'e', type: 'const' }, { label: '^', type: 'op' }, { label: '÷', type: 'op' }],
  [{ label: '7' }, { label: '8' }, { label: '9' }, { label: '×', type: 'op' }],
  [{ label: '4' }, { label: '5' }, { label: '6' }, { label: '-', type: 'op' }],
  [{ label: '1' }, { label: '2' }, { label: '3' }, { label: '+', type: 'op' }],
  [{ label: 'C', type: 'clear' }, { label: '0' }, { label: '.', type: 'dot' }, { label: '=', type: 'enter' }],
]

function onKey(key) {
  const v = key.label
  if (v === 'C') { expr.value = ''; result.value = '0'; return }
  if (v === '=') { try { result.value = evaluate(expr.value) } catch { result.value = 'Error' }; return }
  if (key.type === 'func') {
    const fn = { sin: 'Math.sin', cos: 'Math.cos', tan: 'Math.tan', '√': 'Math.sqrt' }[v]
    expr.value += fn + '('
  } else if (key.type === 'const') {
    expr.value += v === 'π' ? 'Math.PI' : 'Math.E'
  } else if (key.type === 'op') {
    expr.value += { '×': '*', '÷': '/', '√': 'Math.sqrt(' }[v] || v
  } else {
    expr.value += v
  }
}

function evaluate(expr) {
  const str = expr.replace(/\^/g, '**').replace(/Math\.sqrt\(([^)]+)\)/g, 'Math.sqrt($1)')
  return Function('"use strict"; return (' + str + ')')()
}
</script>

<style scoped>
.calc { max-width: 360px; margin: 0 auto; }
.display { background: #1e1e1e; border-radius: 12px; padding: 16px; margin-bottom: 12px; text-align: right; }
.expr { color: #888; font-size: 14px; min-height: 20px; word-break: break-all; }
.result { color: white; font-size: 28px; font-weight: 300; }
.keypad { display: flex; flex-direction: column; gap: 4px; }
.row { display: flex; gap: 4px; }
.key { flex: 1; padding: 14px; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; background: #2d2d2d; color: white; transition: all 0.15s; }
.key:hover { background: #3d3d3d; }
.key.op, .key.enter { background: #0969da; }
.key.enter { background: #0a3; }
.key.func { background: #555; font-size: 13px; }
.key.clear { background: #c0392b; }
</style>
