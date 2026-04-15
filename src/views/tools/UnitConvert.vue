<template>
  <ToolLayout title="单位换算" subtitle="长度、重量、温度、数据大小等常用单位换算" icon="📐">
    <div class="card p-6 mb-4">
      <!-- 分类选择 -->
      <div class="flex flex-wrap gap-2 mb-6">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="activeCategory = cat.id; inputValue = ''; activeUnit = cat.units[0].key"
          :class="activeCategory === cat.id ? 'btn-primary' : 'btn-secondary'"
          class="text-sm"
        >{{ cat.icon }} {{ cat.name }}</button>
      </div>

      <!-- 换算表 -->
      <div v-if="currentCategory">
        <div class="mb-5">
          <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">输入数值</label>
          <div class="flex gap-3">
            <input
              v-model="inputValue"
              type="number"
              class="input-base flex-1 font-mono text-lg"
              :placeholder="`输入 ${currentUnit?.name} 值...`"
              @input="convert"
            />
            <select v-model="activeUnit" @change="convert" class="input-base py-2 text-sm">
              <option v-for="u in currentCategory.units" :key="u.key" :value="u.key">{{ u.name }}</option>
            </select>
          </div>
        </div>

        <!-- 结果 -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div
            v-for="unit in currentCategory.units"
            :key="unit.key"
            class="p-4 bg-[var(--bg-secondary)] border rounded-xl cursor-pointer transition-colors"
            :class="unit.key === activeUnit ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/10' : 'border-[var(--border-color)] hover:border-primary-300'"
            @click="switchUnit(unit.key)"
          >
            <div class="text-xs text-[var(--text-secondary)] mb-1">{{ unit.name }}</div>
            <div class="font-mono text-base font-semibold text-[var(--text-primary)] truncate">
              {{ results[unit.key] !== undefined ? formatNum(results[unit.key]) : '—' }}
            </div>
            <div class="text-xs text-[var(--text-secondary)] mt-0.5">{{ unit.symbol }}</div>
          </div>
        </div>
      </div>
    </div>

    <template #knowledge>
      <div class="text-sm text-[var(--text-secondary)] space-y-2">
        <p><strong>数据大小</strong>：1 GB = 1024 MB（二进制，计算机内存/硬盘实际计算方式）。</p>
        <p><strong>温度</strong>：摄氏度 °C 与华氏度 °F 的转换公式 <code class="bg-[var(--bg-secondary)] px-1 rounded">°F = °C × 9/5 + 32</code>。</p>
        <p><strong>英尺与厘米</strong>：1 英尺 = 30.48 厘米，1 英寸 = 2.54 厘米。</p>
        <p><strong>海里</strong>：1 海里 = 1852 米，是航海和航空中的标准距离单位。</p>
      </div>
    </template>
  </ToolLayout>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const activeCategory = ref('length')
const inputValue = ref('')
const activeUnit = ref('m')
const results = reactive({})

