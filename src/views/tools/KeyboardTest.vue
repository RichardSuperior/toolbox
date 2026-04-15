<template>
  <ToolLayout title="键盘测试">
    <div class="tool-wrap">
      <div class="tip-box">按下任意键盘按键，查看按键信息。</div>
      <div class="key-display" :class="{ pressed: isPressed }" tabindex="0" @keydown="onKeyDown" @keyup="onKeyUp" ref="keyBox">
        <div v-if="!keyInfo.key" class="key-hint">点击此区域，然后按下任意键</div>
        <div v-else class="key-info">
          <div class="big-key">{{ keyInfo.key === ' ' ? 'Space' : keyInfo.key }}</div>
          <div class="key-details">
            <span>keyCode: {{ keyInfo.keyCode }}</span>
            <span>code: {{ keyInfo.code }}</span>
            <span>which: {{ keyInfo.which }}</span>
          </div>
          <div class="key-mods" v-if="keyInfo.ctrl || keyInfo.shift || keyInfo.alt || keyInfo.meta">
            <span v-if="keyInfo.ctrl" class="mod">Ctrl</span>
            <span v-if="keyInfo.shift" class="mod">Shift</span>
            <span v-if="keyInfo.alt" class="mod">Alt</span>
            <span v-if="keyInfo.meta" class="mod">Meta</span>
          </div>
        </div>
      </div>
      <div class="history" v-if="history.length">
        <div class="history-title">按键历史：</div>
        <div class="history-list">
          <span v-for="(h, i) in history" :key="i" class="history-item">{{ h }}</span>
        </div>
        <button class="btn btn-outline" @click="history = []">清空</button>
      </div>
      <div class="keyboard-visual">
        <div class="row-label">功能键区</div>
        <div class="key-row">
          <span v-for="k in fkeys" :key="k" class="vkey" :class="{ active: keyInfo.code === k }">{{ k }}</span>
        </div>
        <div class="row-label">数字键区</div>
        <div class="key-row">
          <span v-for="k in numkeys" :key="k" class="vkey" :class="{ active: keyInfo.key === k }">{{ k }}</span>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const keyBox = ref(null), isPressed = ref(false)
const keyInfo = ref({ key: '', keyCode: '', code: '', which: '', ctrl: false, shift: false, alt: false, meta: false })
const history = ref([])
const fkeys = ['F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12']
const numkeys = ['`','1','2','3','4','5','6','7','8','9','0','-','=','Backspace']

function onKeyDown(e) {
  e.preventDefault()
  isPressed.value = true
  keyInfo.value = { key: e.key, keyCode: e.keyCode, code: e.code, which: e.which, ctrl: e.ctrlKey, shift: e.shiftKey, alt: e.altKey, meta: e.metaKey }
  const label = e.key === ' ' ? 'Space' : e.key
  if (history.value[0] !== label) history.value.unshift(label)
  if (history.value.length > 20) history.value.pop()
}
function onKeyUp() { isPressed.value = false }
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 14px; }
.tip-box { background: #ddf4ff; border: 1px solid #54aeff; border-radius: 6px; padding: 10px 14px; font-size: 13px; color: #0550ae; }
.key-display { min-height: 140px; border: 2px solid #d0d7de; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #f6f8fa; transition: all 0.15s; outline: none; }
.key-display:focus { border-color: #0969da; background: #f0f6ff; }
.key-display.pressed { border-color: #0969da; background: #ddf4ff; transform: scale(0.99); }
.key-hint { font-size: 15px; color: #999; }
.key-info { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.big-key { font-size: 48px; font-weight: 700; color: #0969da; }
.key-details { display: flex; gap: 16px; font-size: 13px; color: #555; font-family: monospace; }
.key-mods { display: flex; gap: 6px; }
.mod { background: #0969da; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
.history { display: flex; flex-direction: column; gap: 8px; }
.history-title { font-size: 13px; font-weight: 600; }
.history-list { display: flex; flex-wrap: wrap; gap: 6px; }
.history-item { background: #eef1f5; padding: 3px 10px; border-radius: 4px; font-family: monospace; font-size: 13px; }
.btn-outline { padding: 4px 12px; background: white; color: #333; border: 1px solid #d0d7de; border-radius: 6px; cursor: pointer; font-size: 12px; }
.keyboard-visual { display: flex; flex-direction: column; gap: 8px; }
.row-label { font-size: 12px; color: #999; }
.key-row { display: flex; gap: 5px; flex-wrap: wrap; }
.vkey { display: inline-flex; align-items: center; justify-content: center; min-width: 40px; padding: 6px 8px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 12px; font-family: monospace; background: white; transition: all 0.1s; }
.vkey.active { background: #0969da; color: white; border-color: #0969da; }
</style>
