<template>
  <ToolLayout title="特殊符号大全">
    <div class="symbols">
      <div class="category" v-for="cat in categories" :key="cat.name">
        <h3 class="cat-title">{{ cat.name }}</h3>
        <div class="symbol-grid">
          <div class="sym-item" v-for="sym in cat.symbols" :key="sym" @click="copy(sym)">
            <span class="sym-char">{{ sym }}</span>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import ToolLayout from '../../components/ToolLayout.vue'
const categories = [
  { name: '❤ 爱心符号', symbols: ['❤', '♥', '💕', '💖', '💗', '💓', '💞', '💘', '💝', '❣', '♡', '💙', '💚', '💛', '🧡', '💜', '🖤', '🤍', '🤎'] },
  { name: '⭐ 星星月亮', symbols: ['⭐', '🌟', '✨', '💫', '🌙', '🌛', '🌜', '🌝', '🌚', '🌞', '☀', '⚡', '🔥', '🌈', '☁', '⛅', '🌤️'] },
  { name: '💬 表情符号', symbols: ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '🥰', '😘', '😗', '😙', '😚', '🙂'] },
  { name: '☎ 通讯符号', symbols: ['📞', '📱', '📧', '✉', '📩', '📬', '📭', '📮', '📯', '📜', '📃', '📑', '🔖', '🏷', '📦', '📫', '📮'] },
  { name: '🔣 数学符号', symbols: ['+', '-', '×', '÷', '=', '≠', '≈', '∞', '√', '∑', '∏', '∫', '∂', '∆', '∇', '∈', '∉', '⊂', '⊃', '∪', '∩'] },
  { name: '♪ 音乐符号', symbols: ['♪', '♫', '♬', '♩', '𝄞', '𝄢', '🎵', '🎶', '🎼', '🎸', '🎹', '🎺', '🎻', '🥁', '🎤', '🎧', '🎷', '🎵'] },
  { name: '🏆 奖杯运动', symbols: ['🏆', '🥇', '🥈', '🥉', '🏅', '🎖', '⚽', '🏀', '⚾', '🎾', '🏐', '🏉', '🏓', '🏸', '🥊', '⛳', '🎣'] },
  { name: '🌐 箭头符号', symbols: ['←', '→', '↑', '↓', '↔', '↕', '⇐', '⇒', '⇑', '⇓', '⇔', '⇕', '➔', '➜', '➝', '➞', '➟', '➠'] },
]

function copy(sym) {
  navigator.clipboard.writeText(sym).then(() => {
    const el = document.createElement('span')
    el.textContent = '✅'
    el.style.cssText = 'position:fixed;top:50%;left:50%;background:#0969da;color:white;padding:8px 16px;border-radius:8px;font-size:14px;transform:translate(-50%,-50%);z-index:9999'
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 1000)
  })
}
</script>

<style scoped>
.symbols { display: flex; flex-direction: column; gap: 20px; }
.cat-title { font-size: 15px; font-weight: 600; color: #24292f; margin-bottom: 8px; }
.symbol-grid { display: flex; flex-wrap: wrap; gap: 4px; }
.sym-item { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
.sym-item:hover { background: #0969da; color: white; }
.sym-char { font-size: 20px; }
</style>
