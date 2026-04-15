<template>
  <ToolLayout title="JSON 转 YAML">
    <div class="json-yaml">
      <div class="tool-bar">
        <button class="btn" @click="convert('json2yaml')">JSON → YAML</button>
        <button class="btn" @click="convert('yaml2json')">YAML → JSON</button>
        <button class="btn btn-outline" @click="copyResult">复制结果</button>
        <button class="btn btn-outline" @click="clearAll">清空</button>
      </div>
      <div class="editor-wrap">
        <div class="input-wrap">
          <div class="label">输入</div>
          <textarea v-model="input" class="code-area" placeholder='{"name": "张三", "age": 25, "skills": ["Python", "JavaScript"]}'></textarea>
        </div>
        <div class="output-wrap">
          <div class="label">输出</div>
          <textarea v-model="output" class="code-area" readonly placeholder="转换结果..."></textarea>
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

function jsonToYaml(obj, depth = 0) {
  const indent = '  '.repeat(depth)
  const lines = []
  for (const [key, value] of Object.entries(obj)) {
    if (value === null) { lines.push(`${indent}${key}: null`); continue }
    if (Array.isArray(value)) {
      if (value.length === 0) { lines.push(`${indent}${key}: []`) }
      else {
        lines.push(`${indent}${key}:`)
        value.forEach(item => {
          if (typeof item === 'object' && item !== null) {
            lines.push(`${indent}  -`)
            lines.push(...jsonToYaml(item, depth + 2).map(l => '  ' + l))
          } else { lines.push(`${indent}  - ${item}`) }
        })
      }
    } else if (typeof value === 'object') {
      lines.push(`${indent}${key}:`)
      lines.push(...jsonToYaml(value, depth + 1).map(l => '  ' + l))
    } else if (typeof value === 'string') {
      lines.push(`${indent}${key}: "${value}"`)
    } else { lines.push(`${indent}${key}: ${value}`) }
  }
  return lines
}

function yamlToJsonObj(yamlLines, idx = 0) {
  const result = {}
  while (idx < yamlLines.length) {
    const line = yamlLines[idx]
    if (!line.trim() || line.match(/^\s*#/)) { idx++; continue }
    const indent = line.match(/^\s*/)[0].length
    const match = line.match(/^(\s*)([^:]+):\s*(.*)/)
    if (!match) { idx++; continue }
    const key = match[2].trim()
    const value = match[3].trim()
    if (value === '' || value === '|' || value === '>') {
      const children = []
      idx++
      while (idx < yamlLines.length) {
        const nextLine = yamlLines[idx]
        if (!nextLine.trim()) { idx++; break }
        const nextIndent = nextLine.match(/^\s*/)[0].length
        if (nextIndent <= indent) break
        children.push(nextLine.trim())
        idx++
      }
      if (children.length > 0 && children[0].startsWith('-')) {
        result[key] = children.map(c => c.replace(/^-\s*/, '').replace(/^["']|["']$/g, ''))
      } else {
        result[key] = children.join(' ')
      }
    } else if (value.startsWith('[') && value.endsWith(']')) {
      try { result[key] = JSON.parse(value) } catch { result[key] = value }
    } else if (value === 'true' || value === 'false') { result[key] = value === 'true' }
    else if (value === 'null') { result[key] = null }
    else if (!isNaN(Number(value))) { result[key] = Number(value) }
    else { result[key] = value.replace(/^["']|["']$/g, '') }
    idx++
  }
  return result
}

function convert(direction) {
  try {
    if (direction === 'json2yaml') {
      const obj = JSON.parse(input.value)
      output.value = jsonToYaml(obj).join('\n')
    } else {
      const lines = input.value.split('\n')
      const obj = yamlToJsonObj(lines)
      output.value = JSON.stringify(obj, null, 2)
    }
  } catch (e) { alert('❌ 转换错误: ' + e.message) }
}

function copyResult() {
  if (!output.value) return
  navigator.clipboard.writeText(output.value).then(() => alert('✅ 已复制'))
}

function clearAll() { input.value = ''; output.value = '' }
</script>

<style scoped>
.json-yaml { display: flex; flex-direction: column; gap: 12px; }
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
