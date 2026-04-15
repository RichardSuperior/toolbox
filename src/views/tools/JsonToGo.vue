<template>
  <ToolLayout title="JSON 生成 Go 结构体">
    <div class="gen-go">
      <div class="tool-bar">
        <div class="bar-left">
          <button class="btn" @click="generate">生成结构体</button>
          <select v-model="rootName" class="sel">
            <option value="Root">Root</option>
            <option value="Response">Response</option>
            <option value="Data">Data</option>
          </select>
        </div>
        <div class="bar-right">
          <label class="check-label"><input type="checkbox" v-model="omitempty" /> omitempty</label>
          <button class="btn btn-outline" @click="copyResult">复制代码</button>
        </div>
      </div>
      <div class="editor-wrap">
        <div class="input-wrap">
          <div class="label">输入 JSON</div>
          <textarea v-model="jsonInput" class="code-area" placeholder='{\n  "name": "张三",\n  "age": 25,\n  "email": "test@example.com"\n}'></textarea>
        </div>
        <div class="output-wrap">
          <div class="label">生成的 Go 代码</div>
          <textarea v-model="goCode" class="code-area" readonly placeholder="生成的 Go struct 代码..."></textarea>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const jsonInput = ref('')
const goCode = ref('')
const rootName = ref('Root')
const omitempty = ref(true)

function toPascal(str) {
  return str.replace(/_(\w)/g, (_, c) => c.toUpperCase()).replace(/^\w/, c => c.toUpperCase())
}

function getGoType(value) {
  if (value === null) return 'interface{}'
  if (Array.isArray(value)) {
    const elemType = value.length > 0 ? getGoType(value[0]) : 'interface{}'
    return '[]' + elemType
  }
  const t = typeof value
  if (t === 'number') return Number.isInteger(value) ? 'int' : 'float64'
  if (t === 'boolean') return 'bool'
  if (t === 'string') return 'string'
  return 'interface{}'
}

function generate() {
  try {
    const obj = JSON.parse(jsonInput.value)
    const lines = []
    const seen = new Set()

    function processObject(obj, className, depth) {
      const indent = ' '.repeat(depth * 2)
      lines.push(`${indent}type ${className} struct {`)
      const keys = Object.keys(obj)
      keys.forEach((key) => {
        const jsonTag = omitempty.value ? `json:"${key,omitempty,omitempty,omitempty}"` : `json:"${key}"`
        const propName = toPascal(key)
        const value = obj[key]
        const type = getGoType(value)
        lines.push(`${indent}  ${propName} ${type} \`${jsonTag}\``)
      })
      lines.push(`${indent}}`)
      lines.push('')
    }

    processObject(obj, rootName.value, 0)
    goCode.value = 'package model\n\n' + lines.join('\n')
  } catch (e) {
    alert('❌ JSON 解析错误: ' + e.message)
  }
}

function copyResult() {
  if (!goCode.value) return
  navigator.clipboard.writeText(goCode.value).then(() => alert('✅ 已复制'))
}
</script>

<style scoped>
.gen-go { display: flex; flex-direction: column; gap: 12px; }
.tool-bar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
.bar-left, .bar-right { display: flex; align-items: center; gap: 8px; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn:hover { background: #0860ca; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.btn-outline:hover { background: #f6f8fa; }
.sel { padding: 6px 8px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 13px; background: white; }
.check-label { display: flex; align-items: center; gap: 4px; font-size: 13px; cursor: pointer; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.label { font-weight: 600; font-size: 14px; color: #24292f; }
.code-area { width: 100%; min-height: 350px; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 13px; resize: vertical; background: #f6f8fa; box-sizing: border-box; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
