<template>
  <ToolLayout title="世界货币信息">
    <div class="tool-wrap">
      <div class="search-bar">
        <input v-model="keyword" class="search-input" placeholder="搜索货币名称、代码或国家..." />
        <span class="count">{{ filtered.length }} 种货币</span>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>货币代码</th><th>货币名称</th><th>符号</th><th>使用国家/地区</th></tr></thead>
          <tbody>
            <tr v-for="c in filtered" :key="c.code" @click="copy(c.code)">
              <td><strong>{{ c.code }}</strong></td>
              <td>{{ c.name }}</td>
              <td class="symbol">{{ c.symbol }}</td>
              <td>{{ c.country }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const keyword = ref('')
const currencies = [
  { code: 'CNY', name: '人民币', symbol: '¥', country: '中国' },
  { code: 'USD', name: '美元', symbol: '$', country: '美国' },
  { code: 'EUR', name: '欧元', symbol: '€', country: '欧元区' },
  { code: 'GBP', name: '英镑', symbol: '£', country: '英国' },
  { code: 'JPY', name: '日元', symbol: '¥', country: '日本' },
  { code: 'KRW', name: '韩元', symbol: '₩', country: '韩国' },
  { code: 'AUD', name: '澳元', symbol: 'A$', country: '澳大利亚' },
  { code: 'CAD', name: '加拿大元', symbol: 'C$', country: '加拿大' },
  { code: 'CHF', name: '瑞士法郎', symbol: 'Fr', country: '瑞士' },
  { code: 'HKD', name: '港币', symbol: 'HK$', country: '香港' },
  { code: 'TWD', name: '新台币', symbol: 'NT$', country: '台湾' },
  { code: 'SGD', name: '新加坡元', symbol: 'S$', country: '新加坡' },
  { code: 'INR', name: '印度卢比', symbol: '₹', country: '印度' },
  { code: 'RUB', name: '俄罗斯卢布', symbol: '₽', country: '俄罗斯' },
  { code: 'BRL', name: '巴西雷亚尔', symbol: 'R$', country: '巴西' },
  { code: 'MXN', name: '墨西哥比索', symbol: '$', country: '墨西哥' },
  { code: 'SAR', name: '沙特里亚尔', symbol: '﷼', country: '沙特阿拉伯' },
  { code: 'AED', name: '阿联酋迪拉姆', symbol: 'د.إ', country: '阿联酋' },
  { code: 'TRY', name: '土耳其里拉', symbol: '₺', country: '土耳其' },
  { code: 'IDR', name: '印尼盾', symbol: 'Rp', country: '印度尼西亚' },
  { code: 'MYR', name: '马来西亚林吉特', symbol: 'RM', country: '马来西亚' },
  { code: 'THB', name: '泰铢', symbol: '฿', country: '泰国' },
  { code: 'VND', name: '越南盾', symbol: '₫', country: '越南' },
  { code: 'PHP', name: '菲律宾比索', symbol: '₱', country: '菲律宾' },
  { code: 'NZD', name: '新西兰元', symbol: 'NZ$', country: '新西兰' },
  { code: 'ZAR', name: '南非兰特', symbol: 'R', country: '南非' },
  { code: 'NOK', name: '挪威克朗', symbol: 'kr', country: '挪威' },
  { code: 'SEK', name: '瑞典克朗', symbol: 'kr', country: '瑞典' },
  { code: 'DKK', name: '丹麦克朗', symbol: 'kr', country: '丹麦' },
  { code: 'PLN', name: '波兰兹罗提', symbol: 'zł', country: '波兰' },
  { code: 'CZK', name: '捷克克朗', symbol: 'Kč', country: '捷克' },
  { code: 'HUF', name: '匈牙利福林', symbol: 'Ft', country: '匈牙利' },
  { code: 'EGP', name: '埃及镑', symbol: '£', country: '埃及' },
  { code: 'PKR', name: '巴基斯坦卢比', symbol: '₨', country: '巴基斯坦' },
  { code: 'BTC', name: '比特币', symbol: '₿', country: '去中心化' },
  { code: 'ETH', name: '以太坊', symbol: 'Ξ', country: '去中心化' },
]
const filtered = computed(() => {
  const k = keyword.value.toLowerCase()
  return k ? currencies.filter(c => c.code.toLowerCase().includes(k) || c.name.includes(k) || c.country.includes(k) || c.symbol.includes(k)) : currencies
})
function copy(code) { navigator.clipboard.writeText(code).then(() => alert(`✅ 已复制 ${code}`)) }
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 12px; }
.search-bar { display: flex; align-items: center; gap: 12px; }
.search-input { flex: 1; padding: 8px 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 14px; }
.count { font-size: 13px; color: #666; white-space: nowrap; }
.table-wrap { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th, .data-table td { padding: 8px 12px; border: 1px solid #d0d7de; text-align: left; }
.data-table th { background: #f6f8fa; font-weight: 600; }
.data-table tr:hover { background: #f0f6ff; cursor: pointer; }
.symbol { font-size: 16px; font-weight: bold; }
</style>
