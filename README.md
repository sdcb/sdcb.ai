# sdcb.ai - 官方网站

> **Serving Dotnet, Constructing Brilliant** - 服务.NET，构建卓越

## 📖 项目简介

sdcb.ai 是 sdcb 品牌的官方网站，展示了我们在 .NET 生态系统中提供的全栈 AI 解决方案。从企业级 AI 应用到底层推理引擎，从多媒体处理到高精度计算，我们为 .NET 社区提供经过实战验证的技术栈。

## 🎯 品牌定位

- **品牌中心**: 展示 sdcb 在 .NET 生态中的权威地位和技术积累
- **技术枢纽**: 连接开发者与前沿 AI 技术的桥梁
- **社区服务**: 由微软 MVP 创立，深度服务 .NET 开发者社区

## ✨ 网站特性

### 1. **专业的视觉设计**
- 现代化的渐变色彩系统
- 企业级的视觉语言
- 响应式设计，完美适配各种设备

### 2. **丰富的内容区域**
- **Hero 区**: 强有力的品牌宣言和核心价值主张
- **品牌理念**: 阐述"服务.NET，构建卓越"的使命
- **旗舰产品**: 重点展示 Sdcb Chats 企业级 AI 应用
- **核心基础设施**: 展示 PaddleSharp、OpenVINO.NET 等开源项目
- **权威与思想**: 突出微软 MVP 背景和技术影响力
- **页脚**: 完整的链接导航和社交媒体入口

### 3. **交互体验增强**
- 平滑滚动导航
- 元素进入视口时的渐入动画
- 统计数字的动态计数效果
- 卡片悬停交互效果
- 优化的性能和可访问性

## 🚀 快速开始

### 本地运行

1. **克隆仓库**
```bash
git clone https://github.com/sdcb/sdcb.ai.git
cd sdcb.ai
```

2. **启动本地服务器**

使用 Python (如果已安装):
```bash
python -m http.server 8000
```

使用 Node.js (如果已安装):
```bash
npx http-server -p 8000
```

使用 PowerShell (Windows):
```powershell
# 安装简单的 HTTP 服务器模块 (仅需一次)
Install-Module -Name HttpListener -Scope CurrentUser

# 或直接使用 Live Server 扩展在 VS Code 中打开
```

3. **在浏览器中访问**
```
http://localhost:8000
```

### 使用 VS Code Live Server

1. 安装 Live Server 扩展
2. 右键点击 `index.html`
3. 选择 "Open with Live Server"

## 📁 项目结构

```
sdcb.ai/
├── index.html          # 主页面 HTML
├── styles.css          # 样式表
├── script.js           # 交互脚本
└── README.md          # 项目说明
```

## 🎨 技术栈

- **HTML5**: 语义化标签，SEO 优化
- **CSS3**: 现代 CSS 特性，CSS 变量，Flexbox & Grid 布局
- **JavaScript (ES6+)**: 原生 JavaScript，无框架依赖
- **Google Fonts**: Inter 字体家族
- **SVG Icons**: 矢量图标，可缩放

## 🔧 核心功能

### 响应式设计
- 移动端优先的设计理念
- 断点: 480px, 768px, 1024px
- 自适应导航和布局

### 性能优化
- 最小化的外部依赖
- 优化的图片和资源加载
- Debounce 滚动事件处理
- Intersection Observer API 用于懒加载动画

### 可访问性
- 语义化 HTML 结构
- ARIA 标签支持
- 键盘导航友好
- 高对比度色彩方案

### SEO 优化
- 完整的 meta 标签
- 结构化的标题层级
- 描述性的链接文本
- 优化的页面加载速度

## 📦 核心产品展示

### Sdcb Chats
企业级 AI 对话应用，支持:
- 19+ AI 模型服务商统一管理
- 一键 Docker 部署
- 多数据库支持 (SQLite/SQL Server/PostgreSQL)
- Keycloak SSO 单点登录

### 开源基础设施
- **PaddleSharp**: PaddlePaddle .NET 绑定
- **OpenVINO.NET**: Intel OpenVINO 工具套件 .NET 封装
- **Sdcb.FFmpeg**: 高性能 FFmpeg .NET API
- **Sdcb.LibRaw**: RAW 图像处理库
- **Sdcb.Arithmetic**: 高精度算术库

## 🔗 重要链接

- **GitHub**: https://github.com/sdcb
- **技术博客**: https://www.cnblogs.com/sdcb
- **NuGet 包**: https://www.nuget.org/profiles/sdcb
- **Sdcb Chats**: https://github.com/sdcb/chats

## 🏆 品牌价值

### 微软 MVP
创始人是微软最有价值专家 (Microsoft Most Valuable Professional)，在技术社区拥有深厚影响力。

### 开源贡献
- 50+ 活跃开源项目
- 100K+ NuGet 总下载量
- 10K+ GitHub Stars
- 5+ 年持续贡献

### 技术深度
专注于:
- AI 推理引擎集成
- 高性能多媒体处理
- 密码学和高精度计算
- 企业级应用架构

## 📝 内容更新

### 如何更新内容

1. **修改文案**: 编辑 `index.html` 中对应的文本内容
2. **调整样式**: 修改 `styles.css` 中的 CSS 变量和样式规则
3. **添加功能**: 在 `script.js` 中扩展 JavaScript 功能

### 自定义配色方案

在 `styles.css` 的 `:root` 部分修改 CSS 变量:

```css
:root {
    --primary-color: #0066ff;      /* 主色调 */
    --secondary-color: #6366f1;    /* 辅助色 */
    --accent-color: #10b981;       /* 强调色 */
    /* ... 其他颜色变量 */
}
```

## 🌐 部署指南

### GitHub Pages

1. 推送代码到 GitHub 仓库
2. 进入仓库设置 → Pages
3. 选择主分支作为源
4. 访问 `https://[username].github.io/sdcb.ai`

### Vercel

1. 连接 GitHub 仓库到 Vercel
2. 部署配置自动检测
3. 自动部署每次提交

### Netlify

1. 拖拽项目文件夹到 Netlify
2. 或连接 Git 仓库自动部署
3. 配置自定义域名

## 📄 许可证

© 2025 sdcb. All rights reserved.

---

**Built with ❤️ by sdcb - Serving Dotnet, Constructing Brilliant**
