<template>
  <ToolLayout title="XML 和 JSON 在线互转">
    <div class="xml-json">
      <div class="tool-bar">
        <button class="btn" @click="xmlToJson">XML → JSON</button>
        <button class="btn" @click="jsonToXml">JSON → XML</button>
        <button class="btn btn-outline" @click="copyResult">复制结果</button>
        <button class="btn btn-outline" @click="clearAll">清空</button>
      </div>
      <div class="editor-wrap">
        <div class="input-wrap">
          <div class="label">输入</div>
          <textarea v-model="input" class="code-area" :placeholder="inputPlaceholder" @input="detectFormat"></textarea>
          <div class="status">
            <span class="format-tag">{{ detectedFormat || '等待输入...' }}</span>
          </div>
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
const detectedFormat = ref('')
const inputPlaceholder = ref('<root>\n  <name>张三</name>\n  <age>25</age>\n</root>')

function detectFormat() {
  const val = input.value.trim()
  if (!val) { detectedFormat.value = ''; return }
  if (val.startsWith('<') || val.startsWith('<?xml')) {
    detectedFormat.value = '📄 XML 格式'
    inputPlaceholder.value = '<root>\n  <name>张三</name>\n</root>'
  } else if (val.startsWith('{') || val.startsWith('[')) {
    detectedFormat.value = '📋 JSON 格式'
    inputPlaceholder.value = '{\n  "name": "张三"\n}'
  }
}

function xmlToJson() {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(input.value, 'text/xml')
    const errNode = doc.querySelector('parsererror')
    if (errNode) { alert('❌ XML 解析错误'); return }
    output.value = JSON.stringify(xmlToObj(doc.documentElement), null, 2)
  } catch (e) { alert('❌ 转换失败: ' + e.message) }
}

function xmlToObj(node) {
  const obj = {}
  if (node.attributes) {
    [...node.attributes].forEach(attr => { obj['@' + attr.name] = attr.value })
  }
  if (node.childNodes) {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === 1) {
        const key = child.nodeName
        const value = child.childNodes.length === 1 && child.firstChild.nodeType === 3
          ? child.textContent
          : xmlToObj(child)
        if (obj[key]) {
          if (!Array.isArray(obj[key])) obj[key] = [obj[key]]
          obj[key].push(value)
        } else { obj[key] = value }
      }
    })
  }
  return obj
}

function jsonToXml() {
  try {
    const obj = JSON.parse(input.value)
    output.value = '<?xml version="1.0" encoding="UTF-8"?>\n' + jsonToXmlStr('root', obj, 0)
  } catch (e) { alert('❌ JSON 解析错误: ' + e.message) }
}

function jsonToXmlStr(tag, value, depth) {
  const indent = '  '.repeat(depth)
  if (typeof value === 'object' && value !== null) {
    if (Array.isArray(value)) {
      return value.map(v => jsonToXmlStr(tag, v, depth)).join('\n')
    }
    const children = Object.entries(value).map(([k, v]) => {
      return k.startsWith('@') ? ` ${k.slice(1)}="${v}"` : '\n' + jsonToXmlStr(k, v, depth + 1)
    }).join('')
    return `${indent}<${tag}${children.includes('\n') ? children : ''}\n${indent}</${tag}>`
  }
  return `${indent}<${tag}>${value}</${tag}>`
}

function copyResult() {
  if (!output.value) return
  navigator.clipboard.writeText(output.value).then(() => alert('✅ 已复制'))
}

function clearAll() { input.value = ''; output.value = ''; detectedFormat.value = '' }
</script>

<style scoped>
.xml-json { display: flex; flex-direction: column; gap: 12px; }
.tool-bar { display: flex; gap: 8px; flex-wrap: wrap; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn:hover { background: #0860ca; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.btn-outline:hover { background: #f6f8fa; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.label { font-weight: 600; font-size: 14px; color: #24292f; margin-bottom: 6px; }
.code-area { width: 100%; min-height: 350px; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 13px; resize: vertical; background: #f6f8fa; box-sizing: border-box; }
.format-tag { font-size: 12px; color: #0969da; background: #ddf4ff; padding: 2px 8px; border-radius: 4px; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
