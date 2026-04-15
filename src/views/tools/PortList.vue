<template>
  <ToolLayout title="常见端口大全">
    <div class="port-list">
      <div class="search"><input v-model="kw" class="search-input" placeholder="搜索端口或服务..." /></div>
      <div class="grid">
        <div class="card" v-for="p in filtered" :key="p.port">
          <div class="port-num">{{ p.port }}</div>
          <div class="port-name">{{ p.name }}</div>
          <div class="port-desc">{{ p.desc }}</div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const kw = ref('')
const ports = [
  { port: 21, name: 'FTP', desc: '文件传输协议' }, { port: 22, name: 'SSH', desc: '安全Shell' },
  { port: 23, name: 'Telnet', desc: '远程登录协议' }, { port: 25, name: 'SMTP', desc: '简单邮件传输协议' },
  { port: 53, name: 'DNS', desc: '域名系统' }, { port: 80, name: 'HTTP', desc: '超文本传输协议' },
  { port: 110, name: 'POP3', desc: '邮件协议v3' }, { port: 143, name: 'IMAP', desc: '邮件访问协议' },
  { port: 443, name: 'HTTPS', desc: '安全超文本传输协议' }, { port: 465, name: 'SMTPS', desc: 'SMTP安全端口' },
  { port: 587, name: 'SMTP', desc: '邮件提交端口' }, { port: 993, name: 'IMAPS', desc: 'IMAP安全端口' },
  { port: 995, name: 'POP3S', desc: 'POP3安全端口' }, { port: 1433, name: 'MSSQL', desc: 'SQL Server数据库' },
  { port: 1521, name: 'Oracle', desc: 'Oracle数据库' }, { port: 3306, name: 'MySQL', desc: 'MySQL数据库' },
  { port: 3389, name: 'RDP', desc: 'Windows远程桌面' }, { port: 5432, name: 'PostgreSQL', desc: 'PostgreSQL数据库' },
  { port: 6379, name: 'Redis', desc: 'Redis数据库' }, { port: 8080, name: 'HTTP Alt', desc: 'HTTP替代端口' },
  { port: 8443, name: 'HTTPS Alt', desc: 'HTTPS替代端口' }, { port: 27017, name: 'MongoDB', desc: 'MongoDB数据库' },
  { port: 5672, name: 'RabbitMQ', desc: 'RabbitMQ消息队列' }, { port: 9092, name: 'Kafka', desc: 'Kafka消息队列' },
]
const filtered = computed(() => {
  if (!kw.value) return ports
  const k = kw.value.toLowerCase()
  return ports.filter(p => String(p.port).includes(k) || p.name.toLowerCase().includes(k) || p.desc.includes(k))
})
</script>

<style scoped>
.port-list { display: flex; flex-direction: column; gap: 12px; }
.search-input { width: 100%; padding: 10px 14px; border: 1px solid #d0d7de; border-radius: 8px; font-size: 14px; box-sizing: border-box; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px; }
.card { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 12px; }
.port-num { font-weight: 700; font-size: 18px; color: #0969da; }
.port-name { font-size: 13px; font-weight: 600; color: #24292f; }
.port-desc { font-size: 12px; color: #666; margin-top: 2px; }
</style>
