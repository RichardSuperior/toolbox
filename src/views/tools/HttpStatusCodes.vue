<template>
  <ToolLayout title="HTTP 状态码">
    <div class="http-status">
      <div class="tabs">
        <button v-for="cat in categories" :key="cat.code" class="tab" :class="{ active: activeTab === cat.code }" @click="activeTab = cat.code">
          {{ cat.label }} ({{ statusCodes.filter(s => s.code.toString().startsWith(cat.code)).length }})
        </button>
      </div>
      <div class="grid">
        <div class="card" v-for="s in filtered" :key="s.code">
          <div class="code" :style="{ background: s.color }">{{ s.code }}</div>
          <div class="info">
            <div class="name">{{ s.name }}</div>
            <div class="desc">{{ s.desc }}</div>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const activeTab = ref('2')
const categories = [
  { code: '1', label: '1xx 信息' }, { code: '2', label: '2xx 成功' },
  { code: '3', label: '3xx 重定向' }, { code: '4', label: '4xx 客户端错误' },
  { code: '5', label: '5xx 服务器错误' },
]
const statusCodes = [
  { code: 100, name: 'Continue', desc: '继续，服务器已收到请求头', color: '#3498db' },
  { code: 101, name: 'Switching Protocols', desc: '切换协议', color: '#3498db' },
  { code: 200, name: 'OK', desc: '请求成功', color: '#27ae60' },
  { code: 201, name: 'Created', desc: '资源已创建', color: '#27ae60' },
  { code: 204, name: 'No Content', desc: '无内容（成功但无返回体）', color: '#27ae60' },
  { code: 206, name: 'Partial Content', desc: '部分内容', color: '#27ae60' },
  { code: 301, name: 'Moved Permanently', desc: '永久重定向', color: '#f39c12' },
  { code: 302, name: 'Found', desc: '临时重定向', color: '#f39c12' },
  { code: 304, name: 'Not Modified', desc: '未修改（使用缓存）', color: '#f39c12' },
  { code: 307, name: 'Temporary Redirect', desc: '临时重定向（保持方法）', color: '#f39c12' },
  { code: 400, name: 'Bad Request', desc: '请求语法错误', color: '#e74c3c' },
  { code: 401, name: 'Unauthorized', desc: '未授权（需登录）', color: '#e74c3c' },
  { code: 403, name: 'Forbidden', desc: '禁止访问', color: '#e74c3c' },
  { code: 404, name: 'Not Found', desc: '资源不存在', color: '#e74c3c' },
  { code: 405, name: 'Method Not Allowed', desc: '请求方法不允许', color: '#e74c3c' },
  { code: 408, name: 'Request Timeout', desc: '请求超时', color: '#e74c3c' },
  { code: 409, name: 'Conflict', desc: '请求冲突', color: '#e74c3c' },
  { code: 429, name: 'Too Many Requests', desc: '请求过于频繁', color: '#e74c3c' },
  { code: 500, name: 'Internal Server Error', desc: '服务器内部错误', color: '#8e44ad' },
  { code: 502, name: 'Bad Gateway', desc: '网关错误', color: '#8e44ad' },
  { code: 503, name: 'Service Unavailable', desc: '服务不可用', color: '#8e44ad' },
  { code: 504, name: 'Gateway Timeout', desc: '网关超时', color: '#8e44ad' },
]
const filtered = computed(() => statusCodes.filter(s => s.code.toString().startsWith(activeTab.value)))
</script>

<style scoped>
.http-status { display: flex; flex-direction: column; gap: 16px; }
.tabs { display: flex; gap: 6px; flex-wrap: wrap; }
.tab { padding: 6px 12px; background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 6px; cursor: pointer; font-size: 13px; transition: all 0.2s; }
.tab.active { background: #0969da; color: white; border-color: #0969da; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 8px; }
.card { display: flex; gap: 12px; background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 12px; align-items: center; }
.code { min-width: 50px; height: 50px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 16px; }
.info { flex: 1; }
.name { font-weight: 600; font-size: 13px; color: #24292f; }
.desc { font-size: 12px; color: #666; margin-top: 2px; }
</style>
