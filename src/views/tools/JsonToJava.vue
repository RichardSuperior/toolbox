<template>
  <ToolLayout title="JSON 生成 Java 实体类" subtitle="将 JSON 对象自动转换为 Java 实体类代码" icon="☕">
    <div class="card p-6 mb-4">
      <div class="flex flex-wrap gap-2 mb-4">
        <button @click="generate" class="btn-primary text-sm">☕ 生成实体类</button>
        <button @click="copyResult" class="btn-secondary text-sm">复制代码</button>
        <label class="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] cursor-pointer">
          <input type="checkbox" v-model="usePascal" class="rounded" /> PascalCase
        </label>
        <label class="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] cursor-pointer">
          <input type="checkbox" v-model="lombok" class="rounded" /> 使用 Lombok
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
          <label class="text-sm font-medium text-[var(--text-secondary)] block mb-2">生成的 Java 代码</label>
          <textarea v-model="javaCode" rows="18" readonly class="input-base w-full font-mono text-sm resize-none bg-[var(--bg-secondary)]"
            placeholder="生成的 Java 实体类代码..."></textarea>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const jsonInput = ref('')
const javaCode = ref('')
const rootName = ref('Root')
const usePascal = ref(true)
const lombok = ref(true)

function toPascal(str) {
  return str.replace(/_(\w)/g, (_, c) => c.toUpperCase()).replace(/^\w/, c => c.toUpperCase())
}

function getJavaType(value) {
  if (value === null) return 'Object'
  if (Array.isArray(value)) {
    const inner = value.length > 0 ? getJavaType(value[0]) : 'Object'
    return 'List<' + inner + '>'
  }
  const t = typeof value
  if (t === 'number') return Number.isInteger(value) ? 'Integer' : 'Double'
  if (t === 'boolean') return 'Boolean'
  if (t === 'string') return 'String'
  if (t === 'object') return 'Object'
  return 'Object'
}

function generate() {
  try {
    const obj = JSON.parse(jsonInput.value)
    const lines = []

    if (lombok.value) {
      lines.push('import lombok.Data;')
      lines.push('import lombok.NoArgsConstructor;')
      lines.push('import lombok.AllArgsConstructor;')
      lines.push('import java.util.List;')
      lines.push('')
      lines.push('@Data')
      lines.push('@NoArgsConstructor')
      lines.push('@AllArgsConstructor')
    } else {
      lines.push('import java.util.List;')
      lines.push('')
    }
    lines.push('public class ' + rootName.value + ' {')

    Object.keys(obj).forEach(key => {
      const fieldName = usePascal.value ? toPascal(key) : key
      const type = getJavaType(obj[key])
      lines.push('    private ' + type + ' ' + fieldName + ';')
      if (!lombok.value) {
        lines.push('    public ' + type + ' get' + toPascal(fieldName) + '() { return ' + fieldName + '; }')
        lines.push('    public void set' + toPascal(fieldName) + '(' + type + ' ' + fieldName + ') { this.' + fieldName + ' = ' + fieldName + '; }')
      }
    })
    lines.push('}')
    javaCode.value = lines.join('\n')
  } catch (e) {
    alert('❌ JSON 解析错误: ' + e.message)
  }
}

function copyResult() {
  if (!javaCode.value) return
  navigator.clipboard.writeText(javaCode.value).then(() => alert('✅ 已复制'))
}
</script>
