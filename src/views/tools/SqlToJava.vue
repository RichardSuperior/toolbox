<template>
  <ToolLayout title="SQL 转 Java 实体类">
    <div class="sql-java">
      <div class="tool-bar">
        <button class="btn" @click="generate">生成实体类</button>
        <input v-model="tableName" class="table-input" placeholder="表名（如：user_info）" />
        <button class="btn btn-outline" @click="copyResult">复制代码</button>
      </div>
      <div class="editor-wrap">
        <div class="input-wrap">
          <div class="label">输入 SQL 建表语句</div>
          <textarea v-model="sqlInput" class="code-area" placeholder="CREATE TABLE user_info (
  id BIGINT PRIMARY KEY,
  user_name VARCHAR(50),
  age INT,
  created_at DATETIME
);"></textarea>
        </div>
        <div class="output-wrap">
          <div class="label">生成的 Java 代码</div>
          <textarea v-model="javaCode" class="code-area" readonly placeholder="生成的 Java 实体类代码..."></textarea>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const sqlInput = ref('')
const javaCode = ref('')
const tableName = ref('UserEntity')

function toPascal(str) {
  return str.replace(/_(\w)/g, (_, c) => c.toUpperCase()).replace(/^\w/, c => c.toUpperCase())
}

function sqlToJavaType(sqlType) {
  const t = sqlType.toUpperCase()
  if (/INT|INT4/.test(t)) return 'Integer'
  if (/BIGINT|INT8/.test(t)) return 'Long'
  if (/FLOAT|FLOAT4/.test(t)) return 'Float'
  if (/DOUBLE|DECIMAL|NUMERIC|REAL/.test(t)) return 'Double'
  if (/VARCHAR|TEXT|CHAR|STRING/.test(t)) return 'String'
  if (/DATETIME|TIMESTAMP|DATE/.test(t)) return 'LocalDateTime'
  if (/TIME/.test(t)) return 'LocalTime'
  if (/BOOL|BIT/.test(t)) return 'Boolean'
  if (/BLOB|BINARY/.test(t)) return 'byte[]'
  return 'Object'
}

function generate() {
  const sql = sqlInput.value
  const regex = /(\w+)\s+(VARCHAR|TEXT|INT|BIGINT|FLOAT|DOUBLE|DECIMAL|NUMERIC|REAL|CHAR|DATETIME|TIMESTAMP|DATE|TIME|BOOL|BIT|BLOB|BINARY|VARBINARY|NVARCHAR)(?:\([^)]+\))?/gi
  const matches = [...sql.matchAll(regex)]
  if (matches.length === 0) { alert('❌ 未找到有效的字段定义'); return }

  const className = tableName.value || 'Entity'
  const lines = ['import lombok.Data;', 'import lombok.NoArgsConstructor;', 'import lombok.AllArgsConstructor;', 'import java.time.LocalDateTime;', '', `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`, `public class ${className}`, '{']

  matches.forEach((match) => {
    const colName = match[1]
    const sqlType = match[2]
    const fieldName = toPascal(colName)
    const javaType = sqlToJavaType(sqlType)
    lines.push(`    private ${javaType} ${fieldName};`)
  })

  lines.push('}')
  javaCode.value = lines.join('\n')
}

function copyResult() {
  if (!javaCode.value) return
  navigator.clipboard.writeText(javaCode.value).then(() => alert('✅ 已复制'))
}
</script>

<style scoped>
.sql-java { display: flex; flex-direction: column; gap: 12px; }
.tool-bar { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn:hover { background: #0860ca; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.btn-outline:hover { background: #f6f8fa; }
.table-input { padding: 6px 10px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 13px; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.label { font-weight: 600; font-size: 14px; color: #24292f; margin-bottom: 6px; }
.code-area { width: 100%; min-height: 350px; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 13px; resize: vertical; background: #f6f8fa; box-sizing: border-box; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
