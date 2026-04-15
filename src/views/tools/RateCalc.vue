<template>
  <ToolLayout title="利率计算器">
    <div class="rate-calc">
      <div class="calc-form">
        <div class="form-row">
          <label>存款金额（元）</label>
          <input v-model.number="principal" type="number" class="num-input" placeholder="请输入金额" />
        </div>
        <div class="form-row">
          <label>年利率（%）</label>
          <input v-model.number="rate" type="number" step="0.01" class="num-input" placeholder="如：4.5" />
        </div>
        <div class="form-row">
          <label>存款期限</label>
          <div class="flex-row">
            <input v-model.number="years" type="number" class="num-input small" placeholder="年数" />
            <span>年</span>
            <input v-model.number="months" type="number" class="num-input small" placeholder="月数" />
            <span>月</span>
          </div>
        </div>
        <div class="form-row">
          <label>存款类型</label>
          <select v-model="type" class="sel-input">
            <option value="demand">活期存款</option>
            <option value="term3">3个月定期</option>
            <option value="term6">6个月定期</option>
            <option value="term1">1年定期</option>
            <option value="term2">2年定期</option>
            <option value="term3y">3年定期</option>
            <option value="term5">5年定期</option>
          </select>
        </div>
        <div class="form-row">
          <label>利息计算方式</label>
          <select v-model="compound" class="sel-input">
            <option :value="false">单利</option>
            <option :value="true">复利</option>
          </select>
        </div>
        <button class="btn" @click="calculate">计算</button>
      </div>
      <div v-if="result" class="result-box">
        <div class="result-title">💰 计算结果</div>
        <div class="result-row"><span>存款本金</span><span>¥{{ result.principal.toLocaleString() }}</span></div>
        <div class="result-row"><span>到期利息</span><span class="highlight">¥{{ result.interest.toLocaleString() }}</span></div>
        <div class="result-row"><span>本息合计</span><span class="highlight">¥{{ result.total.toLocaleString() }}</span></div>
        <div class="result-row"><span>年利率（实际）</span><span>{{ result.effectiveRate }}%</span></div>
        <div class="result-row"><span>利息金额（每年）</span><span>¥{{ (result.interest / (result.years + result.months / 12)).toFixed(2) }}</span></div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const principal = ref(100000)
const rate = ref(2.1)
const years = ref(1)
const months = ref(0)
const type = ref('term1')
const compound = ref(false)
const result = ref(null)

const rateMultipliers = { demand: 0.35, term3: 1.35, term6: 1.55, term1: 1.75, term2: 2.25, term3y: 2.75, term5: 2.75 }

function calculate() {
  const p = principal.value, r = rate.value / 100
  const totalMonths = years.value * 12 + months.value.valueOf()
  const t = totalMonths / 12
  let interest
  if (compound.value) {
    interest = p * (Math.pow(1 + r, t) - 1)
  } else {
    interest = p * r * t
  }
  result.value = {
    principal: p, interest: Math.round(interest * 100) / 100,
    total: p + interest, effectiveRate: r * 100 * rateMultipliers[type.value] / 2.1,
    years: years.value, months: months.value,
  }
}
</script>

<style scoped>
.rate-calc { display: flex; flex-direction: column; gap: 16px; max-width: 600px; }
.calc-form { display: flex; flex-direction: column; gap: 12px; }
.form-row { display: flex; flex-direction: column; gap: 4px; }
.form-row label { font-weight: 600; font-size: 14px; color: #24292f; }
.flex-row { display: flex; align-items: center; gap: 8px; }
.num-input, .sel-input { padding: 8px 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 14px; }
.num-input.small { width: 80px; }
.btn { padding: 10px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; }
.result-box { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 16px; display: flex; flex-direction: column; gap: 8px; }
.result-title { font-weight: 600; font-size: 15px; margin-bottom: 4px; }
.result-row { display: flex; justify-content: space-between; font-size: 14px; padding: 6px 0; border-bottom: 1px solid #d0d7de; }
.result-row:last-child { border-bottom: none; }
.highlight { color: #0969da; font-weight: 600; }
</style>
