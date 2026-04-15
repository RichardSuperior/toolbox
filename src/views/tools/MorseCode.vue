<template>
  <ToolLayout title="摩尔斯电码">
    <div class="morse">
      <div class="tool-bar">
        <button class="btn" @click="encode">文字→电码</button>
        <button class="btn" @click="decode">电码→文字</button>
        <button class="btn btn-outline" @click="copyResult">复制</button>
      </div>
      <div class="editor-wrap">
        <textarea v-model="input" class="code-area" placeholder="SOS 或 ···---···"></textarea>
        <textarea v-model="output" class="code-area" readonly></textarea>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const input = ref(''), output = ref('')

const morseMap = { 'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.' }
const reverseMorse = Object.fromEntries(Object.entries(morseMap).map(([k, v]) => [v, k]))

function encode() {
  output.value = input.value.toUpperCase().split('').map(c => c === ' ' ? ' / ' : morseMap[c] || c).join(' ')
}

function decode() {
  output.value = input.value.split(' / ').map(word => word.split(' ').map(m => reverseMorse[m] || m).join('')).join(' ')
}

function copyResult() { if (!output.value) return; navigator.clipboard.writeText(output.value).then(() => alert('✅ 已复制')) }
</script>

<style scoped>
.morse { display: flex; flex-direction: column; gap: 12px; }
.tool-bar { display: flex; gap: 8px; flex-wrap: wrap; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.code-area { width: 100%; min-height: 250px; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 13px; resize: vertical; background: #f6f8fa; box-sizing: border-box; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
