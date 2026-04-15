<template>
  <ToolLayout title="键盘键码查询">
    <div class="tool-wrap">
      <div class="search-bar">
        <input v-model="keyword" class="search-input" placeholder="搜索键名或键码值..." />
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>键名</th><th>KeyCode</th><th>Key</th><th>说明</th></tr></thead>
          <tbody>
            <tr v-for="k in filtered" :key="k.code">
              <td>{{ k.name }}</td>
              <td><code>{{ k.code }}</code></td>
              <td><code>{{ k.key }}</code></td>
              <td>{{ k.desc }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const keyword = ref('')
const keys = [
  { name: 'Backspace', code: 8, key: 'Backspace', desc: '退格键' },
  { name: 'Tab', code: 9, key: 'Tab', desc: 'Tab 键' },
  { name: 'Enter', code: 13, key: 'Enter', desc: '回车键' },
  { name: 'Shift', code: 16, key: 'Shift', desc: 'Shift 键' },
  { name: 'Ctrl', code: 17, key: 'Control', desc: 'Ctrl 键' },
  { name: 'Alt', code: 18, key: 'Alt', desc: 'Alt 键' },
  { name: 'Pause', code: 19, key: 'Pause', desc: '暂停键' },
  { name: 'CapsLock', code: 20, key: 'CapsLock', desc: '大写锁定' },
  { name: 'Escape', code: 27, key: 'Escape', desc: 'Esc 键' },
  { name: 'Space', code: 32, key: ' ', desc: '空格键' },
  { name: 'PageUp', code: 33, key: 'PageUp', desc: '上翻页' },
  { name: 'PageDown', code: 34, key: 'PageDown', desc: '下翻页' },
  { name: 'End', code: 35, key: 'End', desc: 'End 键' },
  { name: 'Home', code: 36, key: 'Home', desc: 'Home 键' },
  { name: 'ArrowLeft', code: 37, key: 'ArrowLeft', desc: '左箭头' },
  { name: 'ArrowUp', code: 38, key: 'ArrowUp', desc: '上箭头' },
  { name: 'ArrowRight', code: 39, key: 'ArrowRight', desc: '右箭头' },
  { name: 'ArrowDown', code: 40, key: 'ArrowDown', desc: '下箭头' },
  { name: 'Insert', code: 45, key: 'Insert', desc: 'Insert 键' },
  { name: 'Delete', code: 46, key: 'Delete', desc: 'Delete 键' },
  ...Array.from({length:10},(_,i)=>({ name:`${i}`, code: 48+i, key:`${i}`, desc:`数字 ${i}` })),
  ...Array.from({length:26},(_,i)=>({ name: String.fromCharCode(65+i), code: 65+i, key: String.fromCharCode(65+i), desc: `字母 ${String.fromCharCode(65+i)}` })),
  ...Array.from({length:12},(_,i)=>({ name:`F${i+1}`, code: 112+i, key:`F${i+1}`, desc:`功能键 F${i+1}` })),
  { name: 'NumLock', code: 144, key: 'NumLock', desc: '数字锁定' },
  { name: 'ScrollLock', code: 145, key: 'ScrollLock', desc: '滚动锁定' },
  { name: ';', code: 186, key: ';', desc: '分号' },
  { name: '=', code: 187, key: '=', desc: '等号' },
  { name: ',', code: 188, key: ',', desc: '逗号' },
  { name: '-', code: 189, key: '-', desc: '减号' },
  { name: '.', code: 190, key: '.', desc: '句点' },
  { name: '/', code: 191, key: '/', desc: '斜杠' },
  { name: '`', code: 192, key: '`', desc: '反引号' },
  { name: '[', code: 219, key: '[', desc: '左方括号' },
  { name: '\\', code: 220, key: '\\', desc: '反斜杠' },
  { name: ']', code: 221, key: ']', desc: '右方括号' },
  { name: "'", code: 222, key: "'", desc: '单引号' },
]
const filtered = computed(() => {
  const k = keyword.value.toLowerCase()
  return k ? keys.filter(i => i.name.toLowerCase().includes(k) || String(i.code).includes(k) || i.desc.includes(k)) : keys
})
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 12px; }
.search-input { width: 100%; padding: 8px 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 14px; }
.table-wrap { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th, .data-table td { padding: 7px 12px; border: 1px solid #d0d7de; text-align: left; }
.data-table th { background: #f6f8fa; font-weight: 600; }
.data-table tr:hover { background: #f0f6ff; }
code { background: #eef1f5; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
</style>
