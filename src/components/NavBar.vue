<template>
  <header class="sticky top-0 z-50 bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border-color)]">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2.5 no-underline shrink-0" aria-label="在线工具箱 - 首页">
        <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md" role="img" aria-hidden="true">
          T
        </div>
        <span class="font-bold text-lg text-[var(--text-primary)]">在线工具箱</span>
      </router-link>

      <!-- 桌面端导航 - 分类标签 -->
      <nav class="hidden lg:flex items-center gap-0.5">
        <router-link to="/" class="nav-tab" active-class="nav-tab-active" :class="{ 'nav-tab-active': $route.path === '/' }">
          <span>首页</span>
        </router-link>
        <div
          v-for="cat in navCategories"
          :key="cat.id"
          class="relative group"
        >
          <button class="nav-tab flex items-center gap-1" :class="{ 'nav-tab-active': $route.path.startsWith('/' + cat.id) || activeNavCat === cat.id }" @click="$router.push('/?cat=' + cat.id)">
            <span>{{ cat.icon }}</span>
            <span>{{ cat.name }}</span>
            <svg class="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <!-- 下拉：显示该分类前6个工具 -->
          <div class="dropdown">
            <div class="dropdown-header">
              <span class="dropdown-title">{{ cat.icon }} {{ cat.name }}</span>
              <span class="dropdown-count">{{ cat.count }} 个工具</span>
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-grid">
              <router-link
                v-for="t in cat.tools.slice(0, 6)"
                :key="t.id"
                :to="t.path"
                class="dropdown-item"
              >
                <span class="item-icon">{{ t.icon }}</span>
                <div class="item-text">
                  <span class="item-name">{{ t.name }}</span>
                  <span class="item-desc">{{ t.desc }}</span>
                </div>
                <span v-if="t.hot" class="item-hot">HOT</span>
              </router-link>
            </div>
            <div class="dropdown-footer" @click="$router.push('/?cat=' + cat.id); activeNavCat = ''">
              <span>查看全部 {{ cat.count }} 个工具 →</span>
            </div>
          </div>
        </div>
        <router-link to="/about" class="nav-tab" active-class="nav-tab-active">
          <span>关于</span>
        </router-link>
      </nav>

      <!-- 右侧操作 -->
      <div class="flex items-center gap-1.5">
        <!-- 搜索 -->
        <div class="relative hidden sm:block">
          <label for="tool-search" class="sr-only">搜索工具</label>
          <input
            id="tool-search"
            v-model="search"
            @focus="showSearch = true"
            @blur="onSearchBlur"
            type="text"
            role="combobox"
            aria-expanded="false"
            aria-controls="search-results"
            aria-label="搜索工具"
            placeholder="搜索工具..."
            class="w-36 lg:w-48 pl-8 pr-3 py-1.5 text-sm bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg outline-none focus:border-primary-500 transition-all duration-200"
          />
          <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <!-- 搜索结果 -->
          <div v-if="showSearch && searchResults.length" id="search-results" role="listbox" class="absolute top-full mt-1.5 right-0 w-72 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl shadow-2xl overflow-hidden z-50">
            <div class="px-3 py-1.5 text-xs text-[var(--text-secondary)] border-b border-[var(--border-color)]">
              找到 {{ searchResults.length }} 个结果
            </div>
            <router-link
              v-for="t in searchResults"
              :key="t.id"
              :to="t.path"
              @click="showSearch = false; search = ''"
              class="flex items-center gap-3 px-3 py-2.5 hover:bg-[var(--bg-secondary)] transition-colors"
            >
              <span class="text-base">{{ t.icon }}</span>
              <div class="min-w-0 flex-1">
                <div class="text-sm font-medium text-[var(--text-primary)] truncate">{{ t.name }}</div>
                <div class="text-xs text-[var(--text-secondary)] truncate">{{ t.desc }}</div>
              </div>
              <span class="text-xs px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] text-[var(--text-secondary)] shrink-0">{{ getCatName(t.category) }}</span>
            </router-link>
            <div v-if="!searchResults.length && search.trim()" class="px-3 py-4 text-center text-sm text-[var(--text-secondary)]">
              未找到相关工具
            </div>
          </div>
        </div>

        <!-- 暗色模式 -->
        <button @click="$emit('toggleDark')" class="btn-icon" :aria-label="isDark ? '切换亮色模式' : '切换暗色模式'" :title="isDark ? '切换亮色模式' : '切换暗色模式'">
          <svg v-if="!isDark" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
        </button>

        <!-- 移动端菜单 -->
        <button @click="mobileOpen = !mobileOpen" class="btn-icon lg:hidden" :aria-expanded="mobileOpen" aria-controls="mobile-menu" aria-label="打开菜单">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 移动端全屏菜单 -->
    <transition name="slide">
      <div v-if="mobileOpen" id="mobile-menu" class="lg:hidden border-t border-[var(--border-color)] bg-[var(--bg-primary)] overflow-y-auto max-h-[80vh]">
        <!-- 搜索 -->
        <div class="px-4 py-3 border-b border-[var(--border-color)]">
          <input
            v-model="search"
            type="text"
            placeholder="搜索工具..."
            class="w-full pl-9 pr-3 py-2 text-sm bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg outline-none focus:border-primary-500"
          />
        </div>
        <!-- 搜索结果 -->
        <div v-if="search.trim() && searchResults.length" class="px-4 py-2">
          <div class="text-xs text-[var(--text-secondary)] mb-2 px-2">搜索结果</div>
          <router-link
            v-for="t in searchResults"
            :key="t.id"
            :to="t.path"
            @click="mobileOpen = false; search = ''"
            class="flex items-center gap-3 px-3 py-2.5 hover:bg-[var(--bg-secondary)] rounded-lg"
          >
            <span class="text-base">{{ t.icon }}</span>
            <div>
              <div class="text-sm font-medium text-[var(--text-primary)]">{{ t.name }}</div>
              <div class="text-xs text-[var(--text-secondary)]">{{ t.desc }}</div>
            </div>
          </router-link>
        </div>
        <!-- 分类列表 -->
        <div v-else>
          <router-link to="/" @click="mobileOpen = false" class="mobile-nav-item">
            🏠 首页
          </router-link>
          <template v-for="cat in navCategories" :key="cat.id">
            <div class="mobile-cat-header" @click="toggleMobileCat(cat.id)">
              <span>{{ cat.icon }} {{ cat.name }}</span>
              <span class="text-xs opacity-60">{{ cat.count }}</span>
              <svg class="w-3 h-3 transition-transform" :class="{ 'rotate-180': mobileExpandedCats.includes(cat.id) }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
            <div v-if="mobileExpandedCats.includes(cat.id)" class="bg-[var(--bg-secondary)]/50">
              <router-link
                v-for="t in cat.tools"
                :key="t.id"
                :to="t.path"
                @click="mobileOpen = false"
                class="mobile-nav-sub"
              >
                <span>{{ t.icon }}</span>
                <span>{{ t.name }}</span>
              </router-link>
            </div>
          </template>
          <router-link to="/about" @click="mobileOpen = false" class="mobile-nav-item">
            ℹ️ 关于
          </router-link>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { tools, categories } from '../data/tools.js'

