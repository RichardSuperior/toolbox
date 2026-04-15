<template>
  <ToolLayout title="常用正则表达式">
    <div class="regex-common">
      <div class="search-box">
        <input v-model="keyword" class="search-input" placeholder="搜索正则表达式..." />
      </div>
      <div class="list">
        <div v-for="item in filteredList" :key="item.name" class="item" @click="useRegex(item)">
          <div class="item-name">{{ item.name }}</div>
          <div class="item-pattern">{{ item.pattern }}</div>
          <div class="item-desc">{{ item.desc }}</div>
        </div>
        <div v-if="filteredList.length === 0" class="empty">未找到匹配的正则表达式</div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const keyword = ref('')
const list = [
  { name: '手机号码', pattern: '^1[3-9]\\d{9}$', desc: '匹配中国大陆手机号' },
  { name: '邮箱地址', pattern: '^\\w+@[a-zA-Z0-9]+\\.[a-zA-Z]{2,}$', desc: '匹配常见邮箱格式' },
  { name: '身份证号', pattern: '^[1-9]\\d{5}(19|20)\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])\\d{3}[\\dXx]$', desc: '18位身份证号码' },
  { name: 'URL 地址', pattern: '^https?://[\\w.-]+(:\\d+)?(/.*)?$', desc: '匹配 HTTP/HTTPS URL' },
  { name: 'IP 地址', pattern: '^((25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]?\\d)\\.){3}(25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]?\\d)$', desc: 'IPv4 地址' },
  { name: '日期格式', pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$', desc: 'YYYY-MM-DD 格式' },
  { name: '时间格式', pattern: '^([01]\\d|2[0-3]):[0-5]\\d(:[0-5]\\d)?$', desc: 'HH:mm:ss 或 HH:mm 格式' },
  { name: '中文姓名', pattern: '^[\\u4e00-\\u9fa5]{2,4}$', desc: '匹配2-4个汉字的中文姓名' },
  { name: 'QQ 号码', pattern: '^[1-9]\\d{4,10}$', desc: '匹配 5-11 位 QQ 号' },
  { name: '邮政编码', pattern: '^[1-9]\\d{5}$', desc: '中国大陆 6 位邮政编码' },
  { name: '银行卡号', pattern: '^[1-9]\\d{13,19}$', desc: '匹配银行卡号（16-20位）' },
  { name: '域名', pattern: '^[a-zA-Z0-9][-a-zA-Z0-9]*(\\.[a-zA-Z]{2,})+$', desc: '匹配域名' },
  { name: 'HTML 标签', pattern: '<([a-z]+)([^<]+)*(?:>(.*)|/s*>)', desc: '匹配 HTML 标签' },
  { name: '用户名', pattern: '^[a-zA-Z][a-zA-Z0-9_]{3,15}$', desc: '字母开头，4-16位字母数字下划线' },
  { name: '密码强度', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$', desc: '至少8位，包含大小写字母和数字' },
  { name: '十六进制颜色', pattern: '^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$', desc: '匹配 #RGB 或 #RRGGBB 颜色' },
  { name: 'UUID', pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', desc: '匹配 UUID 格式' },
  { name: 'Mac 地址', pattern: '^([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}$', desc: '匹配 MAC 地址' },
]

const filteredList = computed(() => {
  if (!keyword.value) return list
  const kw = keyword.value.toLowerCase()
  return list.filter(item => item.name.toLowerCase().includes(kw) || item.pattern.toLowerCase().includes(kw) || item.desc.includes(kw))
})

function useRegex(item) {
  navigator.clipboard.writeText(item.pattern).then(() => alert(`✅ 已复制: ${item.pattern}`))
}
</script>

<style scoped>
.regex-common { display: flex; flex-direction: column; gap: 12px; }
.search-input { width: 100%; padding: 10px 14px; border: 1px solid #d0d7de; border-radius: 8px; font-size: 14px; box-sizing: border-box; }
.list { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px; }
.item { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 12px; cursor: pointer; transition: all 0.2s; }
.item:hover { background: #eaeef2; border-color: #0969da; }
.item-name { font-weight: 600; font-size: 14px; color: #24292f; margin-bottom: 4px; }
.item-pattern { font-family: 'Fira Code', monospace; font-size: 12px; color: #0969da; background: #ddf4ff; padding: 4px 8px; border-radius: 4px; margin-bottom: 6px; word-break: break-all; }
.item-desc { font-size: 12px; color: #666; }
.empty { text-align: center; color: #999; padding: 40px; font-size: 14px; }
</style>
