# 部署到腾讯 EdgeOne Pages

## 方案一：CLI 手动部署（推荐国内用户）

### 1. 安装 EdgeOne CLI

```bash
npm install -g edgeone
```

如果 npm 安装失败，尝试：
```bash
# 使用淘宝镜像
npm install -g edgeone --registry=https://registry.npmmirror.com

# 或使用 yarn
yarn global add edgeone
```

### 2. 构建项目

```bash
cd toolbox
npm install
npm run build
npm run sitemap
```

### 3. 登录并部署

```bash
# 登录（选择 Global 国际站）
edgeone login

# 部署到生产环境
edgeone pages deploy ./dist -n toolbox

# 或部署到预览环境
edgeone pages deploy ./dist -n toolbox -e preview
```

### 4. 获取访问地址

部署成功后，控制台会显示分配的域名，例如：
```
✅ Deploy successful!
🌐 Preview: https://xxx.pages.edgeone.dev
🌐 Production: https://xxx.pages.edgeone.ai
```

---

## 方案二：GitHub Actions 自动部署

### 前置条件
- 项目同步到 GitHub 仓库
- 在 EdgeOne Pages 控制台生成 API Token

### 步骤

#### 1. 同步项目到 GitHub

```bash
# 添加 GitHub 远程仓库（替换为你的仓库地址）
git remote add github https://github.com/你的用户名/toolbox.git
git push github main
```

#### 2. 获取 EdgeOne API Token

1. 访问 [EdgeOne Pages 控制台](https://pages.edgeone.ai)
2. 进入项目设置 → API Token
3. 生成新 Token 并复制

#### 3. 配置 GitHub Secrets

1. 进入 GitHub 仓库 → Settings → Secrets and variables → Actions
2. 添加新 Secret：
   - Name: `EDGEONE_TOKEN`
   - Value: 粘贴你复制的 Token

#### 4. 推送代码自动部署

```bash
git push github main
```

每次推送到 main 分支，都会自动触发构建和部署。

---

## 方案三：手动拖拽上传

### 步骤

1. 构建项目：
```bash
npm run build
npm run sitemap
```

2. 访问 [EdgeOne Pages 控制台](https://pages.edgeone.ai)

3. 创建新项目 → 选择「手动上传」

4. 将 `dist` 文件夹压缩为 ZIP 上传

---

## 自定义域名配置（可选）

1. 在 EdgeOne Pages 控制台进入「域名管理」
2. 添加自定义域名
3. 按提示配置 DNS 记录
4. 等待 SSL 证书自动签发

---

## 部署后验证清单

- [ ] 首页可访问
- [ ] 工具页面正常加载
- [ ] 搜索功能正常
- [ ] 暗色模式切换正常
- [ ] 移动端响应式正常
- [ ] sitemap.xml 可访问
- [ ] robots.txt 可访问
