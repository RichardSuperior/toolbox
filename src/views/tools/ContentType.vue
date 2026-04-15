<template>
  <ToolLayout title="Content-Type 对照表">
    <div class="ct-list">
      <div class="grid">
        <div class="row header"><span>文件类型</span><span>MIME Type</span></div>
        <div class="row" v-for="ct in ctList" :key="ct.mime"><span>{{ ct.type }}</span><span class="mono">{{ ct.mime }}</span></div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import ToolLayout from '../../components/ToolLayout.vue'
const ctList = [
  { type: 'HTML', mime: 'text/html' }, { type: '纯文本', mime: 'text/plain' },
  { type: 'CSS', mime: 'text/css' }, { type: 'JavaScript', mime: 'application/javascript' },
  { type: 'JSON', mime: 'application/json' }, { type: 'XML', mime: 'application/xml' },
  { type: 'PDF', mime: 'application/pdf' }, { type: 'ZIP', mime: 'application/zip' },
  { type: 'Gzip', mime: 'application/gzip' }, { type: '表单数据', mime: 'application/x-www-form-urlencoded' },
  { type: 'Multipart', mime: 'multipart/form-data' }, { type: 'PNG 图片', mime: 'image/png' },
  { type: 'JPEG 图片', mime: 'image/jpeg' }, { type: 'GIF 图片', mime: 'image/gif' },
  { type: 'SVG', mime: 'image/svg+xml' }, { type: 'WebP', mime: 'image/webp' },
  { type: 'MP3 音频', mime: 'audio/mpeg' }, { type: 'WAV 音频', mime: 'audio/wav' },
  { type: 'MP4 视频', mime: 'video/mp4' }, { type: 'WebM 视频', mime: 'video/webm' },
  { type: 'CSV', mime: 'text/csv' }, { type: 'Excel', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  { type: 'Word', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { type: '字体 WOFF', mime: 'font/woff' }, { type: '字体 WOFF2', mime: 'font/woff2' },
]
</script>

<style scoped>
.ct-list { display: flex; flex-direction: column; gap: 12px; }
.grid { border: 1px solid #d0d7de; border-radius: 8px; overflow: hidden; }
.row { display: grid; grid-template-columns: 1fr 2fr; padding: 8px 14px; border-bottom: 1px solid #d0d7de; font-size: 13px; }
.row:last-child { border-bottom: none; }
.header { background: #f6f8fa; font-weight: 600; }
.mono { font-family: 'Fira Code', monospace; color: #0969da; font-size: 12px; word-break: break-all; }
</style>
