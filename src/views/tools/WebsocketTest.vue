<template>
  <ToolLayout title="WebSocket 测试">
    <div class="ws-test">
      <div class="conn-bar">
        <input v-model="url" class="url-input" placeholder="ws://localhost:8080" />
        <button class="btn" @click="connect">{{ connected ? '断开' : '连接' }}</button>
      </div>
      <div class="send-bar" v-if="connected">
        <input v-model="sendMsg" class="send-input" placeholder="发送消息..." @keyup.enter="send" />
        <button class="btn" @click="send">发送</button>
      </div>
      <div class="log-box">
        <div v-for="(msg, i) in logs" :key="i" class="log-item" :class="msg.type">
          <span class="log-time">{{ msg.time }}</span>
          <span class="log-text">{{ msg.text }}</span>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const url = ref('ws://echo.websocket.org'), connected = ref(false), sendMsg = ref(''), logs = ref([]), ws = ref(null)

function addLog(text, type = 'info') {
  const now = new Date()
  logs.value.push({ text, type, time: `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}` })
}

function connect() {
  if (connected.value) { ws.value?.close(); return }
  try {
    ws.value = new WebSocket(url.value)
    ws.value.onopen = () => { connected.value = true; addLog('✅ 连接成功', 'success') }
    ws.value.onmessage = (e) => addLog('📥 收到: ' + e.data, 'received')
    ws.value.onerror = () => addLog('❌ 连接错误', 'error')
    ws.value.onclose = () => { connected.value = false; addLog('🔌 连接已断开', 'info') }
  } catch (e) { addLog('❌ 错误: ' + e.message, 'error') }
}

function send() {
  if (!sendMsg.value || !connected.value) return
  ws.value?.send(sendMsg.value)
  addLog('📤 发送: ' + sendMsg.value, 'sent')
  sendMsg.value = ''
}

onUnmounted(() => ws.value?.close())
</script>

<style scoped>
.ws-test { display: flex; flex-direction: column; gap: 12px; }
.conn-bar, .send-bar { display: flex; gap: 8px; }
.url-input, .send-input { flex: 1; padding: 8px 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 14px; }
.btn { padding: 8px 16px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
.log-box { background: #1e1e1e; border-radius: 8px; padding: 12px; min-height: 300px; max-height: 400px; overflow-y: auto; }
.log-item { display: flex; gap: 8px; margin-bottom: 6px; font-family: 'Fira Code', monospace; font-size: 12px; }
.log-time { color: #888; flex-shrink: 0; }
.log-text { color: #d4d4d4; word-break: break-all; }
.info { color: #888; }
.success { color: #4ec9b0; }
.error { color: #f14c4c; }
.sent { color: #dcdcaa; }
.received { color: #ce9178; }
</style>
