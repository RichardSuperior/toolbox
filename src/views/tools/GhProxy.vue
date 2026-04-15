<template>
  <ToolLayout title="GitHub 加速" subtitle="通过代理加速 GitHub 资源的克隆和下载" icon="🚀">
    <div class="space-y-4">
      <div class="card p-6">
        <div class="mb-5">
          <label class="text-xs font-medium text-[var(--text-secondary)] mb-2 block">输入 GitHub 链接</label>
          <div class="flex gap-3">
            <input v-model="url" type="url" placeholder="https://github.com/user/repo 或 .git 克隆链接" class="input-base flex-1" @keyup.enter="convert" />
            <button @click="convert" class="btn-primary shrink-0 px-5">转换</button>
          </div>
          <p class="text-xs text-[var(--text-secondary)] mt-2">支持仓库链接、Release 下载链接、Raw 文件链接</p>
        </div>

        <div v-if="results.length" class="space-y-3">
          <div class="text-xs font-medium text-[var(--text-secondary)] mb-2">加速链接（选择一个使用）</div>
          <div v-for="(r, i) in results" :key="i" class="flex items-center gap-3 p-4 bg-[var(--bg-secondary)] rounded-xl group">
            <div class="flex-1 min-w-0">
              <div class="text-xs font-semibold text-[var(--text-secondary)] mb-1">{{ r.name }}</div>
              <div class="font-mono text-sm text-primary-600 dark:text-primary-400 truncate">{{ r.url }}</div>
            </div>
            <button @click="copy(r.url, i)" class="shrink-0 btn-secondary text-xs py-1.5">
              {{ copiedIdx === i ? '已复制!' : '复制' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 使用说明 -->
      <div class="card p-5">
        <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-3">使用方式</h3>
        <div class="space-y-3">
          <div class="bg-slate-900 text-green-400 rounded-xl p-4 font-mono text-sm">
            <div class="text-slate-500 text-xs mb-2"># 克隆加速示例</div>
            <div>git clone https://ghproxy.com/https://github.com/user/repo.git</div>
          </div>
          <div class="bg-slate-900 text-green-400 rounded-xl p-4 font-mono text-sm">
            <div class="text-slate-500 text-xs mb-2"># 下载 Release 文件</div>
            <div>wget https://ghproxy.com/https://github.com/.../releases/download/.../file.zip</div>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const url = ref('')
const results = ref([])
const copiedIdx = ref(-1)

const proxies = [
  { name: 'ghproxy.com（推荐）', prefix: 'https://ghproxy.com/' },
  { name: 'gh.idayer.com', prefix: 'https://gh.idayer.com/' },
  { name: 'mirror.ghproxy.com', prefix: 'https://mirror.ghproxy.com/' },
]

function convert() {
  if (!url.value.trim()) return
  const u = url.value.trim()
  if (!u.includes('github.com')) {
    results.value = []
    return
  }
  results.value = proxies.map(p => ({ name: p.name, url: p.prefix + u }))
}

async function copy(u, i) {
  await navigator.clipboard.writeText(u)
  copiedIdx.value = i
  setTimeout(() => copiedIdx.value = -1, 2000)
}
</script>
