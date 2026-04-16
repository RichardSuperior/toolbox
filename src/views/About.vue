<template>
  <div class="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
    <!-- Hero -->
    <div class="text-center mb-12">
      <div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent rounded-3xl flex items-center justify-center text-4xl shadow-lg mx-auto mb-5">🧰</div>
      <h1 class="text-3xl font-bold text-[var(--text-primary)] mb-3">关于在线工具箱</h1>
      <p class="text-[var(--text-secondary)] text-lg max-w-xl mx-auto">一个简单、快速、实用的在线工具集合</p>
    </div>

    <!-- 个人介绍 -->
    <div class="card p-6 mb-6">
      <h2 class="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
        <span class="text-xl">👨‍💻</span> 关于作者
      </h2>
      <div class="space-y-4">
        <div class="flex flex-col md:flex-row gap-6">
          <div class="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent rounded-2xl flex items-center justify-center text-5xl shrink-0 mx-auto md:mx-0">钟</div>
          <div class="flex-1 text-center md:text-left">
            <h3 class="text-xl font-bold text-[var(--text-primary)] mb-2">钟老师</h3>
            <p class="text-primary-500 font-medium mb-3">AI大模型应用开发教学导师 · 全栈技术开发者</p>
            <p class="text-sm text-[var(--text-secondary)] leading-relaxed">
              深耕 AI大模型应用开发 + 全栈技术多年，现居深圳龙岗。专注于「技术落地与体系化教学」双赛道，
              既主导企业级AI与微服务项目从0到1落地，也坚持以「实战驱动」理念培养技术人才，让学员真正掌握能直接应用于工作的核心技能。
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 教学理念 -->
    <div class="card p-6 mb-6">
      <h2 class="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
        <span class="text-xl">🎯</span> 教学理念：拒绝空谈，实战为王
      </h2>
      <div class="grid sm:grid-cols-2 gap-4">
        <div v-for="item in teachingPhilosophy" :key="item.title" class="bg-[var(--bg-secondary)] rounded-xl p-4">
          <div class="font-semibold text-[var(--text-primary)] mb-1">{{ item.title }}</div>
          <div class="text-sm text-[var(--text-secondary)]">{{ item.desc }}</div>
        </div>
      </div>
    </div>

    <!-- 核心技术栈 -->
    <div class="card p-6 mb-6">
      <h2 class="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
        <span class="text-xl">🛠️</span> 核心技术栈
      </h2>
      <div class="space-y-4">
        <div>
          <div class="text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
            <span>🤖</span> AI与智能应用
          </div>
          <div class="flex flex-wrap gap-2">
            <span v-for="tech in aiTechs" :key="tech" class="px-3 py-1 bg-primary-500/10 text-primary-500 rounded-full text-sm">{{ tech }}</span>
          </div>
        </div>
        <div>
          <div class="text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
            <span>💻</span> 全栈开发
          </div>
          <div class="flex flex-wrap gap-2">
            <span v-for="tech in fullstackTechs" :key="tech" class="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">{{ tech }}</span>
          </div>
        </div>
        <div>
          <div class="text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
            <span>☁️</span> 云原生
          </div>
          <div class="flex flex-wrap gap-2">
            <span v-for="tech in cloudTechs" :key="tech" class="px-3 py-1 bg-purple-500/10 text-purple-500 rounded-full text-sm">{{ tech }}</span>
          </div>
        </div>
      </div>
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

    <!-- 联系方式 -->
    <div class="card p-6 mb-6">
      <h2 class="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
        <span class="text-xl">📬</span> 联系方式
      </h2>
      <div class="grid sm:grid-cols-2 gap-4">
        <a v-for="contact in contacts" :key="contact.name" :href="contact.url" target="_blank" rel="noopener noreferrer" 
           class="flex items-center gap-3 p-4 bg-[var(--bg-secondary)] rounded-xl hover:bg-primary-500/10 transition-colors group">
          <span class="text-2xl">{{ contact.icon }}</span>
          <div>
            <div class="font-medium text-[var(--text-primary)] group-hover:text-primary-500">{{ contact.name }}</div>
            <div class="text-xs text-[var(--text-secondary)]">{{ contact.desc }}</div>
          </div>
        </a>
      </div>
    </div>

    <!-- 友情链接 -->
    <div class="card p-6 mb-6">
      <h2 class="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
        <span class="text-xl">🔗</span> 友情链接
      </h2>
      <div class="flex flex-wrap gap-3">
        <a v-for="link in friendlyLinks" :key="link.url" :href="link.url" target="_blank" rel="noopener noreferrer"
           class="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] rounded-xl hover:bg-primary-500/10 transition-colors group">
          <span>{{ link.icon }}</span>
          <span class="text-sm text-[var(--text-primary)] group-hover:text-primary-500">{{ link.name }}</span>
        </a>
      </div>
    </div>

    <!-- 底部链接 -->
    <div class="text-center">
      <p class="text-sm text-[var(--text-secondary)] mb-4">始于 2026 · By SuperiorHui</p>
      <div class="flex justify-center gap-4 flex-wrap">
        <a href="https://aijiuming.com" target="_blank" rel="noopener noreferrer" class="btn-secondary">
          🌐 技术博客
        </a>
        <a href="https://aijiuming.com" target="_blank" rel="noopener noreferrer" class="btn-secondary">
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

const teachingPhilosophy = [
  { title: '项目驱动学习', desc: '所有课程围绕企业真实需求设计' },
  { title: '从0到1体系化', desc: '兼顾基础扎实与前沿技能' },
  { title: '技术本质拆解', desc: '不仅会用，更懂原理' },
  { title: '终身技术支持', desc: '课程结束后提供长期答疑' },
]

const aiTechs = ['LangChain', 'LangGraph', 'RAG检索增强', 'AI Agent', '向量数据库', '大模型微调']
const fullstackTechs = ['Java', 'Spring Cloud', 'Python', 'Vue', 'React', '数据分析']
const cloudTechs = ['Docker', 'Kubernetes']

const contacts = [
  { name: 'AI大模型技术主页', desc: 'me.aijiuming.com', url: 'https://me.aijiuming.com', icon: '🤖' },
  { name: 'B站技术频道', desc: '钟老师 | AI全栈实战', url: 'https://space.bilibili.com/476271437', icon: '📺' },
  { name: 'GitHub开源', desc: 'superiorHui', url: 'https://github.com/superiorHui', icon: '💻' },
  { name: '技术博客', desc: 'aijiuming.com', url: 'https://aijiuming.com', icon: '📝' },
]

const friendlyLinks = [
  { name: 'AI大模型技术博客', url: 'https://aijiuming.com', icon: '🔗' },
  { name: 'AI导航站', url: 'https://www.aicodehome.com', icon: '🚀' },
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
