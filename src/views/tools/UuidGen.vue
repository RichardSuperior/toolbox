<template>
  <ToolLayout title="UuidGen">
    <div class="uuid-gen">
      <div class="tool-bar">
        <button class="btn" @click="generate">生成 UUID</button>
        <button class="btn" @click="bulkGenerate">批量生成</button>
        <select v-model="count" class="sel">
          <option value="5">5个</option>
          <option value="10">10个</option>
          <option value="20">20个</option>
        </select>
        <button class="btn btn-outline" @click="copyAll">复制全部</button>
      </div>
      <div class="result-list">
        <div class="result-item" v-for="(uuid, i) in uuids" :key="i" @click="copyOne(uuid)">
          <span class="uuid-text">{{ uuid }}</span>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const uuids = ref([]), count = ref(5)

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

function generate() { uuids.value = [generateUUID()] }
function bulkGenerate() { uuids.value = Array.from({ length: Number(count.value) }, generateUUID) }
function copyOne(u) { navigator.clipboard.writeText(u).then(() => alert('已复制: ' + u)) }
function copyAll() { if (!uuids.value.length) return; navigator.clipboard.writeText(uuids.value.join('\n')).then(() => alert('已复制全部')) }
</script>

<style scoped>
.uuid-gen { display: flex; flex-direction: column; gap: 12px; }
.tool-bar { display: flex; gap: 8px; flex-wrap: wrap; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.sel { padding: 6px 8px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 13px; background: white; }
.result-list { display: flex; flex-direction: column; gap: 4px; }
.result-item { padding: 10px 14px; background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
.result-item:hover { background: #eaeef2; }
.uuid-text { font-family: 'Fira Code', monospace; font-size: 13px; color: #0969da; }
</style>
