<template>
  <ToolLayout title="JSON 生成 C# 实体类" subtitle="将 JSON 对象自动转换为 C# 实体类代码" icon="🔷">
    <div class="card p-6 mb-4">
      <div class="flex flex-wrap gap-2 mb-4">
        <button @click="generate" class="btn-primary text-sm">🔷 生成实体类</button>
        <button @click="copyResult" class="btn-secondary text-sm">复制代码</button>
        <label class="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] cursor-pointer">
          <input type="checkbox" v-model="usePascal" class="rounded" /> PascalCase
        </label>
        <label class="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] cursor-pointer">
          <input type="checkbox" v-model="nullable" class="rounded" /> 可空类型
        </label>
        <select v-model="rootName" class="input-base py-1.5 px-2 text-sm w-28">
          <option value="Root">Root</option>
          <option value="Response">Response</option>
          <option value="Data">Data</option>
          <option value="Result">Result</option>
        </select>
      </div>
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="text-sm font-medium text-[var(--text-secondary)] block mb-2">输入 JSON</label>
          <textarea v-model="jsonInput" rows="18" class="input-base w-full font-mono text-sm resize-none"
            placeholder='{"name":"张三","age":25,"email":"test@example.com"}'></textarea>
        </div>
        <div>
          <label class="text-sm font-medium text-[var(--text-secondary)] block mb-2">生成的 C# 代码</label>
          <textarea v-model="csharpCode" rows="18" readonly class="input-base w-full font-mono text-sm resize-none bg-[var(--bg-secondary)]"
            placeholder="生成的 C# 实体类代码..."></textarea>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const jsonInput = ref('')
const csharpCode = ref('')
const rootName = ref('Root')
const usePascal = ref(true)
const nullable = ref(false)

function toPascal(str) {
  return str.replace(/_(\w)/g, (_, c) => c.toUpperCase()).replace(/^\w/, c => c.toUpperCase())
}

function getCSharpType(value, nullRef) {
  if (value === null) return nullRef ? 'object?' : 'object'
  if (Array.isArray(value)) {
    const inner = value.length > 0 ? getCSharpType(value[0], nullRef) : 'object'
    return 'List<' + inner + '>'
  }
  const t = typeof value
  if (t === 'number') return Number.isInteger(value) ? (nullRef ? 'int?' : 'int') : (nullRef ? 'double?' : 'double')
  if (t === 'boolean') return nullRef ? 'bool?' : 'bool'
  if (t === 'string') return 'string'
  if (t === 'object') return 'object'
  return 'object'
}

function generate() {
  try {
    const obj = JSON.parse(jsonInput.value)
    const lines = []
    const nullRef = nullable.value

    function processObj(o, className) {
      lines.push('public class ' + className)
      lines.push('{')
      Object.keys(o).forEach(key => {
        const propName = usePascal.value ? toPascal(key) : key
        const type = getCSharpType(o[key], nullRef)
        lines.push('    public ' + type + ' ' + propName + ' { get; set; }')
      })
      lines.push('}')
    }

    processObj(obj, rootName.value)
    csharpCode.value = lines.join('\n')
  } catch (e) {
    alert('❌ JSON 解析错误: ' + e.message)
  }
}

function copyResult() {
  if (!csharpCode.value) return
  navigator.clipboard.writeText(csharpCode.value).then(() => alert('✅ 已复制'))
}
</script>
