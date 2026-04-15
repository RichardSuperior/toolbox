<template>
  <div class="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in">
    <div class="text-8xl mb-6">🔍</div>
    <h1 class="text-4xl font-bold text-[var(--text-primary)] mb-3">404</h1>
    <p class="text-[var(--text-secondary)] text-lg mb-8">页面不存在，也许是链接出了问题</p>
    <div class="flex justify-center gap-3">
      <router-link to="/" class="btn-primary">返回首页</router-link>
      <button @click="$router.back()" class="btn-secondary">返回上一页</button>
    </div>
  </div>
</template>
