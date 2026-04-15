<template>
  <div :class="{ dark: isDark }" class="min-h-screen" :lang="'zh-CN'">
    <NavBar :isDark="isDark" @toggle-dark="isDark = !isDark" />
    <main id="main-content" class="min-h-[calc(100vh-64px-80px)]" role="main" tabindex="-1">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'

const isDark = ref(localStorage.getItem('theme') === 'dark')

watch(isDark, (val) => {
  localStorage.setItem('theme', val ? 'dark' : 'light')
})
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.2s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
