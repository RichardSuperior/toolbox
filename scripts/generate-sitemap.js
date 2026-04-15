// Sitemap 生成脚本
// 运行: node scripts/generate-sitemap.js

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')

// 读取工具数据
const toolsModule = await import('../src/data/tools.js')
const { tools, categories } = toolsModule

const baseUrl = 'https://toolbox.example.com'
const today = new Date().toISOString().split('T')[0]

// 生成 URL 列表
const urls = [
  { loc: baseUrl + '/', priority: '1.0', changefreq: 'daily' },
  { loc: baseUrl + '/about', priority: '0.5', changefreq: 'monthly' },
]

// 添加工具页面
tools.forEach(tool => {
  urls.push({
    loc: baseUrl + tool.path,
    priority: tool.hot ? '0.9' : '0.7',
    changefreq: 'weekly'
  })
})

// 生成 XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

// 输出到 public 目录
fs.writeFileSync(path.join(rootDir, 'public', 'sitemap.xml'), sitemap)
console.log(`✅ 生成 sitemap.xml (${urls.length} 个 URL)`)
