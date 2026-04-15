<template>
  <div class="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in">
    <!-- 404 图形 -->
    <div class="relative inline-block mb-8">
      <div class="text-[120px] leading-none font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary-400 to-accent opacity-80">
        404
      </div>
      <div class="absolute -top-2 -right-4 text-4xl animate-bounce-slow">🔧</div>
    </div>

    <h1 class="text-2xl font-bold text-[var(--text-primary)] mb-3">页面找不到了</h1>
    <p class="text-[var(--text-secondary)] mb-4">
      您访问的页面不存在或已被移除
    </p>

    <!-- 建议操作 -->
    <div class="card p-6 mb-8 text-left max-w-md mx-auto">
      <h2 class="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
        <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
        您可以尝试
      </h2>
      <ul class="space-y-2 text-sm text-[var(--text-secondary)]">
        <li class="flex items-center gap-2">
          <span class="text-green-500">✓</span>
          <router-link to="/" class="text-primary-500 hover:underline">返回首页</router-link>浏览所有工具
        </li>
        <li class="flex items-center gap-2">
          <span class="text-green-500">✓</span>
          检查 URL 是否正确
        </li>
        <li class="flex items-center gap-2">
          <span class="text-green-500">✓</span>
          使用搜索功能查找工具
        </li>
      </ul>
    </div>

    <!-- 操作按钮 -->
    <div class="flex justify-center gap-3 flex-wrap">
      <router-link to="/" class="btn-primary">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
        返回首页
      </router-link>
      <router-link to="/about" class="btn-secondary">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        关于我们
      </router-link>
    </div>
  </div>
</template>

<style scoped>
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(10deg); }
}
.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}
</style>
