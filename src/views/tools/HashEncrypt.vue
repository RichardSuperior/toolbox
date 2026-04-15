<template>
  <ToolLayout title="哈希加密" subtitle="MD5、SHA-1、SHA-256、SHA-512 哈希计算" icon="🔒">
    <div class="card p-6 mb-4">
      <div class="mb-5">
        <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">输入文本</label>
        <textarea
          v-model="input"
          rows="5"
          class="input-base w-full font-mono text-sm resize-none"
          placeholder="输入要计算哈希值的文本..."
        />
        <div class="flex gap-3 mt-3">
          <label class="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
            <input type="checkbox" v-model="upperCase" class="accent-primary-600 w-4 h-4" />
            大写输出
          </label>
        </div>
      </div>

      <!-- 哈希结果 -->
      <div class="space-y-3">
        <div
          v-for="item in hashResults"
          :key="item.label"
          class="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold text-primary-500 uppercase tracking-wide">{{ item.label }}</span>
            <button
              v-if="item.value"
              @click="copy(item.value, item.label)"
              class="text-xs btn-secondary py-1 px-3"
            >{{ copiedLabel === item.label ? '✓ 已复制' : '复制' }}</button>
          </div>
          <div class="font-mono text-sm text-[var(--text-primary)] break-all">
            <span v-if="item.loading" class="text-[var(--text-secondary)]">计算中...</span>
            <span v-else>{{ item.value || '—' }}</span>
          </div>
        </div>
      </div>
    </div>

    <template #knowledge>
      <div class="text-sm text-[var(--text-secondary)] space-y-2">
        <p><strong>MD5</strong>：输出 128 位（32位十六进制），速度快，但已不适合安全场合，常用于文件校验。</p>
        <p><strong>SHA-1</strong>：输出 160 位（40位十六进制），也已存在碰撞攻击，不推荐用于安全场合。</p>
        <p><strong>SHA-256</strong>：SHA-2 家族，输出 256 位（64位十六进制），目前广泛用于数字签名、区块链等。</p>
        <p><strong>SHA-512</strong>：输出 512 位（128位十六进制），安全性更高，适合高安全需求场景。</p>
        <p class="text-amber-500 dark:text-amber-400">⚠️ 哈希函数是单向的，无法从哈希值反推原文。请勿使用 MD5/SHA1 单独存储用户密码。</p>
      </div>
    </template>
  </ToolLayout>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const input = ref('')
const upperCase = ref(false)
const copiedLabel = ref('')

const hashResults = reactive([
  { label: 'MD5', value: '', loading: false },
  { label: 'SHA-1', value: '', loading: false },
  { label: 'SHA-256', value: '', loading: false },
  { label: 'SHA-512', value: '', loading: false },
])

