<template>
  <ToolLayout title="生成 Meta 标签">
    <div class="meta-tag">
      <div class="form">
        <div class="form-row"><label>网页标题</label><input v-model="title" class="input" placeholder="网站标题" /></div>
        <div class="form-row"><label>网站描述</label><textarea v-model="desc" class="textarea" placeholder="网站描述，150字以内" maxlength="150"></textarea><span class="count">{{ desc.length }}/150</span></div>
        <div class="form-row"><label>关键词</label><input v-model="keywords" class="input" placeholder="关键词1,关键词2,关键词3" /></div>
        <div class="form-row"><label>作者</label><input v-model="author" class="input" placeholder="作者名称" /></div>
        <div class="form-row"><label>网站图标 URL</label><input v-model="favicon" class="input" placeholder="https://example.com/favicon.ico" /></div>
        <div class="form-row"><label>CSS 文件</label><input v-model="css" class="input" placeholder="/css/style.css" /></div>
        <div class="form-row"><label>JS 文件</label><input v-model="js" class="input" placeholder="/js/main.js" /></div>
        <div class="form-row"><label>Viewport</label><input v-model="viewport" class="input" placeholder="width=device-width, initial-scale=1" /></div>
        <div class="form-row"><label>搜索引擎可见性</label><select v-model="robots" class="input"><option value="index, follow">允许收录</option><option value="noindex, nofollow">禁止收录</option></select></div>
      </div>
      <div class="result">
        <div class="result-header"><span>生成的 HTML 代码</span><button class="btn" @click="copy">复制代码</button></div>
        <pre class="code"><code>{{ generated }}</code></pre>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const title = ref(''), desc = ref(''), keywords = ref(''), author = ref('')
const favicon = ref(''), css = ref(''), js = ref('')
const viewport = ref('width=device-width, initial-scale=1.0')
const robots = ref('index, follow')

const generated = computed(() => {
  const lines = ['<!-- Meta Tags -->']
  if (title.value) lines.push(`<title>${title.value}</title>`)
  lines.push(`<meta name="viewport" content="${viewport.value}">`)
  lines.push(`<meta name="robots" content="${robots.value}">`)
  if (desc.value) lines.push(`<meta name="description" content="${desc.value}">`)
  if (keywords.value) lines.push(`<meta name="keywords" content="${keywords.value}">`)
  if (author.value) lines.push(`<meta name="author" content="${author.value}">`)
  if (favicon.value) lines.push(`<link rel="icon" href="${favicon.value}">`)
  if (css.value) lines.push(`<link rel="stylesheet" href="${css.value}">`)
  if (js.value) lines.push(`<script src="${js.value}"></` + `script>`)
  return lines.join('\n')
})

function copy() { navigator.clipboard.writeText(generated.value).then(() => alert('已复制')) }
</script>

<style scoped>
.meta-tag { display: flex; flex-direction: column; gap: 16px; }
.form { display: flex; flex-direction: column; gap: 10px; max-width: 700px; }
.form-row { display: flex; flex-direction: column; gap: 4px; position: relative; }
.form-row label { font-weight: 600; font-size: 13px; color: #333; }
.input, .textarea { padding: 8px 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 14px; }
.textarea { min-height: 80px; resize: vertical; }
.count { font-size: 12px; color: #666; text-align: right; }
.result { background: #1e1e1e; border-radius: 8px; overflow: hidden; }
.result-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #2d2d2d; }
.result-header span { color: #d4d4d4; font-size: 13px; }
.btn { padding: 4px 12px; background: #0969da; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; }
.code { padding: 16px; margin: 0; font-family: 'Fira Code', monospace; font-size: 12px; color: #d4d4d4; overflow-x: auto; white-space: pre-wrap; }
</style>
