<template>
  <ToolLayout title="Markdown 预览" subtitle="实时预览 Markdown 格式文档，支持 GFM 语法" icon="📝">
    <div class="flex flex-col gap-4">
      <!-- 工具栏 -->
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div class="flex bg-[var(--bg-secondary)] rounded-lg p-1 text-sm border border-[var(--border-color)]">
          <button @click="viewMode='split'" :class="viewMode==='split'?'bg-white dark:bg-slate-700 shadow-sm text-[var(--text-primary)]':'text-[var(--text-secondary)]'" class="px-3 py-1.5 rounded-md transition-all">分屏</button>
          <button @click="viewMode='edit'" :class="viewMode==='edit'?'bg-white dark:bg-slate-700 shadow-sm text-[var(--text-primary)]':'text-[var(--text-secondary)]'" class="px-3 py-1.5 rounded-md transition-all">编辑</button>
          <button @click="viewMode='preview'" :class="viewMode==='preview'?'bg-white dark:bg-slate-700 shadow-sm text-[var(--text-primary)]':'text-[var(--text-secondary)]'" class="px-3 py-1.5 rounded-md transition-all">预览</button>
        </div>
        <div class="flex gap-2">
          <button @click="text = sampleMd" class="btn-ghost text-xs py-1.5">载入示例</button>
          <button @click="text = ''" class="btn-ghost text-xs py-1.5">清空</button>
        </div>
      </div>

      <!-- 编辑区 -->
      <div class="flex gap-4" :class="viewMode === 'split' ? 'flex-row' : 'flex-col'">
        <div v-if="viewMode !== 'preview'" :class="viewMode === 'split' ? 'flex-1' : ''">
          <div class="text-xs text-[var(--text-secondary)] mb-2 font-medium">Markdown 输入</div>
          <textarea v-model="text" class="input-base h-[500px] font-mono text-sm leading-relaxed" placeholder="# 标题&#10;在此输入 Markdown 内容..."></textarea>
        </div>
        <div v-if="viewMode !== 'edit'" :class="viewMode === 'split' ? 'flex-1' : ''">
          <div class="text-xs text-[var(--text-secondary)] mb-2 font-medium">渲染预览</div>
          <div class="card p-6 h-[500px] overflow-y-auto prose prose-sm dark:prose-invert max-w-none" v-html="rendered"></div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const viewMode = ref('split')
const text = ref('')

const sampleMd = `# Markdown 预览示例

## 文本格式

**粗体文本** 和 *斜体文本* 以及 ~~删除线~~

## 列表

- 项目一
- 项目二
  - 子项目 A
  - 子项目 B

1. 有序项一
2. 有序项二

## 代码

行内代码 \`const x = 42\`

\`\`\`javascript
function hello(name) {
  console.log(\`Hello, \${name}!\`)
}
\`\`\`

## 引用

> 这是一段引用文本
> 可以多行

## 表格

| 名称 | 类型 | 说明 |
|------|------|------|
| Base64 | 字符工具 | 编解码 |
| IP查询 | 网络工具 | 地址信息 |

## 链接

[访问工具箱](https://superiorhui.github.io)
`

// 简单的 Markdown 解析（演示用，不依赖第三方库）
function parseMarkdown(md) {
  if (!md) return ''
  let html = md
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold mt-6 mb-3 pb-1 border-b border-[var(--border-color)]">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
    .replace(/`([^`]+)`/g, '<code class="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
    .replace(/```(\w+)?\n([\s\S]+?)```/g, '<pre class="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs font-mono my-3"><code>$2</code></pre>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-primary-400 pl-4 text-[var(--text-secondary)] my-2 italic">$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li class="list-disc ml-5 my-0.5">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="list-decimal ml-5 my-0.5">$1</li>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary-500 hover:underline" target="_blank">$1</a>')
    .replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(Boolean).map(c => c.trim())
      return '<tr>' + cells.map(c => `<td class="border border-[var(--border-color)] px-3 py-1.5 text-sm">${c}</td>`).join('') + '</tr>'
    })
    .replace(/\n\n/g, '</p><p class="my-2">')
  return html
}

const rendered = computed(() => parseMarkdown(text.value))
</script>

<style>
.prose table { width: 100%; border-collapse: collapse; }
</style>
