<template>
  <ToolLayout title="HTML 特殊字符转义">
    <div class="html-entities">
      <div class="search"><input v-model="kw" class="search-input" placeholder="搜索..." /></div>
      <div class="grid">
        <div class="row header"><span>字符</span><span>名称</span><span>十进制</span><span>十六进制</span><span>描述</span></div>
        <div class="row" v-for="e in filtered" :key="e.char"><span class="char-cell">{{ e.char }}</span><span>{{ e.name }}</span><span class="mono">{{ e.dec }}</span><span class="mono">{{ e.hex }}</span><span>{{ e.desc }}</span></div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const kw = ref('')
const entities = [
  { char: '<', name: 'lt', dec: '&#60;', hex: '&#x3C;', desc: '小于号' },
  { char: '>', name: 'gt', dec: '&#62;', hex: '&#x3E;', desc: '大于号' },
  { char: '&', name: 'amp', dec: '&#38;', hex: '&#x26;', desc: '和号' },
  { char: '"', name: 'quot', dec: '&#34;', hex: '&#x22;', desc: '双引号' },
  { char: "'", name: 'apos', dec: '&#39;', hex: '&#x27;', desc: '单引号' },
  { char: ' ', name: 'nbsp', dec: '&#160;', hex: '&#xA0;', desc: '不换行空格' },
  { char: '©', name: 'copy', dec: '&#169;', hex: '&#xA9;', desc: '版权符号' },
  { char: '®', name: 'reg', dec: '&#174;', hex: '&#xAE;', desc: '注册商标' },
  { char: '™', name: 'trade', dec: '&#8482;', hex: '&#x2122;', desc: '商标' },
  { char: '€', name: 'euro', dec: '&#8364;', hex: '&#x20AC;', desc: '欧元' },
  { char: '£', name: 'pound', dec: '&#163;', hex: '&#xA3;', desc: '英镑' },
  { char: '¥', name: 'yen', dec: '&#165;', hex: '&#xA5;', desc: '日元' },
  { char: '¢', name: 'cent', dec: '&#162;', hex: '&#xA2;', desc: '美分' },
  { char: '§', name: 'sect', dec: '&#167;', hex: '&#xA7;', desc: '章节号' },
  { char: '¶', name: 'para', dec: '&#182;', hex: '&#xB6;', desc: '段落符号' },
  { char: '•', name: 'bull', dec: '&#8226;', hex: '&#x2022;', desc: '圆点' },
  { char: '…', name: 'hellip', dec: '&#8230;', hex: '&#x2026;', desc: '省略号' },
  { char: '–', name: 'ndash', dec: '&#8211;', hex: '&#x2013;', desc: '短破折号' },
  { char: '—', name: 'mdash', dec: '&#8212;', hex: '&#x2014;', desc: '长破折号' },
  { char: '"', name: 'ldquo', dec: '&#8220;', hex: '&#x201C;', desc: '左双引号' },
  { char: '"', name: 'rdquo', dec: '&#8221;', hex: '&#x201D;', desc: '右双引号' },
  { char: "'", name: 'lsquo', dec: '&#8216;', hex: '&#x2018;', desc: '左单引号' },
  { char: "'", name: 'rsquo', dec: '&#8217;', hex: '&#x2019;', desc: '右单引号' },
  { char: '×', name: 'times', dec: '&#215;', hex: '&#xD7;', desc: '乘号' },
  { char: '÷', name: 'divide', dec: '&#247;', hex: '&#xF7;', desc: '除号' },
  { char: '±', name: 'plusmn', dec: '&#177;', hex: '&#xB1;', desc: '正负号' },
]
const filtered = computed(() => {
  if (!kw.value) return entities
  const k = kw.value.toLowerCase()
  return entities.filter(e => e.char.includes(k) || e.name.includes(k) || e.desc.includes(k))
})
</script>

<style scoped>
.html-entities { display: flex; flex-direction: column; gap: 12px; }
.search-input { width: 100%; padding: 10px 14px; border: 1px solid #d0d7de; border-radius: 8px; font-size: 14px; box-sizing: border-box; }
.grid { border: 1px solid #d0d7de; border-radius: 8px; overflow: hidden; }
.row { display: grid; grid-template-columns: 50px 80px 100px 100px 1fr; padding: 8px 12px; border-bottom: 1px solid #d0d7de; font-size: 13px; align-items: center; }
.row:last-child { border-bottom: none; }
.header { background: #f6f8fa; font-weight: 600; }
.char-cell { font-size: 16px; }
.mono { font-family: 'Fira Code', monospace; color: #0969da; font-size: 12px; }
</style>
