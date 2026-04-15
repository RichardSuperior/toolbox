<template>
  <ToolLayout title="ASCII 对照表">
    <div class="ascii-table">
      <div class="search-row">
        <input v-model="keyword" class="search-input" placeholder="搜索字符、ASCII码或描述..." />
      </div>
      <div class="grid">
        <div class="grid-item header">十进制</div>
        <div class="grid-item header">十六进制</div>
        <div class="grid-item header">字符</div>
        <div class="grid-item header">描述</div>
        <template v-for="item in filtered" :key="item.dec">
          <div class="grid-item">{{ item.dec }}</div>
          <div class="grid-item mono">{{ item.hex }}</div>
          <div class="grid-item char">{{ item.char }}</div>
          <div class="grid-item">{{ item.desc }}</div>
        </template>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const keyword = ref('')
const asciiList = [
  { dec: 0, hex: '00', char: 'NUL', desc: '空字符' }, { dec: 1, hex: '01', char: 'SOH', desc: '标题开始' },
  { dec: 8, hex: '08', char: 'BS', desc: '退格' }, { dec: 9, hex: '09', char: 'TAB', desc: '制表符' },
  { dec: 10, hex: '0A', char: 'LF', desc: '换行' }, { dec: 13, hex: '0D', char: 'CR', desc: '回车' },
  { dec: 32, hex: '20', char: 'Space', desc: '空格' }, { dec: 33, hex: '21', char: '!', desc: '感叹号' },
  { dec: 34, hex: '22', char: '"', desc: '双引号' }, { dec: 35, hex: '23', char: '#', desc: '井号' },
  { dec: 36, hex: '24', char: '$', desc: '美元符' }, { dec: 37, hex: '25', char: '%', desc: '百分号' },
  { dec: 38, hex: '26', char: '&', desc: '和号' }, { dec: 39, hex: '27', char: "'", desc: '单引号' },
  { dec: 40, hex: '28', char: '(', desc: '左括号' }, { dec: 41, hex: '29', char: ')', desc: '右括号' },
  { dec: 42, hex: '2A', char: '*', desc: '星号' }, { dec: 43, hex: '2B', char: '+', desc: '加号' },
  { dec: 44, hex: '2C', char: ',', desc: '逗号' }, { dec: 45, hex: '2D', char: '-', desc: '减号' },
  { dec: 46, hex: '2E', char: '.', desc: '句号' }, { dec: 47, hex: '2F', char: '/', desc: '斜杠' },
  { dec: 48, hex: '30', char: '0', desc: '数字0' }, { dec: 49, hex: '31', char: '1', desc: '数字1' },
  { dec: 50, hex: '32', char: '2', desc: '数字2' }, { dec: 51, hex: '33', char: '3', desc: '数字3' },
  { dec: 52, hex: '34', char: '4', desc: '数字4' }, { dec: 53, hex: '35', char: '5', desc: '数字5' },
  { dec: 54, hex: '36', char: '6', desc: '数字6' }, { dec: 55, hex: '37', char: '7', desc: '数字7' },
  { dec: 56, hex: '38', char: '8', desc: '数字8' }, { dec: 57, hex: '39', char: '9', desc: '数字9' },
  { dec: 58, hex: '3A', char: ':', desc: '冒号' }, { dec: 59, hex: '3B', char: ';', desc: '分号' },
  { dec: 60, hex: '3C', char: '<', desc: '小于号' }, { dec: 61, hex: '3D', char: '=', desc: '等号' },
  { dec: 62, hex: '3E', char: '>', desc: '大于号' }, { dec: 63, hex: '3F', char: '?', desc: '问号' },
  { dec: 64, hex: '40', char: '@', desc: '邮箱符' }, { dec: 65, hex: '41', char: 'A', desc: '大写字母' },
  { dec: 66, hex: '42', char: 'B', desc: '' }, { dec: 67, hex: '43', char: 'C', desc: '' },
  { dec: 68, hex: '44', char: 'D', desc: '' }, { dec: 69, hex: '45', char: 'E', desc: '' },
  { dec: 70, hex: '46', char: 'F', desc: '' }, { dec: 71, hex: '47', char: 'G', desc: '' },
  { dec: 72, hex: '48', char: 'H', desc: '' }, { dec: 73, hex: '49', char: 'I', desc: '' },
  { dec: 74, hex: '4A', char: 'J', desc: '' }, { dec: 75, hex: '4B', char: 'K', desc: '' },
  { dec: 76, hex: '4C', char: 'L', desc: '' }, { dec: 77, hex: '4D', char: 'M', desc: '' },
  { dec: 78, hex: '4E', char: 'N', desc: '' }, { dec: 79, hex: '4F', char: 'O', desc: '' },
  { dec: 80, hex: '50', char: 'P', desc: '' }, { dec: 81, hex: '51', char: 'Q', desc: '' },
  { dec: 82, hex: '52', char: 'R', desc: '' }, { dec: 83, hex: '53', char: 'S', desc: '' },
  { dec: 84, hex: '54', char: 'T', desc: '' }, { dec: 85, hex: '55', char: 'U', desc: '' },
  { dec: 86, hex: '56', char: 'V', desc: '' }, { dec: 87, hex: '57', char: 'W', desc: '' },
  { dec: 88, hex: '58', char: 'X', desc: '' }, { dec: 89, hex: '59', char: 'Y', desc: '' },
  { dec: 90, hex: '5A', char: 'Z', desc: '' }, { dec: 91, hex: '5B', char: '[', desc: '左方括号' },
  { dec: 92, hex: '5C', char: '\\', desc: '反斜杠' }, { dec: 93, hex: '5D', char: ']', desc: '右方括号' },
  { dec: 94, hex: '5E', char: '^', desc: '脱字符' }, { dec: 95, hex: '5F', char: '_', desc: '下划线' },
  { dec: 96, hex: '60', char: '`', desc: '反引号' },
  { dec: 97, hex: '61', char: 'a', desc: '小写字母' }, { dec: 98, hex: '62', char: 'b', desc: '' },
  { dec: 99, hex: '63', char: 'c', desc: '' }, { dec: 100, hex: '64', char: 'd', desc: '' },
  { dec: 101, hex: '65', char: 'e', desc: '' }, { dec: 102, hex: '66', char: 'f', desc: '' },
  { dec: 103, hex: '67', char: 'g', desc: '' }, { dec: 104, hex: '68', char: 'h', desc: '' },
  { dec: 105, hex: '69', char: 'i', desc: '' }, { dec: 106, hex: '6A', char: 'j', desc: '' },
  { dec: 107, hex: '6B', char: 'k', desc: '' }, { dec: 108, hex: '6C', char: 'l', desc: '' },
  { dec: 109, hex: '6D', char: 'm', desc: '' }, { dec: 110, hex: '6E', char: 'n', desc: '' },
  { dec: 111, hex: '6F', char: 'o', desc: '' }, { dec: 112, hex: '70', char: 'p', desc: '' },
  { dec: 113, hex: '71', char: 'q', desc: '' }, { dec: 114, hex: '72', char: 'r', desc: '' },
  { dec: 115, hex: '73', char: 's', desc: '' }, { dec: 116, hex: '74', char: 't', desc: '' },
  { dec: 117, hex: '75', char: 'u', desc: '' }, { dec: 118, hex: '76', char: 'v', desc: '' },
  { dec: 119, hex: '77', char: 'w', desc: '' }, { dec: 120, hex: '78', char: 'x', desc: '' },
  { dec: 121, hex: '79', char: 'y', desc: '' }, { dec: 122, hex: '7A', char: 'z', desc: '' },
  { dec: 123, hex: '7B', char: '{', desc: '左花括号' }, { dec: 124, hex: '7C', char: '|', desc: '竖线' },
  { dec: 125, hex: '7D', char: '}', desc: '右花括号' }, { dec: 126, hex: '7E', char: '~', desc: '波浪号' },
]
const filtered = computed(() => {
  if (!keyword.value) return asciiList
  const kw = keyword.value.toLowerCase()
  return asciiList.filter(i => String(i.dec).includes(kw) || i.hex.toLowerCase().includes(kw) || i.char.toLowerCase().includes(kw) || i.desc.includes(kw))
})
</script>

<style scoped>
.ascii-table { display: flex; flex-direction: column; gap: 12px; }
.search-input { width: 100%; padding: 10px 14px; border: 1px solid #d0d7de; border-radius: 8px; font-size: 14px; box-sizing: border-box; }
.grid { display: grid; grid-template-columns: 80px 80px 80px 1fr; border: 1px solid #d0d7de; border-radius: 8px; overflow: hidden; }
.grid-item { padding: 6px 10px; font-size: 13px; border-bottom: 1px solid #d0d7de; border-right: 1px solid #d0d7de; }
.header { background: #f6f8fa; font-weight: 600; }
.char { font-family: 'Fira Code', monospace; color: #0969da; font-weight: 600; }
.mono { font-family: 'Fira Code', monospace; }
</style>
