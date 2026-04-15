<template>
  <ToolLayout title="人民币大写转换">
    <div class="tool-wrap">
      <div class="input-section">
        <div class="input-row">
          <input v-model="inputNum" class="num-input" type="number" placeholder="输入金额，如 12345.67" @input="convert" />
          <button class="btn btn-outline" @click="copy" v-if="result">复制</button>
        </div>
        <div v-if="result" class="result-card">
          <div class="result-label">人民币大写：</div>
          <div class="result-text">{{ result }}</div>
        </div>
        <div class="examples">
          <div class="examples-label">快速测试：</div>
          <button v-for="n in examples" :key="n" class="example-btn" @click="inputNum = n; convert()">{{ n }}</button>
        </div>
      </div>
      <div class="guide-box">
        <h3>使用场景</h3>
        <p>人民币大写常用于银行票据、合同、财务报表等正式场合，防止金额被篡改。</p>
        <p>格式示例：壹万贰仟叁佰肆拾伍元陆角柒分</p>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const inputNum = ref(''), result = ref('')
const examples = ['0', '1', '100', '1234.56', '10000', '99999.99', '1000000']
const CN = ['零','壹','贰','叁','肆','伍','陆','柒','捌','玖']
const UNIT = ['','拾','佰','仟']
const GROUP = ['','万','亿','万亿']
const DEC = ['角','分']
function numToCn(n) {
  if (n === 0 || n === '0') return '零元整'
  const negative = n < 0
  n = Math.abs(parseFloat(n))
  if (isNaN(n)) return '请输入有效数字'
  const parts = n.toFixed(2).split('.')
  let intPart = parts[0], decPart = parts[1] || '00'
  let result = ''
  const groups = []
  let p = intPart
  while (p.length > 0) { groups.unshift(p.slice(-4)); p = p.slice(0, -4) }
  groups.forEach((g, gi) => {
    let gStr = ''
    for (let i = 0; i < g.length; i++) {
      const d = +g[i], u = g.length - 1 - i
      if (d === 0) { if (gStr && gStr.slice(-1) !== '零') gStr += '零' }
      else gStr += CN[d] + UNIT[u]
    }
    gStr = gStr.replace(/零+$/, '')
    if (gStr) result += gStr + GROUP[groups.length - 1 - gi]
  })
  result = result || '零'
  result += '元'
  if (decPart === '00') { result += '整' }
  else {
    if (decPart[0] !== '0') result += CN[+decPart[0]] + '角'
    else if (decPart[1] !== '0') result += '零'
    if (decPart[1] !== '0') result += CN[+decPart[1]] + '分'
  }
  return (negative ? '负' : '') + result
}
function convert() { result.value = inputNum.value !== '' ? numToCn(inputNum.value) : '' }
function copy() { navigator.clipboard.writeText(result.value).then(() => alert('✅ 已复制')) }
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 16px; }
.input-section { display: flex; flex-direction: column; gap: 12px; }
.input-row { display: flex; gap: 8px; align-items: center; }
.num-input { flex: 1; padding: 12px 16px; border: 2px solid #d0d7de; border-radius: 8px; font-size: 18px; max-width: 400px; }
.num-input:focus { border-color: #0969da; outline: none; }
.btn-outline { padding: 8px 16px; background: white; color: #333; border: 1px solid #d0d7de; border-radius: 6px; cursor: pointer; font-size: 13px; white-space: nowrap; }
.result-card { background: #dafbe1; border: 1px solid #1a7f37; border-radius: 10px; padding: 16px 20px; max-width: 500px; }
.result-label { font-size: 12px; font-weight: 600; color: #1a7f37; margin-bottom: 6px; }
.result-text { font-size: 20px; font-weight: 700; color: #1a7f37; line-height: 1.4; }
.examples { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.examples-label { font-size: 13px; color: #666; }
.example-btn { padding: 4px 12px; background: #f0f6ff; color: #0969da; border: 1px solid #c8e0ff; border-radius: 6px; cursor: pointer; font-size: 13px; }
.example-btn:hover { background: #0969da; color: white; }
.guide-box { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 14px 16px; font-size: 13px; }
.guide-box h3 { margin: 0 0 8px; font-size: 14px; }
.guide-box p { margin: 4px 0; line-height: 1.6; }
</style>
