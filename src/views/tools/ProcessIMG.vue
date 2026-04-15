<template>
  <ToolLayout title="图片处理" subtitle="在线压缩图片、转换格式、调整尺寸 — 完全本地处理，不上传服务器" icon="🖼️">
    <div class="space-y-4">
      <!-- 上传区 -->
      <div 
        class="card border-2 border-dashed border-[var(--border-color)] p-10 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/5 transition-all"
        :class="dragging ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/10' : ''"
        @dragover.prevent="dragging=true"
        @dragleave="dragging=false"
        @drop.prevent="onDrop"
        @click="$refs.fileInput.click()"
      >
        <div v-if="!images.length">
          <div class="text-5xl mb-4">📁</div>
          <div class="text-[var(--text-primary)] font-medium mb-1">拖拽图片到此处，或点击上传</div>
          <div class="text-sm text-[var(--text-secondary)]">支持 JPG、PNG、GIF、WebP，可多选</div>
        </div>
        <div v-else class="text-sm text-primary-600 dark:text-primary-400">
          已上传 {{ images.length }} 张图片，点击继续添加
        </div>
        <input ref="fileInput" type="file" accept="image/*" multiple class="hidden" @change="onFileChange" />
      </div>

      <!-- 处理选项 -->
      <div v-if="images.length" class="card p-6 animate-slide-up">
        <h3 class="font-semibold text-[var(--text-primary)] mb-4">处理选项</h3>
        <div class="grid sm:grid-cols-3 gap-4 mb-5">
          <div>
            <label class="text-xs font-medium text-[var(--text-secondary)] mb-2 block">输出格式</label>
            <select v-model="outputFormat" class="input-base">
              <option value="same">保持原格式</option>
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
          </div>
          <div>
            <label class="text-xs font-medium text-[var(--text-secondary)] mb-2 block">
              质量 / 压缩率: {{ quality }}%
            </label>
            <input type="range" v-model.number="quality" min="1" max="100" class="w-full accent-primary-600" />
          </div>
          <div>
            <label class="text-xs font-medium text-[var(--text-secondary)] mb-2 block">最大宽度（px）</label>
            <input type="number" v-model.number="maxWidth" placeholder="不限制" class="input-base" />
          </div>
        </div>
        <button @click="processAll" class="btn-primary w-full justify-center py-3" :disabled="processing">
          <svg v-if="processing" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {{ processing ? '处理中...' : '开始处理' }}
        </button>
      </div>

      <!-- 结果列表 -->
      <div v-if="results.length" class="space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-[var(--text-primary)]">处理结果</h3>
          <button @click="downloadAll" class="btn-primary">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            全部下载
          </button>
        </div>
        <div v-for="(r, i) in results" :key="i" class="card p-4 flex items-center gap-4">
          <img :src="r.url" class="w-16 h-16 object-cover rounded-lg shrink-0" />
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-[var(--text-primary)] truncate">{{ r.name }}</div>
            <div class="text-xs text-[var(--text-secondary)] mt-1">
              {{ r.origSize }} → <span class="text-green-600 dark:text-green-400 font-medium">{{ r.newSize }}</span>
              <span class="ml-2 text-green-600 dark:text-green-400">节省 {{ r.saving }}</span>
            </div>
            <div class="text-xs text-[var(--text-secondary)]">{{ r.dimensions }}</div>
          </div>
          <a :href="r.url" :download="r.name" class="btn-secondary text-xs py-1.5 shrink-0">下载</a>
        </div>
      </div>
    </div>

    <template #knowledge>
      <div class="space-y-2 text-sm text-[var(--text-secondary)]">
        <p>✅ 本工具完全在浏览器本地运行，<strong class="text-[var(--text-primary)]">不会上传任何图片到服务器</strong>，保障您的隐私安全。</p>
        <p><strong class="text-[var(--text-primary)]">WebP 格式</strong>通常比 JPEG/PNG 小 25-35%，推荐用于网站图片优化。</p>
      </div>
    </template>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const fileInput = ref()
const images = ref([])
const outputFormat = ref('jpeg')
const quality = ref(80)
const maxWidth = ref(null)
const processing = ref(false)
const results = ref([])
const dragging = ref(false)

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

function onFileChange(e) {
  addFiles([...e.target.files])
}
function onDrop(e) {
  dragging.value = false
  addFiles([...e.dataTransfer.files].filter(f => f.type.startsWith('image/')))
}
function addFiles(files) {
  images.value.push(...files)
}

async function processAll() {
  processing.value = true
  results.value = []
  for (const file of images.value) {
    const result = await processImage(file)
    results.value.push(result)
  }
  processing.value = false
}

function processImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let w = img.width, h = img.height
        if (maxWidth.value && w > maxWidth.value) {
          h = Math.round(h * maxWidth.value / w)
          w = maxWidth.value
        }
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        const fmt = outputFormat.value === 'same' ? file.type : `image/${outputFormat.value}`
        const url = canvas.toDataURL(fmt, quality.value / 100)
        const newBytes = Math.round((url.length - 22) * 3 / 4)
        const saving = file.size > 0 ? Math.round((1 - newBytes / file.size) * 100) : 0
        const ext = outputFormat.value === 'same' ? file.name.split('.').pop() : outputFormat.value
        resolve({
          url,
          name: file.name.replace(/\.[^.]+$/, `.${ext}`),
          origSize: formatSize(file.size),
          newSize: formatSize(newBytes),
          saving: `${saving > 0 ? saving : 0}%`,
          dimensions: `${w} × ${h}`,
        })
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

async function downloadAll() {
  for (const r of results.value) {
    const a = document.createElement('a')
    a.href = r.url
    a.download = r.name
    a.click()
    await new Promise(res => setTimeout(res, 300))
  }
}
</script>
