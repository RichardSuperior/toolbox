<template>
  <ToolLayout title="MC 服务器检测" subtitle="查询 Minecraft Java/基岩版服务器的在线状态与玩家信息" icon="⛏️">
    <div class="space-y-4">
      <!-- 查询框 -->
      <div class="card p-6">
        <div class="flex items-center gap-3 mb-5">
          <div class="flex bg-[var(--bg-secondary)] rounded-lg p-1 text-sm border border-[var(--border-color)]">
            <button @click="edition='java'" :class="edition==='java'?'bg-white dark:bg-slate-700 shadow-sm text-[var(--text-primary)]':'text-[var(--text-secondary)]'" class="px-4 py-1.5 rounded-md font-medium transition-all">Java版</button>
            <button @click="edition='bedrock'" :class="edition==='bedrock'?'bg-white dark:bg-slate-700 shadow-sm text-[var(--text-primary)]':'text-[var(--text-secondary)]'" class="px-4 py-1.5 rounded-md font-medium transition-all">基岩版</button>
          </div>
        </div>

        <div class="flex gap-3">
          <input 
            v-model="host" 
            type="text" 
            :placeholder="`输入服务器地址，如 mc.example.com${edition==='java'?':25565':':19132'}`"
            class="input-base flex-1" 
            @keyup.enter="check"
          />
          <button @click="check" class="btn-primary shrink-0 px-6" :disabled="!host.trim() || checking">
            <svg v-if="checking" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ checking ? '检测中' : '检测' }}
          </button>
        </div>
      </div>

      <!-- 结果 -->
      <div v-if="result" class="card p-6 animate-slide-up">
        <div class="flex items-start gap-4 mb-5">
          <!-- 服务器图标 -->
          <div class="w-16 h-16 bg-[var(--bg-secondary)] rounded-xl flex items-center justify-center text-3xl shrink-0">
            {{ result.online ? '🟢' : '🔴' }}
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-bold text-lg text-[var(--text-primary)]">{{ result.host }}</span>
              <span :class="result.online ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'" class="badge text-xs">
                {{ result.online ? '在线' : '离线' }}
              </span>
            </div>
            <div v-if="result.motd" class="text-sm text-[var(--text-secondary)]" v-html="formatMotd(result.motd)"></div>
          </div>
        </div>

        <div v-if="result.online" class="grid sm:grid-cols-3 gap-3">
          <div class="bg-[var(--bg-secondary)] rounded-xl p-4 text-center">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ result.players?.online || 0 }}</div>
            <div class="text-xs text-[var(--text-secondary)] mt-1">在线玩家</div>
          </div>
          <div class="bg-[var(--bg-secondary)] rounded-xl p-4 text-center">
            <div class="text-2xl font-bold text-[var(--text-primary)]">{{ result.players?.max || '—' }}</div>
            <div class="text-xs text-[var(--text-secondary)] mt-1">最大容量</div>
          </div>
          <div class="bg-[var(--bg-secondary)] rounded-xl p-4 text-center">
            <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ result.version?.name || '—' }}</div>
            <div class="text-xs text-[var(--text-secondary)] mt-1">游戏版本</div>
          </div>
        </div>

        <!-- 玩家列表 -->
        <div v-if="result.players?.sample?.length" class="mt-4">
          <div class="text-sm font-medium text-[var(--text-secondary)] mb-2">在线玩家列表</div>
          <div class="flex flex-wrap gap-2">
            <span v-for="p in result.players.sample" :key="p.id" class="px-2.5 py-1 bg-[var(--bg-secondary)] rounded-lg text-sm text-[var(--text-primary)]">{{ p.name }}</span>
          </div>
        </div>
      </div>

      <!-- 错误 -->
      <div v-if="error" class="card p-5 border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10">
        <div class="flex items-center gap-2 text-red-600 dark:text-red-400">
          <svg class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
          </svg>
          {{ error }}
        </div>
      </div>

      <!-- 常用公共服务器 -->
      <div class="card p-5">
        <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-3">热门公共服务器</h3>
        <div class="grid sm:grid-cols-2 gap-2">
          <button v-for="s in servers" :key="s.host" @click="host = s.host; check()" 
            class="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-xl hover:bg-[var(--bg-primary)] border border-transparent hover:border-[var(--border-color)] transition-all text-left">
            <div>
              <div class="text-sm font-medium text-[var(--text-primary)]">{{ s.name }}</div>
              <div class="text-xs font-mono text-[var(--text-secondary)]">{{ s.host }}</div>
            </div>
            <svg class="w-4 h-4 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const edition = ref('java')
const host = ref('')
const checking = ref(false)
const result = ref(null)
const error = ref('')

const servers = [
  { name: 'Hypixel', host: 'mc.hypixel.net' },
  { name: '2b2t', host: '2b2t.org' },
  { name: 'CubeCraft', host: 'play.cubecraft.net' },
  { name: 'Mineplex', host: 'us.mineplex.com' },
]

async function check() {
  if (!host.value.trim()) return
  checking.value = true
  error.value = ''
  result.value = null
  
  try {
    const [h, p] = host.value.split(':')
    const port = p || (edition.value === 'java' ? 25565 : 19132)
    const type = edition.value === 'bedrock' ? 'bedrock' : 'java'
    const res = await fetch(`https://api.mcsrvstat.us/3/${h}:${port}`)
    const data = await res.json()
    result.value = { ...data, host: `${h}:${port}` }
  } catch (e) {
    error.value = '查询失败，请检查服务器地址或稍后重试'
  } finally {
    checking.value = false
  }
}

function formatMotd(motd) {
  if (typeof motd === 'object' && motd.clean) return motd.clean.join('<br>')
  return String(motd)
}
</script>
