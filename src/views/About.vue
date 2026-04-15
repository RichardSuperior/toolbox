<template>
  <div class="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
    <!-- Hero -->
    <div class="text-center mb-12">
      <div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent rounded-3xl flex items-center justify-center text-4xl shadow-lg mx-auto mb-5">🧰</div>
      <h1 class="text-3xl font-bold text-[var(--text-primary)] mb-3">关于在线工具箱</h1>
      <p class="text-[var(--text-secondary)] text-lg max-w-xl mx-auto">一个简单、快速、实用的在线工具集合</p>
    </div>

    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- 网站介绍 -->
      <div class="card p-6">
        <h2 class="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <span class="text-xl">📖</span> 关于本站
        </h2>
        <div class="space-y-3 text-sm text-[var(--text-secondary)]">
          <p>在线工具箱是一个汇聚了日常开发和生活中常用工具的网站，致力于提供简洁、高效的在线工具体验。</p>
          <p>所有工具均<strong class="text-[var(--text-primary)]">免费使用</strong>，无需注册，无需登录。</p>
          <p>部分工具（如图片处理）完全在<strong class="text-[var(--text-primary)]">本地浏览器运行</strong>，不会上传您的数据，保护隐私安全。</p>
        </div>
      </div>

      <!-- 声明 -->
      <div class="card p-6">
        <h2 class="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <span class="text-xl">📋</span> 网站声明
        </h2>
        <div class="space-y-2">
          <div v-for="item in declarations" :key="item" class="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
            <svg class="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
            </svg>
            {{ item }}
          </div>
        </div>
      </div>
    </div>

    <!-- 技术栈 -->
    <div class="card p-6 mb-6">
      <h2 class="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
        <span class="text-xl">⚡</span> 技术栈
      </h2>
      <div class="flex flex-wrap gap-3">
        <span v-for="tech in techs" :key="tech.name" class="flex items-center gap-2 px-3 py-2 bg-[var(--bg-secondary)] rounded-xl text-sm">
          <span>{{ tech.icon }}</span>
          <span class="font-medium text-[var(--text-primary)]">{{ tech.name }}</span>
          <span class="text-[var(--text-secondary)]">{{ tech.desc }}</span>
        </span>
      </div>
    </div>

    <!-- 工具统计 -->
    <div class="card p-6 mb-6">
      <h2 class="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
        <span class="text-xl">🧰</span> 工具分类
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div v-for="cat in catStats" :key="cat.name" class="bg-[var(--bg-secondary)] rounded-xl p-4 text-center">
          <div class="text-2xl mb-1">{{ cat.icon }}</div>
          <div class="font-bold text-[var(--text-primary)]">{{ cat.count }}</div>
          <div class="text-xs text-[var(--text-secondary)]">{{ cat.name }}</div>
        </div>
      </div>
    </div>

    <!-- 底部链接 -->
    <div class="text-center">
      <p class="text-sm text-[var(--text-secondary)] mb-4">始于 2026 · By SuperiorHui</p>
      <div class="flex justify-center gap-4 flex-wrap">
        <a href="https://superiorhui.github.io" target="_blank" rel="noopener noreferrer" class="btn-secondary">
          🌐 主页
        </a>
        <a href="https://github.com/superiorhui" target="_blank" rel="noopener noreferrer" class="btn-secondary">
          💻 GitHub
        </a>
        <router-link to="/" class="btn-primary">
          🧰 开始使用
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { tools, categories } from '../data/tools.js'

const declarations = [
  '所有工具均免费使用，不收取任何费用',
  '不收集、不存储用户的个人数据',
  '图片等敏感数据在本地处理，不上传服务器',
  '无侵入式广告，保持简洁的使用体验',
]

const techs = [
  { icon: '💚', name: 'Vue 3', desc: '前端框架' },
  { icon: '⚡', name: 'Vite', desc: '构建工具' },
  { icon: '🎨', name: 'Tailwind CSS', desc: 'UI样式' },
  { icon: '🔀', name: 'Vue Router', desc: '路由管理' },
]

// 统计各分类工具数量
const catStats = computed(() => {
  const counts = {}
  tools.forEach(t => { counts[t.category] = (counts[t.category] || 0) + 1 })
  return categories.filter(c => c.id !== 'all').map(cat => ({
    icon: cat.icon,
    name: cat.name,
    count: counts[cat.id] || 0,
  }))
})
</script>