defineProps(['isDark'])
defineEmits(['toggleDark'])

const search = ref('')
const showSearch = ref(false)
const mobileOpen = ref(false)
const activeNavCat = ref('')
const mobileExpandedCats = ref([])

const navCategories = computed(() => {
  return categories.filter(c => c.id !== 'all').map(cat => ({
    ...cat,
    count: tools.filter(t => t.category === cat.id).length,
    tools: tools.filter(t => t.category === cat.id),
  })).filter(c => c.count > 0)
})

const searchResults = computed(() => {
  if (!search.value.trim()) return []
  const q = search.value.toLowerCase()
  return tools.filter(t => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)).slice(0, 8)
})

function getCatName(catId) {
  const cat = categories.find(c => c.id === catId)
  return cat ? cat.name : catId
}

function toggleMobileCat(catId) {
  const idx = mobileExpandedCats.value.indexOf(catId)
  if (idx >= 0) {
    mobileExpandedCats.value.splice(idx, 1)
  } else {
    mobileExpandedCats.value.push(catId)
  }
}

function onSearchBlur() {
  setTimeout(() => { showSearch.value = false }, 200)
}
</script>

<style scoped>
.nav-tab {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  font-size: 13px;
  color: var(--text-secondary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.nav-tab:hover {
  color: var(--text-primary);
  background: var(--bg-secondary);
}
.nav-tab-active {
  color: var(--primary-color, #0969da);
  background: rgba(9, 105, 218, 0.08);
  font-weight: 500;
}

/* 下拉菜单 */
.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  width: 360px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
  padding: 8px 0;
  opacity: 0;
  visibility: hidden;
  transform: translateX(-50%) translateY(-4px);
  transition: all 0.15s ease;
  z-index: 100;
}
.group:hover .dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 14px 8px;
}
.dropdown-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}
.dropdown-count {
  font-size: 11px;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: 1px 8px;
  border-radius: 10px;
}
.dropdown-divider {
  height: 1px;
  background: var(--border-color);
  margin: 0 8px;
}
.dropdown-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  padding: 6px 8px;
  max-height: 280px;
  overflow-y: auto;
}
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  transition: background 0.1s;
  min-width: 0;
}
.dropdown-item:hover {
  background: var(--bg-secondary);
}
.item-icon {
  font-size: 18px;
  flex-shrink: 0;
  line-height: 1;
}
.item-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}
.item-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-desc {
  font-size: 10px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-hot {
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  background: #ff4757;
  padding: 1px 4px;
  border-radius: 3px;
  flex-shrink: 0;
}
.dropdown-footer {
  padding: 8px 14px;
  text-align: center;
  font-size: 12px;
  color: var(--primary-color, #0969da);
  cursor: pointer;
  border-top: 1px solid var(--border-color);
  margin-top: 2px;
  transition: background 0.1s;
}
.dropdown-footer:hover {
  background: rgba(9, 105, 218, 0.06);
}

/* 移动端 */
.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  font-size: 14px;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color);
  transition: background 0.1s;
}
.mobile-nav-item:hover, .mobile-nav-item.router-link-active {
  color: var(--primary-color, #0969da);
  background: rgba(9, 105, 218, 0.06);
}
.mobile-cat-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary)/30;
}
.mobile-nav-sub {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px 8px 32px;
  font-size: 13px;
  color: var(--text-secondary);
  transition: background 0.1s;
}
.mobile-nav-sub:hover {
  color: var(--primary-color, #0969da);
  background: rgba(9, 105, 218, 0.04);
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.2s ease;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.btn-icon {
  padding: 6px;
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-icon:hover {
  color: var(--text-primary);
  background: var(--bg-secondary);
}
</style>
