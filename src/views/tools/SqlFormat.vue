<template>
  <ToolLayout title="SQL 格式化/压缩">
    <div class="sql-format">
      <div class="tool-bar">
        <button class="btn" @click="format">格式化</button>
        <button class="btn" @click="compress">压缩</button>
        <button class="btn btn-outline" @click="copyResult">复制</button>
        <button class="btn btn-outline" @click="clearAll">清空</button>
      </div>
      <div class="editor-wrap">
        <div class="input-wrap">
          <div class="label">输入 SQL</div>
          <textarea v-model="input" class="code-area" placeholder="SELECT id,name,age FROM users WHERE id>10 ORDER BY id DESC"></textarea>
        </div>
        <div class="output-wrap">
          <div class="label">输出</div>
          <textarea v-model="output" class="code-area" readonly></textarea>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const input = ref('')
const output = ref('')

const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'ON', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP']

function format() {
  let sql = input.value.trim().replace(/\s+/g, ' ')
  keywords.forEach(kw => {
    const regex = new RegExp(`\\b${kw}\\b`, 'gi')
    sql = sql.replace(regex, '\n' + kw)
  })
  const lines = sql.split('\n').map(l => l.trim()).filter(l => l)
  output.value = lines.join('\n')
}

function compress() {
  output.value = input.value.trim().replace(/\s+/g, ' ').replace(/\s*,\s*/g, ',').replace(/\s*;\s*/g, ';')
}

function copyResult() {
  if (!output.value) return
  navigator.clipboard.writeText(output.value).then(() => alert('✅ 已复制'))
}

function clearAll() { input.value = ''; output.value = '' }
</script>

<style scoped>
.sql-format { display: flex; flex-direction: column; gap: 12px; }
.tool-bar { display: flex; gap: 8px; flex-wrap: wrap; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn:hover { background: #0860ca; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.btn-outline:hover { background: #f6f8fa; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.label { font-weight: 600; font-size: 14px; color: #24292f; margin-bottom: 6px; }
.code-area { width: 100%; min-height: 350px; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 13px; resize: vertical; background: #f6f8fa; box-sizing: border-box; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
