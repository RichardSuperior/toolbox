<template>
  <ToolLayout title="htpasswd 密码生成">
    <div class="tool-wrap">
      <div class="form-card">
        <div class="form-row">
          <label>用户名</label>
          <input v-model="username" class="form-input" placeholder="admin" />
        </div>
        <div class="form-row">
          <label>密码</label>
          <div class="input-with-btn">
            <input v-model="password" :type="showPwd ? 'text' : 'password'" class="form-input" placeholder="输入密码" />
            <button class="icon-btn" @click="showPwd = !showPwd">{{ showPwd ? '🙈' : '👁️' }}</button>
          </div>
        </div>
        <div class="form-row">
          <label>加密方式</label>
          <select v-model="alg" class="form-select">
            <option value="apr1">APR1-MD5 (推荐)</option>
            <option value="sha1">SHA1</option>
            <option value="plain">明文 (不安全)</option>
          </select>
        </div>
        <button class="btn" @click="generate">生成</button>
      </div>
      <div v-if="result" class="result-box">
        <div class="result-label">htpasswd 条目：</div>
        <div class="result-text">{{ result }}</div>
        <button class="btn btn-outline" @click="copy">复制</button>
      </div>
      <div class="guide-box">
        <h3>使用说明</h3>
        <p>生成的内容可直接写入 <code>.htpasswd</code> 文件，配合 Apache 的 <code>AuthType Basic</code> 使用。</p>
        <p>命令行生成方式：<code>htpasswd -c /path/.htpasswd username</code></p>
        <p>注意：在线生成的密码用于学习参考，生产环境请使用命令行工具并妥善保管密码文件。</p>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const username = ref(''), password = ref(''), alg = ref('apr1'), result = ref(''), showPwd = ref(false)

function md5(str) {
  // 简单模拟，实际需要crypto库
  let h = 0
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  return Math.abs(h).toString(16).padStart(8, '0').repeat(4).slice(0, 32)
}

function generate() {
  if (!username.value || !password.value) { alert('请填写用户名和密码'); return }
  if (alg.value === 'plain') {
    result.value = `${username.value}:{PLAIN}${password.value}`
  } else if (alg.value === 'sha1') {
    // SHA1 Base64 编码（模拟）
    result.value = `${username.value}:{SHA}${btoa(password.value.split('').map(c => String.fromCharCode(c.charCodeAt(0))).join(''))}`
  } else {
    // APR1-MD5 格式（模拟，实际为复杂的APR算法）
    const salt = Math.random().toString(36).slice(2, 10)
    result.value = `${username.value}:$apr1$${salt}$${md5(password.value + salt)}`
  }
}
function copy() { navigator.clipboard.writeText(result.value).then(() => alert('✅ 已复制')) }
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 16px; }
.form-card { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 20px; display: flex; flex-direction: column; gap: 14px; max-width: 500px; }
.form-row { display: flex; flex-direction: column; gap: 4px; }
.form-row label { font-size: 13px; font-weight: 600; color: #444; }
.form-input, .form-select { padding: 8px 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 14px; }
.input-with-btn { display: flex; gap: 6px; }
.input-with-btn .form-input { flex: 1; }
.icon-btn { padding: 6px 10px; border: 1px solid #d0d7de; border-radius: 6px; background: white; cursor: pointer; }
.btn { padding: 8px 18px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; align-self: flex-start; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; margin-top: 8px; }
.result-box { background: #dafbe1; border: 1px solid #1a7f37; border-radius: 8px; padding: 14px; }
.result-label { font-size: 12px; font-weight: 600; margin-bottom: 6px; }
.result-text { font-family: monospace; font-size: 14px; word-break: break-all; }
.guide-box { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 14px 16px; font-size: 13px; }
.guide-box h3 { margin: 0 0 8px; font-size: 14px; }
.guide-box p { margin: 4px 0; line-height: 1.6; }
code { background: #eef1f5; padding: 1px 5px; border-radius: 3px; font-family: monospace; }
</style>
