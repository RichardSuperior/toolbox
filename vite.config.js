import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  // 优先级：环境变量 > 命令
  // 本地开发: base = './'
  // GitHub Pages 子路径: base = '/toolbox/'
  // 自定义域名根路径: base = '/'
  let base = './'
  
  if (command === 'build') {
    // 构建时使用环境变量
    if (env.VITE_BASE_URL) {
      base = env.VITE_BASE_URL
    } else {
      // 默认使用 GitHub Pages 子路径
      base = '/toolbox/'
    }
  }
  
  return {
    base,
    plugins: [vue()],
    // 生产优化
    build: {
      // 关闭构建时生成 sourcemap（减小体积）
      sourcemap: false,
      // 开启 rollup 分块策略
      rollupOptions: {
        output: {
          // 手动分包策略
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('vue') || id.includes('vue-router')) {
                return 'vue-vendor'
              }
            }
          },
        },
      },
      // 压缩配置
      minify: 'esbuild',
      // 开启 gzip 压缩报告
      reportCompressedSize: true,
      // 警告文件大小阈值
      chunkSizeWarningLimit: 500,
    },
    // 开发服务器优化
    server: {
      // 开启 gzip 压缩
      compress: true,
      // 端口
      port: 5173,
    },
    // 预览服务器优化
    preview: {
      compress: true,
    },
    // 依赖优化
    optimizeDeps: {
      include: ['vue', 'vue-router'],
    },
  }
})
