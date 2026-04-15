<template>
  <ToolLayout title="网页刷新跳转">
    <div class="tool-wrap">
      <div class="form-card">
        <div class="form-row">
          <label>跳转 URL</label>
          <input v-model="url" class="form-input" placeholder="https://example.com" />
        </div>
        <div class="form-row">
          <label>延迟秒数</label>
          <input type="number" v-model.number="delay" class="form-input" min="0" max="300" />
        </div>
        <div class="form-row">
          <label>页面标题</label>
          <input v-model="title" class="form-input" placeholder="跳转中..." />
        </div>
        <button class="btn" @click="generate">生成代码</button>
      </div>
      <div v-if="output" class="output-section">
        <div class="label">HTML 刷新跳转代码</div>
        <div class="tabs">
          <button class="tab" :class="{active: tab==='meta'}" @click="tab='meta'">Meta 刷新</button>
          <button class="tab" :class="{active: tab==='js'}" @click="tab='js'">JS 跳转</button>
          <button class="tab" :class="{active: tab==='full'}" @click="tab='full'">完整 HTML</button>
        </div>
        <textarea :value="tabContent" rows="12" readonly class="code-area"></textarea>
        <button class="btn btn-outline" @click="copy">复制</button>
      </div>
      <div class="guide-box">
        <h3>代码说明</h3>
        <ul>
          <li><code>meta refresh</code>：浏览器原生支持，SEO 友好，适合服务端无法处理重定向时</li>
          <li><code>window.location</code>：JavaScript 跳转，可实现倒计时效果</li>
          <li>301 重定向：服务端跳转，最推荐，对 SEO 最友好</li>
        </ul>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const url = ref('https://example.com'), delay = ref(3), title = ref('跳转中...'), output = ref(false), tab = ref('meta')

const metaCode = computed(() => `<meta http-equiv="refresh" content="${delay.value}; url=${url.value}">`)
const jsCode = computed(() => `<script>
  var delay = ${delay.value};
  var timer = setInterval(function() {
    delay--;
    document.getElementById('count').innerText = delay;
    if (delay <= 0) {
      clearInterval(timer);
      window.location.href = '${url.value}';
    }
  }, 1000);
<\/script>
<p>页面将在 <span id="count">${delay.value}</span> 秒后跳转...</p>`)
const fullCode = computed(() => `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="${delay.value}; url=${url.value}">
  <title>${title.value}</title>
</head>
<body>
  <p>页面将在 <span id="count">${delay.value}</span> 秒后自动跳转...</p>
  <a href="${url.value}">点击这里立即跳转</a>
  <script>
    var d=${delay.value};
    setInterval(function(){d--;document.getElementById('count').innerText=d;if(d<=0)location.href='${url.value}'},1000);
  <\/script>
</body>
</html>`)

const tabContent = computed(() => tab.value === 'meta' ? metaCode.value : tab.value === 'js' ? jsCode.value : fullCode.value)
function generate() { output.value = true }
function copy() { navigator.clipboard.writeText(tabContent.value).then(() => alert('✅ 已复制')) }
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 16px; }
.form-card { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 20px; display: flex; flex-direction: column; gap: 14px; max-width: 500px; }
.form-row { display: flex; flex-direction: column; gap: 4px; }
.form-row label { font-size: 13px; font-weight: 600; }
.form-input { padding: 8px 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 14px; }
.btn { padding: 8px 18px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; align-self: flex-start; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; margin-top: 8px; }
.label { font-size: 12px; font-weight: 600; color: #666; margin-bottom: 4px; }
.output-section { display: flex; flex-direction: column; gap: 8px; }
.tabs { display: flex; gap: 6px; }
.tab { padding: 5px 14px; border: 1px solid #d0d7de; border-radius: 6px; background: white; cursor: pointer; font-size: 13px; }
.tab.active { background: #0969da; color: white; border-color: #0969da; }
.code-area { width: 100%; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: monospace; font-size: 13px; resize: vertical; box-sizing: border-box; background: #f6f8fa; }
.guide-box { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 14px 16px; font-size: 13px; }
.guide-box h3 { margin: 0 0 8px; font-size: 14px; }
.guide-box ul { margin: 0; padding-left: 20px; line-height: 1.8; }
code { background: #eef1f5; padding: 1px 5px; border-radius: 3px; font-family: monospace; }
</style>
