<template>
  <div class="max-w-4xl mx-auto px-4 py-10 animate-fade-in">
    <!-- 面包屑 -->
    <nav class="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-8">
      <router-link to="/" class="hover:text-primary-500 transition-colors">首页</router-link>
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
      <span class="text-[var(--text-primary)] font-medium">{{ title }}</span>
    </nav>

    <!-- 标题区 -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2">
        <div class="text-3xl">{{ icon }}</div>
        <h1 class="section-title">{{ title }}</h1>
      </div>
      <p class="section-sub">{{ subtitle }}</p>
    </div>

    <!-- 工具内容 -->
    <slot />

    <!-- 知识介绍 -->
    <div v-if="$slots.knowledge" class="mt-10 card p-6">
      <h2 class="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
        <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        知识介绍
      </h2>
      <slot name="knowledge" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String,
  icon: { type: String, default: '🔧' },
})
</script>
