<template>
  <ToolLayout title="HDR 显示测试" subtitle="检测您的显示器是否支持 HDR 及其具体参数" icon="🖥️">
    <div class="space-y-4">
      <!-- 检测结果 -->
      <div class="card p-6">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
               :class="hdrSupport ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'">
            {{ hdrSupport ? '✅' : '❌' }}
          </div>
          <div>
            <div class="font-bold text-lg text-[var(--text-primary)]">
              {{ hdrSupport ? '支持 HDR' : '不支持 HDR' }}
            </div>
            <div class="text-sm text-[var(--text-secondary)] mt-1">
              {{ hdrSupport ? '您的显示器/系统支持高动态范围显示' : '当前显示器或系统不支持 HDR' }}
            </div>
          </div>
        </div>
      </div>

      <!-- 亮度测试区 -->
      <div class="card p-6">
        <h3 class="font-semibold text-[var(--text-primary)] mb-4">亮度层次测试</h3>
        <p class="text-sm text-[var(--text-secondary)] mb-4">在 HDR 显示器上，您应该能看到所有 20 个亮度层次，包括最暗和最亮的区域。</p>
        <div class="flex h-20 rounded-xl overflow-hidden">
          <div v-for="i in 20" :key="i" class="flex-1" :style="{ backgroundColor: `rgb(${Math.round(i*12.75)},${Math.round(i*12.75)},${Math.round(i*12.75)})` }"></div>
        </div>
        <div class="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
          <span>最暗 (0)</span>
          <span>最亮 (255)</span>
        </div>
      </div>

      <!-- 色彩测试 -->
      <div class="card p-6">
        <h3 class="font-semibold text-[var(--text-primary)] mb-4">色域测试</h3>
        <div class="grid grid-cols-3 gap-3">
          <div v-for="color in colorTests" :key="color.name" class="rounded-xl overflow-hidden">
            <div class="h-20" :style="{ background: color.gradient }"></div>
            <div class="p-2 bg-[var(--bg-secondary)]">
              <div class="text-xs font-medium text-[var(--text-primary)]">{{ color.name }}</div>
              <div class="text-xs text-[var(--text-secondary)]">{{ color.desc }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 设备信息 -->
      <div class="card p-6">
        <h3 class="font-semibold text-[var(--text-primary)] mb-4">显示设备信息</h3>
        <div class="grid sm:grid-cols-2 gap-3">
          <div v-for="info in displayInfos" :key="info.label" class="flex justify-between py-2 border-b border-[var(--border-color)] last:border-0">
            <span class="text-sm text-[var(--text-secondary)]">{{ info.label }}</span>
            <span class="text-sm font-medium text-[var(--text-primary)]">{{ info.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const hdrSupport = ref(false)

const colorTests = [
  { name: 'sRGB 红色渐变', desc: '标准色域', gradient: 'linear-gradient(to right, #000, #ff0000)' },
  { name: 'sRGB 绿色渐变', desc: '标准色域', gradient: 'linear-gradient(to right, #000, #00ff00)' },
  { name: 'sRGB 蓝色渐变', desc: '标准色域', gradient: 'linear-gradient(to right, #000, #0000ff)' },
  { name: '白色到黑色', desc: '对比度测试', gradient: 'linear-gradient(to right, #000, #fff)' },
  { name: '彩色渐变', desc: '全色域', gradient: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff)' },
  { name: '暗部细节', desc: '阴影层次', gradient: 'linear-gradient(to right, #000000, #1a1a1a, #333)' },
]

const displayInfos = computed(() => [
  { label: '屏幕分辨率', value: `${window.screen.width} × ${window.screen.height}` },
  { label: '可用区域', value: `${window.screen.availWidth} × ${window.screen.availHeight}` },
  { label: '色彩深度', value: `${window.screen.colorDepth} bit` },
  { label: '像素深度', value: `${window.screen.pixelDepth} bit` },
  { label: '设备像素比', value: `${window.devicePixelRatio}x` },
  { label: 'HDR 支持', value: hdrSupport.value ? '是' : '否' },
])

onMounted(() => {
  if (window.matchMedia) {
    hdrSupport.value = window.matchMedia('(dynamic-range: high)').matches ||
                       window.matchMedia('(color-gamut: p3)').matches
  }
})
</script>
