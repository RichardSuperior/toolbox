<template>
  <footer class="border-t border-[var(--border-color)] mt-16">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-7 h-7 bg-gradient-to-br from-primary-500 to-accent rounded-lg flex items-center justify-center text-white text-xs font-bold">T</div>
          <div>
            <div class="text-sm font-semibold text-[var(--text-primary)]">在线工具箱</div>
            <div class="text-xs text-[var(--text-secondary)]">简单、快速、实用</div>
          </div>
        </div>
        <div class="flex items-center gap-6 text-xs text-[var(--text-secondary)]">
          <router-link to="/" class="hover:text-primary-500 transition-colors">首页</router-link>
          <router-link to="/about" class="hover:text-primary-500 transition-colors">关于</router-link>
          <span>共 {{ toolCount }} 个工具</span>
        </div>
        <div class="flex items-center gap-4 text-xs">
          <span class="text-[var(--text-secondary)]">友链:</span>
          <a href="https://aijiuming.com" target="_blank" rel="noopener noreferrer" class="text-primary-500 hover:underline">AI技术博客</a>
          <span>|</span>
          <a href="https://www.aicodehome.com" target="_blank" rel="noopener noreferrer" class="text-primary-500 hover:underline">AI导航站</a>
        </div>
        <div class="text-xs text-[var(--text-secondary)]">
          始于 2026 · By <a href="https://aijiuming.com" target="_blank" class="text-primary-500 hover:underline">SuperiorHui</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { tools } from '../data/tools.js'
const toolCount = tools.length
</script>
