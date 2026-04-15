<template>
  <ToolLayout title="GUID 在线生成">
    <div class="guid-gen">
      <div class="tool-bar">
        <button class="btn" @click="generate">生成</button>
        <button class="btn btn-outline" @click="copy">复制</button>
      </div>
      <div class="result">{{ guid || '点击按钮生成' }}</div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const guid = ref('')
function generate() {
  guid.value = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}
function copy() { if (!guid.value) return; navigator.clipboard.writeText(guid.value).then(() => alert('已复制')) }
</script>

<style scoped>
.guid-gen { display: flex; flex-direction: column; gap: 16px; }
.tool-bar { display: flex; gap: 8px; }
.btn { padding: 8px 16px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.result { padding: 16px; background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; font-family: 'Fira Code', monospace; font-size: 18px; color: #0969da; text-align: center; word-break: break-all; }
</style>