const categories = [
  {
    id: 'length',
    name: '长度',
    icon: '📏',
    baseUnit: 'm',
    units: [
      { key: 'km', name: '千米', symbol: 'km', toBase: 1000 },
      { key: 'm', name: '米', symbol: 'm', toBase: 1 },
      { key: 'cm', name: '厘米', symbol: 'cm', toBase: 0.01 },
      { key: 'mm', name: '毫米', symbol: 'mm', toBase: 0.001 },
      { key: 'um', name: '微米', symbol: 'μm', toBase: 1e-6 },
      { key: 'nm', name: '纳米', symbol: 'nm', toBase: 1e-9 },
      { key: 'inch', name: '英寸', symbol: 'in', toBase: 0.0254 },
      { key: 'ft', name: '英尺', symbol: 'ft', toBase: 0.3048 },
      { key: 'yard', name: '码', symbol: 'yd', toBase: 0.9144 },
      { key: 'mile', name: '英里', symbol: 'mi', toBase: 1609.344 },
      { key: 'nmi', name: '海里', symbol: 'nmi', toBase: 1852 },
      { key: 'ly', name: '光年', symbol: 'ly', toBase: 9.461e15 },
    ]
  },
  {
    id: 'weight',
    name: '重量',
    icon: '⚖️',
    baseUnit: 'kg',
    units: [
      { key: 't', name: '吨', symbol: 't', toBase: 1000 },
      { key: 'kg', name: '千克', symbol: 'kg', toBase: 1 },
      { key: 'g', name: '克', symbol: 'g', toBase: 0.001 },
      { key: 'mg', name: '毫克', symbol: 'mg', toBase: 1e-6 },
      { key: 'jin', name: '斤（市斤）', symbol: '斤', toBase: 0.5 },
      { key: 'liang', name: '两（市两）', symbol: '两', toBase: 0.05 },
      { key: 'lb', name: '磅', symbol: 'lb', toBase: 0.453592 },
      { key: 'oz', name: '盎司', symbol: 'oz', toBase: 0.0283495 },
    ]
  },
  {
    id: 'temperature',
    name: '温度',
    icon: '🌡️',
    isSpecial: true,
    baseUnit: 'c',
    units: [
      { key: 'c', name: '摄氏度', symbol: '°C' },
      { key: 'f', name: '华氏度', symbol: '°F' },
      { key: 'k', name: '开尔文', symbol: 'K' },
    ]
  },
  {
    id: 'data',
    name: '数据',
    icon: '💾',
    baseUnit: 'b',
    units: [
      { key: 'b', name: '比特', symbol: 'b', toBase: 1 },
      { key: 'B', name: '字节', symbol: 'B', toBase: 8 },
      { key: 'KB', name: '千字节', symbol: 'KB', toBase: 8 * 1024 },
      { key: 'MB', name: '兆字节', symbol: 'MB', toBase: 8 * 1024 ** 2 },
      { key: 'GB', name: '吉字节', symbol: 'GB', toBase: 8 * 1024 ** 3 },
      { key: 'TB', name: '太字节', symbol: 'TB', toBase: 8 * 1024 ** 4 },
      { key: 'PB', name: '拍字节', symbol: 'PB', toBase: 8 * 1024 ** 5 },
    ]
  },
  {
    id: 'area',
    name: '面积',
    icon: '🗺️',
    baseUnit: 'm2',
    units: [
      { key: 'km2', name: '平方千米', symbol: 'km²', toBase: 1e6 },
      { key: 'm2', name: '平方米', symbol: 'm²', toBase: 1 },
      { key: 'cm2', name: '平方厘米', symbol: 'cm²', toBase: 1e-4 },
      { key: 'mm2', name: '平方毫米', symbol: 'mm²', toBase: 1e-6 },
      { key: 'mu', name: '亩', symbol: '亩', toBase: 666.667 },
      { key: 'ha', name: '公顷', symbol: 'ha', toBase: 10000 },
      { key: 'acre', name: '英亩', symbol: 'acre', toBase: 4046.856 },
      { key: 'ft2', name: '平方英尺', symbol: 'ft²', toBase: 0.092903 },
    ]
  },
  {
    id: 'speed',
    name: '速度',
    icon: '💨',
    baseUnit: 'ms',
    units: [
      { key: 'ms', name: '米/秒', symbol: 'm/s', toBase: 1 },
      { key: 'kmh', name: '千米/时', symbol: 'km/h', toBase: 1/3.6 },
      { key: 'mph', name: '英里/时', symbol: 'mph', toBase: 0.44704 },
      { key: 'knot', name: '节', symbol: 'kn', toBase: 0.514444 },
      { key: 'mach', name: '马赫', symbol: 'Ma', toBase: 340.29 },
    ]
  },
]

const currentCategory = computed(() => categories.find(c => c.id === activeCategory.value))
const currentUnit = computed(() => currentCategory.value?.units.find(u => u.key === activeUnit.value))

function formatNum(n) {
  if (n === '' || n === undefined || n === null) return ''
  const abs = Math.abs(n)
  if (abs === 0) return '0'
  if (abs >= 1e9 || (abs < 1e-6 && abs > 0)) return n.toExponential(4)
  if (abs >= 1000) return Number(n.toPrecision(7)).toLocaleString('zh-CN')
  return Number(n.toPrecision(7)).toString()
}

function convert() {
  const val = parseFloat(inputValue.value)
  const cat = currentCategory.value
  if (isNaN(val) || !cat) { Object.keys(results).forEach(k => delete results[k]); return }

  if (cat.isSpecial && cat.id === 'temperature') {
    // 温度特殊处理
    let celsius = val
    if (activeUnit.value === 'f') celsius = (val - 32) * 5 / 9
    else if (activeUnit.value === 'k') celsius = val - 273.15
    results['c'] = celsius
    results['f'] = celsius * 9 / 5 + 32
    results['k'] = celsius + 273.15
    return
  }

  const fromUnit = cat.units.find(u => u.key === activeUnit.value)
  if (!fromUnit) return
  const baseVal = val * fromUnit.toBase
  cat.units.forEach(u => {
    results[u.key] = baseVal / u.toBase
  })
}

function switchUnit(key) {
  if (results[key] !== undefined) {
    inputValue.value = results[key]
    activeUnit.value = key
    convert()
  }
}
</script>
