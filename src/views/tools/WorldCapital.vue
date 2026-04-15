<template>
  <ToolLayout title="世界国家首都">
    <div class="tool-wrap">
      <div class="search-bar">
        <input v-model="keyword" class="search-input" placeholder="搜索国家名或首都名..." />
        <span class="count">共 {{ filtered.length }} 个</span>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>国旗</th><th>国家</th><th>首都</th><th>洲</th><th>语言</th></tr></thead>
          <tbody>
            <tr v-for="c in filtered" :key="c.country">
              <td>{{ c.flag }}</td>
              <td>{{ c.country }}</td>
              <td>{{ c.capital }}</td>
              <td>{{ c.continent }}</td>
              <td>{{ c.language }}</td>
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
const capitals = [
  { flag: '🇨🇳', country: '中国', capital: '北京', continent: '亚洲', language: '普通话' },
  { flag: '🇺🇸', country: '美国', capital: '华盛顿特区', continent: '北美洲', language: '英语' },
  { flag: '🇬🇧', country: '英国', capital: '伦敦', continent: '欧洲', language: '英语' },
  { flag: '🇫🇷', country: '法国', capital: '巴黎', continent: '欧洲', language: '法语' },
  { flag: '🇩🇪', country: '德国', capital: '柏林', continent: '欧洲', language: '德语' },
  { flag: '🇯🇵', country: '日本', capital: '东京', continent: '亚洲', language: '日语' },
  { flag: '🇰🇷', country: '韩国', capital: '首尔', continent: '亚洲', language: '韩语' },
  { flag: '🇷🇺', country: '俄罗斯', capital: '莫斯科', continent: '欧洲/亚洲', language: '俄语' },
  { flag: '🇮🇳', country: '印度', capital: '新德里', continent: '亚洲', language: '印地语/英语' },
  { flag: '🇧🇷', country: '巴西', capital: '巴西利亚', continent: '南美洲', language: '葡萄牙语' },
  { flag: '🇦🇺', country: '澳大利亚', capital: '堪培拉', continent: '大洋洲', language: '英语' },
  { flag: '🇨🇦', country: '加拿大', capital: '渥太华', continent: '北美洲', language: '英语/法语' },
  { flag: '🇮🇹', country: '意大利', capital: '罗马', continent: '欧洲', language: '意大利语' },
  { flag: '🇪🇸', country: '西班牙', capital: '马德里', continent: '欧洲', language: '西班牙语' },
  { flag: '🇲🇽', country: '墨西哥', capital: '墨西哥城', continent: '北美洲', language: '西班牙语' },
  { flag: '🇸🇦', country: '沙特阿拉伯', capital: '利雅得', continent: '亚洲', language: '阿拉伯语' },
  { flag: '🇹🇷', country: '土耳其', capital: '安卡拉', continent: '欧亚', language: '土耳其语' },
  { flag: '🇮🇩', country: '印度尼西亚', capital: '雅加达', continent: '亚洲', language: '印尼语' },
  { flag: '🇿🇦', country: '南非', capital: '比勒陀利亚', continent: '非洲', language: '11种官方语言' },
  { flag: '🇦🇷', country: '阿根廷', capital: '布宜诺斯艾利斯', continent: '南美洲', language: '西班牙语' },
  { flag: '🇳🇱', country: '荷兰', capital: '阿姆斯特丹', continent: '欧洲', language: '荷兰语' },
  { flag: '🇨🇭', country: '瑞士', capital: '伯尔尼', continent: '欧洲', language: '德/法/意/罗曼语' },
  { flag: '🇸🇪', country: '瑞典', capital: '斯德哥尔摩', continent: '欧洲', language: '瑞典语' },
  { flag: '🇳🇴', country: '挪威', capital: '奥斯陆', continent: '欧洲', language: '挪威语' },
  { flag: '🇩🇰', country: '丹麦', capital: '哥本哈根', continent: '欧洲', language: '丹麦语' },
  { flag: '🇫🇮', country: '芬兰', capital: '赫尔辛基', continent: '欧洲', language: '芬兰语/瑞典语' },
  { flag: '🇳🇿', country: '新西兰', capital: '惠灵顿', continent: '大洋洲', language: '英语/毛利语' },
  { flag: '🇸🇬', country: '新加坡', capital: '新加坡', continent: '亚洲', language: '英/中/马/泰语' },
  { flag: '🇹🇭', country: '泰国', capital: '曼谷', continent: '亚洲', language: '泰语' },
  { flag: '🇻🇳', country: '越南', capital: '河内', continent: '亚洲', language: '越南语' },
  { flag: '🇲🇾', country: '马来西亚', capital: '吉隆坡', continent: '亚洲', language: '马来语' },
  { flag: '🇵🇭', country: '菲律宾', capital: '马尼拉', continent: '亚洲', language: '菲律宾语/英语' },
  { flag: '🇵🇰', country: '巴基斯坦', capital: '伊斯兰堡', continent: '亚洲', language: '乌尔都语/英语' },
  { flag: '🇧🇩', country: '孟加拉国', capital: '达卡', continent: '亚洲', language: '孟加拉语' },
  { flag: '🇪🇬', country: '埃及', capital: '开罗', continent: '非洲', language: '阿拉伯语' },
  { flag: '🇳🇬', country: '尼日利亚', capital: '阿布贾', continent: '非洲', language: '英语' },
  { flag: '🇰🇪', country: '肯尼亚', capital: '内罗毕', continent: '非洲', language: '斯瓦希里语/英语' },
  { flag: '🇬🇭', country: '加纳', capital: '阿克拉', continent: '非洲', language: '英语' },
  { flag: '🇵🇹', country: '葡萄牙', capital: '里斯本', continent: '欧洲', language: '葡萄牙语' },
  { flag: '🇬🇷', country: '希腊', capital: '雅典', continent: '欧洲', language: '希腊语' },
  { flag: '🇵🇱', country: '波兰', capital: '华沙', continent: '欧洲', language: '波兰语' },
  { flag: '🇺🇦', country: '乌克兰', capital: '基辅', continent: '欧洲', language: '乌克兰语' },
  { flag: '🇮🇱', country: '以色列', capital: '耶路撒冷', continent: '亚洲', language: '希伯来语/阿拉伯语' },
  { flag: '🇮🇷', country: '伊朗', capital: '德黑兰', continent: '亚洲', language: '波斯语' },
  { flag: '🇮🇶', country: '伊拉克', capital: '巴格达', continent: '亚洲', language: '阿拉伯语/库尔德语' },
]
const filtered = computed(() => {
  const k = keyword.value.toLowerCase()
  return k ? capitals.filter(c => c.country.includes(k) || c.capital.includes(k) || c.continent.includes(k)) : capitals
})
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
.data-table tr:hover { background: #f0f6ff; }
</style>
