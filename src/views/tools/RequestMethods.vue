<template>
  <ToolLayout title="HTTP 请求方法参考">
    <div class="tool-wrap">
      <div class="search-bar">
        <input v-model="keyword" class="search-input" placeholder="搜索请求方法..." />
      </div>
      <div class="methods-list">
        <div v-for="m in filtered" :key="m.name" class="method-card">
          <div class="method-header">
            <span class="method-badge" :class="m.name.toLowerCase()">{{ m.name }}</span>
            <span class="method-brief">{{ m.brief }}</span>
            <div class="method-tags">
              <span class="tag" v-if="m.safe">安全</span>
              <span class="tag" v-if="m.idempotent">幂等</span>
              <span class="tag cacheable" v-if="m.cacheable">可缓存</span>
            </div>
          </div>
          <div class="method-desc">{{ m.desc }}</div>
          <div class="method-example"><strong>示例：</strong><code>{{ m.example }}</code></div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const keyword = ref('')
const methods = [
  { name: 'GET', brief: '获取资源', safe: true, idempotent: true, cacheable: true, desc: '请求服务器发送指定资源。GET 请求只应用于获取数据，不应产生副作用。参数通过 URL 查询字符串传递。', example: 'GET /api/users?page=1 HTTP/1.1' },
  { name: 'POST', brief: '提交数据', safe: false, idempotent: false, cacheable: false, desc: '向服务器提交实体，通常用于创建新资源或提交表单。每次调用可能创建不同的资源，因此不是幂等的。', example: 'POST /api/users HTTP/1.1\nContent-Type: application/json' },
  { name: 'PUT', brief: '替换资源', safe: false, idempotent: true, cacheable: false, desc: '用请求负载替换目标资源的所有当前表示。通常用于更新现有资源，需要提供完整的资源数据。', example: 'PUT /api/users/123 HTTP/1.1' },
  { name: 'PATCH', brief: '部分更新', safe: false, idempotent: false, cacheable: false, desc: '对资源应用部分更新，只需提供需要修改的字段，而不必提交完整的资源数据。', example: 'PATCH /api/users/123 HTTP/1.1' },
  { name: 'DELETE', brief: '删除资源', safe: false, idempotent: true, cacheable: false, desc: '删除指定的资源。成功删除后通常返回 204 No Content 或 200 OK。', example: 'DELETE /api/users/123 HTTP/1.1' },
  { name: 'HEAD', brief: '获取响应头', safe: true, idempotent: true, cacheable: true, desc: '与 GET 相同，但只请求头部信息，不返回响应体。常用于检测资源是否存在或查看响应头。', example: 'HEAD /api/users HTTP/1.1' },
  { name: 'OPTIONS', brief: '获取支持的方法', safe: true, idempotent: true, cacheable: false, desc: '描述目标资源的通信选项，常用于 CORS 预检请求，了解服务器支持哪些请求方法。', example: 'OPTIONS /api/users HTTP/1.1' },
  { name: 'CONNECT', brief: '建立隧道', safe: false, idempotent: false, cacheable: false, desc: '建立到目标资源的隧道，通常用于 HTTPS 代理和 WebSocket 升级。', example: 'CONNECT example.com:443 HTTP/1.1' },
  { name: 'TRACE', brief: '回环测试', safe: true, idempotent: true, cacheable: false, desc: '沿着到目标资源的路径执行消息回环测试，用于诊断目的。出于安全原因通常被禁用。', example: 'TRACE / HTTP/1.1' },
]
const filtered = computed(() => {
  const k = keyword.value.toLowerCase()
  return k ? methods.filter(m => m.name.toLowerCase().includes(k) || m.brief.includes(k) || m.desc.includes(k)) : methods
})
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 12px; }
.search-input { width: 100%; padding: 8px 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 14px; }
.methods-list { display: flex; flex-direction: column; gap: 10px; }
.method-card { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 14px 16px; }
.method-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; flex-wrap: wrap; }
.method-badge { padding: 4px 12px; border-radius: 6px; font-weight: 700; font-size: 14px; font-family: monospace; }
.method-badge.get { background: #dafbe1; color: #1a7f37; }
.method-badge.post { background: #fff8c5; color: #9a6700; }
.method-badge.put { background: #ddf4ff; color: #0550ae; }
.method-badge.patch { background: #fbefff; color: #8250df; }
.method-badge.delete { background: #ffebe9; color: #cf222e; }
.method-badge.head, .method-badge.options, .method-badge.connect, .method-badge.trace { background: #f0f0f0; color: #444; }
.method-brief { font-weight: 600; font-size: 14px; }
.method-tags { display: flex; gap: 6px; margin-left: auto; }
.tag { padding: 2px 8px; background: #eef1f5; border-radius: 10px; font-size: 11px; color: #555; }
.tag.cacheable { background: #dafbe1; color: #1a7f37; }
.method-desc { font-size: 13px; color: #555; line-height: 1.6; margin-bottom: 6px; }
.method-example { font-size: 13px; }
code { background: #1e1e1e; color: #d4d4d4; padding: 3px 8px; border-radius: 4px; font-family: monospace; font-size: 12px; }
</style>
