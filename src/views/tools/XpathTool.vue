<template>
  <ToolLayout title="XPath 解析工具">
    <div class="tool-wrap">
      <div class="toolbar">
        <button class="btn" @click="evaluate">▶ 执行 XPath</button>
        <button class="btn btn-outline" @click="clear">清空</button>
        <button class="btn btn-outline" @click="loadSample">示例</button>
      </div>
      <div class="input-section">
        <div class="input-group">
          <div class="label">XPath 表达式</div>
          <input v-model="xpath" class="xpath-input" placeholder="输入 XPath，如 //title 或 //div[@class='main']" />
        </div>
        <div class="editor-wrap">
          <div>
            <div class="label">XML / HTML 内容</div>
            <textarea v-model="xmlInput" rows="14" class="code-area" placeholder="粘贴 XML 或 HTML 内容..."></textarea>
          </div>
          <div>
            <div class="label">查询结果</div>
            <textarea v-model="output" rows="14" readonly class="code-area output"></textarea>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const xpath = ref('//title'), xmlInput = ref(''), output = ref('')

function evaluate() {
  if (!xpath.value.trim() || !xmlInput.value.trim()) { alert('请输入 XML 内容和 XPath 表达式'); return }
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(xmlInput.value, 'text/xml')
    const parseError = doc.querySelector('parseerror')
    if (parseError) {
      // 尝试作为 HTML 解析
      const htmlDoc = parser.parseFromString(xmlInput.value, 'text/html')
      const result = htmlDoc.evaluate(xpath.value, htmlDoc, null, XPathResult.ANY_TYPE, null)
      const items = []
      let node = result.iterateNext()
      while (node) {
        items.push(node.textContent || node.nodeValue || new XMLSerializer().serializeToString(node))
        node = result.iterateNext()
      }
      output.value = items.length ? items.join('\n---\n') : '未找到匹配节点'
    } else {
      const result = doc.evaluate(xpath.value, doc, null, XPathResult.ANY_TYPE, null)
      const items = []
      if (result.resultType === XPathResult.STRING_TYPE) {
        items.push(result.stringValue)
      } else if (result.resultType === XPathResult.NUMBER_TYPE) {
        items.push(String(result.numberValue))
      } else if (result.resultType === XPathResult.BOOLEAN_TYPE) {
        items.push(String(result.booleanValue))
      } else {
        let node = result.iterateNext()
        while (node) {
          items.push(new XMLSerializer().serializeToString(node))
          node = result.iterateNext()
        }
      }
      output.value = items.length ? items.join('\n---\n') : '未找到匹配节点'
    }
  } catch(e) { output.value = '执行出错: ' + e.message }
}
function clear() { xmlInput.value = ''; output.value = ''; xpath.value = '//title' }
function loadSample() {
  xpath.value = '//book/title'
  xmlInput.value = `<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book category="cooking">
    <title lang="en">Everyday Italian</title>
    <author>Giada De Laurentiis</author>
    <year>2005</year>
    <price>30.00</price>
  </book>
  <book category="children">
    <title lang="en">Harry Potter</title>
    <author>J K. Rowling</author>
    <year>2005</year>
    <price>29.99</price>
  </book>
  <book category="web">
    <title lang="en">Learning XML</title>
    <author>Erik T. Ray</author>
    <year>2003</year>
    <price>39.95</price>
  </book>
</bookstore>`
}
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 12px; }
.toolbar { display: flex; gap: 8px; flex-wrap: wrap; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.input-group { display: flex; flex-direction: column; gap: 4px; }
.label { font-size: 12px; color: #666; font-weight: 600; margin-bottom: 4px; }
.xpath-input { width: 100%; padding: 8px 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: monospace; font-size: 14px; box-sizing: border-box; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.code-area { width: 100%; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: monospace; font-size: 13px; resize: vertical; box-sizing: border-box; }
.output { background: #f6f8fa; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
