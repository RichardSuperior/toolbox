<template>
  <ToolLayout title="世界国家区号">
    <div class="tool-wrap">
      <div class="search-bar">
        <input v-model="keyword" class="search-input" placeholder="搜索国家名称或区号..." />
        <span class="count">{{ filtered.length }} 个国家</span>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>国旗</th><th>国家</th><th>区号</th><th>ISO代码</th><th>洲</th></tr></thead>
          <tbody>
            <tr v-for="c in filtered" :key="c.iso" @click="copy(c)">
              <td>{{ c.flag }}</td>
              <td>{{ c.name }}</td>
              <td><strong>{{ c.code }}</strong></td>
              <td><code>{{ c.iso }}</code></td>
              <td>{{ c.continent }}</td>
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
const countries = [
  { flag: '🇨🇳', name: '中国', code: '+86', iso: 'CN', continent: '亚洲' },
  { flag: '🇺🇸', name: '美国', code: '+1', iso: 'US', continent: '北美洲' },
  { flag: '🇬🇧', name: '英国', code: '+44', iso: 'GB', continent: '欧洲' },
  { flag: '🇫🇷', name: '法国', code: '+33', iso: 'FR', continent: '欧洲' },
  { flag: '🇩🇪', name: '德国', code: '+49', iso: 'DE', continent: '欧洲' },
  { flag: '🇯🇵', name: '日本', code: '+81', iso: 'JP', continent: '亚洲' },
  { flag: '🇰🇷', name: '韩国', code: '+82', iso: 'KR', continent: '亚洲' },
  { flag: '🇷🇺', name: '俄罗斯', code: '+7', iso: 'RU', continent: '欧亚' },
  { flag: '🇮🇳', name: '印度', code: '+91', iso: 'IN', continent: '亚洲' },
  { flag: '🇧🇷', name: '巴西', code: '+55', iso: 'BR', continent: '南美洲' },
  { flag: '🇦🇺', name: '澳大利亚', code: '+61', iso: 'AU', continent: '大洋洲' },
  { flag: '🇨🇦', name: '加拿大', code: '+1', iso: 'CA', continent: '北美洲' },
  { flag: '🇮🇹', name: '意大利', code: '+39', iso: 'IT', continent: '欧洲' },
  { flag: '🇪🇸', name: '西班牙', code: '+34', iso: 'ES', continent: '欧洲' },
  { flag: '🇲🇽', name: '墨西哥', code: '+52', iso: 'MX', continent: '北美洲' },
  { flag: '🇸🇦', name: '沙特阿拉伯', code: '+966', iso: 'SA', continent: '亚洲' },
  { flag: '🇹🇷', name: '土耳其', code: '+90', iso: 'TR', continent: '欧亚' },
  { flag: '🇮🇩', name: '印度尼西亚', code: '+62', iso: 'ID', continent: '亚洲' },
  { flag: '🇳🇱', name: '荷兰', code: '+31', iso: 'NL', continent: '欧洲' },
  { flag: '🇨🇭', name: '瑞士', code: '+41', iso: 'CH', continent: '欧洲' },
  { flag: '🇸🇪', name: '瑞典', code: '+46', iso: 'SE', continent: '欧洲' },
  { flag: '🇧🇪', name: '比利时', code: '+32', iso: 'BE', continent: '欧洲' },
  { flag: '🇳🇴', name: '挪威', code: '+47', iso: 'NO', continent: '欧洲' },
  { flag: '🇩🇰', name: '丹麦', code: '+45', iso: 'DK', continent: '欧洲' },
  { flag: '🇫🇮', name: '芬兰', code: '+358', iso: 'FI', continent: '欧洲' },
  { flag: '🇳🇿', name: '新西兰', code: '+64', iso: 'NZ', continent: '大洋洲' },
  { flag: '🇸🇬', name: '新加坡', code: '+65', iso: 'SG', continent: '亚洲' },
  { flag: '🇭🇰', name: '香港', code: '+852', iso: 'HK', continent: '亚洲' },
  { flag: '🇲🇴', name: '澳门', code: '+853', iso: 'MO', continent: '亚洲' },
  { flag: '🇹🇼', name: '台湾', code: '+886', iso: 'TW', continent: '亚洲' },
  { flag: '🇹🇭', name: '泰国', code: '+66', iso: 'TH', continent: '亚洲' },
  { flag: '🇻🇳', name: '越南', code: '+84', iso: 'VN', continent: '亚洲' },
  { flag: '🇲🇾', name: '马来西亚', code: '+60', iso: 'MY', continent: '亚洲' },
  { flag: '🇵🇭', name: '菲律宾', code: '+63', iso: 'PH', continent: '亚洲' },
  { flag: '🇵🇰', name: '巴基斯坦', code: '+92', iso: 'PK', continent: '亚洲' },
  { flag: '🇿🇦', name: '南非', code: '+27', iso: 'ZA', continent: '非洲' },
  { flag: '🇦🇪', name: '阿联酋', code: '+971', iso: 'AE', continent: '亚洲' },
  { flag: '🇶🇦', name: '卡塔尔', code: '+974', iso: 'QA', continent: '亚洲' },
  { flag: '🇬🇷', name: '希腊', code: '+30', iso: 'GR', continent: '欧洲' },
  { flag: '🇵🇹', name: '葡萄牙', code: '+351', iso: 'PT', continent: '欧洲' },
  { flag: '🇵🇱', name: '波兰', code: '+48', iso: 'PL', continent: '欧洲' },
  { flag: '🇺🇦', name: '乌克兰', code: '+380', iso: 'UA', continent: '欧洲' },
  { flag: '🇮🇱', name: '以色列', code: '+972', iso: 'IL', continent: '亚洲' },
  { flag: '🇮🇷', name: '伊朗', code: '+98', iso: 'IR', continent: '亚洲' },
  { flag: '🇪🇬', name: '埃及', code: '+20', iso: 'EG', continent: '非洲' },
  { flag: '🇳🇬', name: '尼日利亚', code: '+234', iso: 'NG', continent: '非洲' },
  { flag: '🇦🇷', name: '阿根廷', code: '+54', iso: 'AR', continent: '南美洲' },
  { flag: '🇨🇱', name: '智利', code: '+56', iso: 'CL', continent: '南美洲' },
  { flag: '🇨🇴', name: '哥伦比亚', code: '+57', iso: 'CO', continent: '南美洲' },
]
const filtered = computed(() => {
  const k = keyword.value.toLowerCase()
  return k ? countries.filter(c => c.name.includes(k) || c.code.includes(k) || c.iso.toLowerCase().includes(k)) : countries
})
function copy(c) {
  navigator.clipboard.writeText(c.code).then(() => alert(`✅ 已复制区号 ${c.code}`))
}
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
code { background: #eef1f5; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
</style>
