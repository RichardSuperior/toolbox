<template>
  <ToolLayout title="正则表达式语法速查">
    <div class="regex-syntax">
      <div class="section" v-for="section in sections" :key="section.title">
        <h3 class="section-title">{{ section.title }}</h3>
        <div class="table">
          <div class="row header">
            <div>语法</div>
            <div>说明</div>
            <div>示例</div>
          </div>
          <div class="row" v-for="item in section.items" :key="item.syntax">
            <div class="code">{{ item.syntax }}</div>
            <div>{{ item.desc }}</div>
            <div class="code small">{{ item.example }}</div>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import ToolLayout from '../../components/ToolLayout.vue'
const sections = [
  {
    title: '字符类',
    items: [
      { syntax: '.', desc: '任意单个字符', example: 'a.c → abc' },
      { syntax: '\\d', desc: '任意数字 [0-9]', example: '\\d+ → 123' },
      { syntax: '\\D', desc: '任意非数字', example: '\\D+ → abc' },
      { syntax: '\\w', desc: '字母数字下划线', example: '\\w+ → hello_1' },
      { syntax: '\\W', desc: '非字母数字下划线', example: '\\W+ → @#$' },
      { syntax: '\\s', desc: '空白字符', example: 'a\\sb → a b' },
      { syntax: '[abc]', desc: '字符集：a、b 或 c', example: '[aeiou]' },
      { syntax: '[^abc]', desc: '否定字符集', example: '[^0-9]' },
      { syntax: '[a-z]', desc: '范围：a 到 z', example: '[A-Z]' },
    ],
  },
  {
    title: '锚点与边界',
    items: [
      { syntax: '^', desc: '字符串开头', example: '^hello' },
      { syntax: '$', desc: '字符串结尾', example: 'world$' },
      { syntax: '\\b', desc: '单词边界', example: '\\bword\\b' },
      { syntax: '\\B', desc: '非单词边界', example: '\\Bend' },
    ],
  },
  {
    title: '量词',
    items: [
      { syntax: '*', desc: '0次或多次', example: 'ab*c → ac, abc, abbc' },
      { syntax: '+', desc: '1次或多次', example: 'ab+c → abc, abbc' },
      { syntax: '?', desc: '0次或1次', example: 'colou?r → color, colour' },
      { syntax: '{n}', desc: '恰好 n 次', example: '\\d{4} → 2024' },
      { syntax: '{n,}', desc: '至少 n 次', example: '\\d{2,}' },
      { syntax: '{n,m}', desc: 'n 到 m 次', example: '\\d{2,4}' },
      { syntax: '*?', desc: '非贪婪：尽可能少', example: '<.*?> → 单标签' },
    ],
  },
  {
    title: '分组与引用',
    items: [
      { syntax: '(abc)', desc: '捕获组', example: '(\\d+) 捕获数字' },
      { syntax: '(?:abc)', desc: '非捕获组', example: '(?:ab)+' },
      { syntax: '(?<name>)', desc: '命名捕获组', example: '(?<year>\\d{4})' },
      { syntax: '\\1', desc: '反向引用第1组', example: '(\\w)\\1 → aa, bb' },
      { syntax: '(?=abc)', desc: '正前瞻', example: 'foo(?=bar)' },
      { syntax: '(?!abc)', desc: '负前瞻', example: 'foo(?!bar)' },
    ],
  },
  {
    title: '或与转义',
    items: [
      { syntax: 'a|b', desc: '匹配 a 或 b', example: 'cat|dog' },
      { syntax: '\\n', desc: '换行符', example: 'line1\\nline2' },
      { syntax: '\\t', desc: '制表符', example: 'col1\\tcol2' },
      { syntax: '\\\\', desc: '转义反斜杠', example: 'C:\\\\path' },
    ],
  },
]
</script>

<style scoped>
.regex-syntax { display: flex; flex-direction: column; gap: 24px; }
.section-title { font-size: 16px; font-weight: 600; color: #24292f; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 2px solid #0969da; }
.table { border: 1px solid #d0d7de; border-radius: 8px; overflow: hidden; }
.row { display: grid; grid-template-columns: 120px 1fr 180px; padding: 8px 12px; border-bottom: 1px solid #d0d7de; }
.row:last-child { border-bottom: none; }
.row.header { background: #f6f8fa; font-weight: 600; font-size: 13px; }
.code { font-family: 'Fira Code', monospace; font-size: 13px; color: #0969da; }
.code.small { font-size: 11px; }
</style>
