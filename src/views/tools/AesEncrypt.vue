<template>
  <ToolLayout title="AES 加解密" subtitle="AES-CBC 对称加解密工具" icon="🛡️">
    <div class="card p-6 mb-4">
      <!-- 模式切换 -->
      <div class="flex gap-2 mb-5">
        <button
          v-for="m in modes" :key="m.value"
          @click="switchMode(m.value)"
          :class="mode === m.value ? 'btn-primary' : 'btn-secondary'"
          class="px-4 py-2 text-sm"
        >{{ m.label }}</button>
      </div>

      <!-- 密钥 -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          密钥 <span class="text-xs text-[var(--text-secondary)]">（任意长度，系统将自动派生为256位密钥）</span>
        </label>
        <div class="flex gap-2">
          <input
            v-model="secretKey"
            :type="showKey ? 'text' : 'password'"
            class="input-base flex-1"
            placeholder="输入加解密密钥..."
          />
          <button @click="showKey = !showKey" class="btn-secondary px-3">
            {{ showKey ? '🙈' : '👁️' }}
          </button>
        </div>
      </div>

      <!-- 输入/输出 -->
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            {{ mode === 'encrypt' ? '明文' : '密文（Base64）' }}
          </label>
          <textarea
            v-model="inputText"
            rows="8"
            class="input-base w-full font-mono text-sm resize-none"
            :placeholder="mode === 'encrypt' ? '输入要加密的文本...' : '输入要解密的Base64密文...'"
          />
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-[var(--text-secondary)]">
              {{ mode === 'encrypt' ? '密文（Base64）' : '明文' }}
            </label>
            <button v-if="outputText" @click="copyOutput" class="text-xs text-primary-500 hover:text-primary-600">
              {{ copied ? '✓ 已复制' : '复制' }}
            </button>
          </div>
          <div
            class="min-h-[188px] bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 font-mono text-sm text-[var(--text-primary)] break-all whitespace-pre-wrap"
          >
            <span v-if="error" class="text-red-500">{{ error }}</span>
            <span v-else>{{ outputText || '结果将在此显示...' }}</span>
          </div>
        </div>
      </div>

      <button @click="process" class="btn-primary w-full mt-4 justify-center py-3">
        {{ mode === 'encrypt' ? '🔒 加密' : '🔓 解密' }}
      </button>
    </div>

    <template #knowledge>
      <div class="text-sm text-[var(--text-secondary)] space-y-2">
        <p><strong>AES（高级加密标准）</strong>：目前最广泛使用的对称加密算法，被政府、金融、互联网等领域广泛采用。</p>
        <p><strong>CBC 模式</strong>：每个明文块在加密前先与前一个密文块进行 XOR，需要初始化向量（IV），安全性较高。本工具自动随机生成 IV 并附在密文前。</p>
        <p><strong>对称加密</strong>：加密和解密使用同一个密钥，请妥善保管密钥，切勿泄露。</p>
        <p class="text-amber-500 dark:text-amber-400">⚠️ 此工具仅供学习/测试使用，生产环境中请使用专业加密库并由后端处理敏感数据。</p>
      </div>
    </template>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const mode = ref('encrypt')
const secretKey = ref('')
const inputText = ref('')
const outputText = ref('')
const error = ref('')
const copied = ref(false)
const showKey = ref(false)

const modes = [
  { value: 'encrypt', label: '加密' },
  { value: 'decrypt', label: '解密' },
]

function switchMode(m) {
  mode.value = m
  outputText.value = ''
  error.value = ''
}

async function deriveKey(keyStr) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(keyStr),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: new TextEncoder().encode('aes-tool-salt'), iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-CBC', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

function bufToBase64(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
}

function base64ToBuf(b64) {
  const bin = atob(b64)
  const buf = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i)
  return buf
}

async function process() {
  error.value = ''
  outputText.value = ''
  if (!secretKey.value) { error.value = '请输入密钥'; return }
  if (!inputText.value) { error.value = '请输入内容'; return }

  try {
    const key = await deriveKey(secretKey.value)
    if (mode.value === 'encrypt') {
      const iv = crypto.getRandomValues(new Uint8Array(16))
      const encoded = new TextEncoder().encode(inputText.value)
      const encrypted = await crypto.subtle.encrypt({ name: 'AES-CBC', iv }, key, encoded)
      // 将 iv + 密文拼接后 base64
      const combined = new Uint8Array(16 + encrypted.byteLength)
      combined.set(iv, 0)
      combined.set(new Uint8Array(encrypted), 16)
      outputText.value = bufToBase64(combined.buffer)
    } else {
      const combined = base64ToBuf(inputText.value.trim())
      const iv = combined.slice(0, 16)
      const ciphertext = combined.slice(16)
      const decrypted = await crypto.subtle.decrypt({ name: 'AES-CBC', iv }, key, ciphertext)
      outputText.value = new TextDecoder().decode(decrypted)
    }
  } catch (e) {
    error.value = mode.value === 'decrypt'
      ? '解密失败：密钥错误或密文格式不正确'
      : `加密失败：${e.message}`
  }
}

async function copyOutput() {
  await navigator.clipboard.writeText(outputText.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>