// MD5 pure JS implementation
function md5(string) {
  function safeAdd(x, y) {
    const lsw = (x & 0xFFFF) + (y & 0xFFFF)
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xFFFF)
  }
  function bitRotateLeft(num, cnt) { return (num << cnt) | (num >>> (32 - cnt)) }
  function md5cmn(q, a, b, x, s, t) { return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b) }
  function md5ff(a, b, c, d, x, s, t) { return md5cmn((b & c) | (~b & d), a, b, x, s, t) }
  function md5gg(a, b, c, d, x, s, t) { return md5cmn((b & d) | (c & ~d), a, b, x, s, t) }
  function md5hh(a, b, c, d, x, s, t) { return md5cmn(b ^ c ^ d, a, b, x, s, t) }
  function md5ii(a, b, c, d, x, s, t) { return md5cmn(c ^ (b | ~d), a, b, x, s, t) }

  const str8 = new TextEncoder().encode(string)
  const len8 = str8.length
  const len32 = len8 >> 2
  const extra = len8 % 4
  const tmp = new Uint32Array(len32 + (extra ? 1 : 0) + 14 + 2)
  for (let i = 0; i < len32; i++) {
    tmp[i] = str8[i*4] | (str8[i*4+1] << 8) | (str8[i*4+2] << 16) | (str8[i*4+3] << 24)
  }
  if (extra) {
    let val = 0
    for (let i = 0; i < extra; i++) val |= str8[len32 * 4 + i] << (i * 8)
    tmp[len32] = val
  }
  tmp[len32 + (extra ? 1 : 0) - (extra ? 0 : 0)] |= 0x80 << ((len8 % 4) * 8)
  // pad
  const padIdx = len8 >> 2
  let m = [...new Uint32Array(tmp.buffer)]
  m[padIdx] |= 0x80 << ((len8 % 4) * 8)
  while (m.length % 16 !== 14) m.push(0)
  m.push(len8 * 8 >>> 0)
  m.push(Math.floor(len8 / 0x20000000))

  let a = 0x67452301, b = 0xEFCDAB89, c = 0x98BADCFE, d = 0x10325476
  for (let i = 0; i < m.length; i += 16) {
    const [A, B, C, D] = [a, b, c, d]
    a = md5ff(a,b,c,d,m[i+0],7,-680876936); d=md5ff(d,a,b,c,m[i+1],12,-389564586); c=md5ff(c,d,a,b,m[i+2],17,606105819); b=md5ff(b,c,d,a,m[i+3],22,-1044525330)
    a=md5ff(a,b,c,d,m[i+4],7,-176418897); d=md5ff(d,a,b,c,m[i+5],12,1200080426); c=md5ff(c,d,a,b,m[i+6],17,-1473231341); b=md5ff(b,c,d,a,m[i+7],22,-45705983)
    a=md5ff(a,b,c,d,m[i+8],7,1770035416); d=md5ff(d,a,b,c,m[i+9],12,-1958414417); c=md5ff(c,d,a,b,m[i+10],17,-42063); b=md5ff(b,c,d,a,m[i+11],22,-1990404162)
    a=md5ff(a,b,c,d,m[i+12],7,1804603682); d=md5ff(d,a,b,c,m[i+13],12,-40341101); c=md5ff(c,d,a,b,m[i+14],17,-1502002290); b=md5ff(b,c,d,a,m[i+15],22,1236535329)
    a=md5gg(a,b,c,d,m[i+1],5,-165796510); d=md5gg(d,a,b,c,m[i+6],9,-1069501632); c=md5gg(c,d,a,b,m[i+11],14,643717713); b=md5gg(b,c,d,a,m[i+0],20,-373897302)
    a=md5gg(a,b,c,d,m[i+5],5,-701558691); d=md5gg(d,a,b,c,m[i+10],9,38016083); c=md5gg(c,d,a,b,m[i+15],14,-660478335); b=md5gg(b,c,d,a,m[i+4],20,-405537848)
    a=md5gg(a,b,c,d,m[i+9],5,568446438); d=md5gg(d,a,b,c,m[i+14],9,-1019803690); c=md5gg(c,d,a,b,m[i+3],14,-187363961); b=md5gg(b,c,d,a,m[i+8],20,1163531501)
    a=md5gg(a,b,c,d,m[i+13],5,-1444681467); d=md5gg(d,a,b,c,m[i+2],9,-51403784); c=md5gg(c,d,a,b,m[i+7],14,1735328473); b=md5gg(b,c,d,a,m[i+12],20,-1926607734)
    a=md5hh(a,b,c,d,m[i+5],4,-378558); d=md5hh(d,a,b,c,m[i+8],11,-2022574463); c=md5hh(c,d,a,b,m[i+11],16,1839030562); b=md5hh(b,c,d,a,m[i+14],23,-35309556)
    a=md5hh(a,b,c,d,m[i+1],4,-1530992060); d=md5hh(d,a,b,c,m[i+4],11,1272893353); c=md5hh(c,d,a,b,m[i+7],16,-155497632); b=md5hh(b,c,d,a,m[i+10],23,-1094730640)
    a=md5hh(a,b,c,d,m[i+13],4,681279174); d=md5hh(d,a,b,c,m[i+0],11,-358537222); c=md5hh(c,d,a,b,m[i+3],16,-722521979); b=md5hh(b,c,d,a,m[i+6],23,76029189)
    a=md5hh(a,b,c,d,m[i+9],4,-640364487); d=md5hh(d,a,b,c,m[i+12],11,-421815835); c=md5hh(c,d,a,b,m[i+15],16,530742520); b=md5hh(b,c,d,a,m[i+2],23,-995338651)
    a=md5ii(a,b,c,d,m[i+0],6,-198630844); d=md5ii(d,a,b,c,m[i+7],10,1126891415); c=md5ii(c,d,a,b,m[i+14],15,-1416354905); b=md5ii(b,c,d,a,m[i+5],21,-57434055)
    a=md5ii(a,b,c,d,m[i+12],6,1700485571); d=md5ii(d,a,b,c,m[i+3],10,-1894986606); c=md5ii(c,d,a,b,m[i+10],15,-1051523); b=md5ii(b,c,d,a,m[i+1],21,-2054922799)
    a=md5ii(a,b,c,d,m[i+8],6,1873313359); d=md5ii(d,a,b,c,m[i+15],10,-30611744); c=md5ii(c,d,a,b,m[i+6],15,-1560198380); b=md5ii(b,c,d,a,m[i+13],21,1309151649)
    a=md5ii(a,b,c,d,m[i+4],6,-145523070); d=md5ii(d,a,b,c,m[i+11],10,-1120210379); c=md5ii(c,d,a,b,m[i+2],15,718787259); b=md5ii(b,c,d,a,m[i+9],21,-343485551)
    a=safeAdd(a,A); b=safeAdd(b,B); c=safeAdd(c,C); d=safeAdd(d,D)
  }
  return [a,b,c,d].map(n => {
    let hex = ''
    for (let j = 0; j < 4; j++) hex += ((n >> (j*8)) & 0xFF).toString(16).padStart(2,'0')
    return hex
  }).join('')
}

async function sha(algo, text) {
  const encoded = new TextEncoder().encode(text)
  const hashBuffer = await crypto.subtle.digest(algo, encoded)
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
}

let debounceTimer = null
watch([input, upperCase], async () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    if (!input.value) {
      hashResults.forEach(r => { r.value = ''; r.loading = false })
      return
    }
    hashResults.forEach(r => r.loading = true)
    const txt = input.value
    // MD5
    const m = md5(txt)
    hashResults[0].value = upperCase.value ? m.toUpperCase() : m
    hashResults[0].loading = false
    // SHA-1, SHA-256, SHA-512
    const algos = ['SHA-1', 'SHA-256', 'SHA-512']
    for (let i = 0; i < algos.length; i++) {
      const h = await sha(algos[i], txt)
      hashResults[i+1].value = upperCase.value ? h.toUpperCase() : h
      hashResults[i+1].loading = false
    }
  }, 300)
})

async function copy(text, label) {
  await navigator.clipboard.writeText(text)
  copiedLabel.value = label
  setTimeout(() => copiedLabel.value = '', 2000)
}
</script>
