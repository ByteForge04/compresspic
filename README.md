<div align="center">

# 🖼️ CompressPic

### 免费在线图片处理工具集

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://compresspic-8fn.pages.dev)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**浏览器本地处理 · 保护隐私 · 无需上传 · 完全免费**

[🇨🇳 中文](#功能) | [🇺🇸 English](#features)

</div>

---

## 功能

### 🛠️ 7大图片处理工具

| 工具 | 说明 | 链接 |
|------|------|------|
| 📦 图片压缩 | 压缩 JPG/PNG/WebP，最高减小 80% 体积 | [使用 →](https://compresspic-8fn.pages.dev) |
| 🔄 格式转换 | JPG/PNG/WebP 之间自由转换 | [使用 →](https://compresspic-8fn.pages.dev/convert) |
| ✂️ 图片裁剪 | 自由裁剪 + 1:1/4:3/16:9/3:2 预设比例 | [使用 →](https://compresspic-8fn.pages.dev/crop) |
| 🔏 图片加水印 | 自定义文字/颜色/透明度/6种位置含平铺 | [使用 →](https://compresspic-8fn.pages.dev/watermark) |
| ⚡ 图片转WebP | 批量转 WebP，体积减小 25-35% | [使用 →](https://compresspic-8fn.pages.dev/webp) |
| 📋 批量压缩 | 一次压缩 50 张，进度条 + ZIP 打包下载 | [使用 →](https://compresspic-8fn.pages.dev/batch-compress) |
| 📐 图片尺寸调整 | 自定义宽高/锁定比例/百分比缩放 | [使用 →](https://compresspic-8fn.pages.dev/resize) |

### ✨ 核心特性

- 🔒 **隐私安全** — 所有图片处理在浏览器本地完成，不会上传到任何服务器
- 🆓 **完全免费** — 无需注册，无隐藏收费，无文件数量限制
- ⚡ **极速处理** — 利用浏览器原生 Canvas API，即时完成
- 📱 **全设备支持** — 响应式设计，手机/平板/电脑均可使用
- 📦 **批量处理** — 支持多张图片同时处理，一键 ZIP 下载

### 📝 博客教程

- [图片压缩完全指南：从原理到实践](https://compresspic-8fn.pages.dev/blog/image-compression-guide)
- [WebP格式详解：为什么你应该使用WebP](https://compresspic-8fn.pages.dev/blog/webp-format-guide)
- [JPG vs PNG vs WebP：图片格式全面对比](https://compresspic-8fn.pages.dev/blog/image-format-comparison)
- [网站图片优化指南：提升加载速度的7个技巧](https://compresspic-8fn.pages.dev/blog/website-image-optimization)

---

## Features

### 🛠️ 7 Image Processing Tools

| Tool | Description | Link |
|------|-------------|------|
| 📦 Image Compression | Compress JPG/PNG/WebP, up to 80% size reduction | [Try →](https://compresspic-8fn.pages.dev) |
| 🔄 Format Conversion | Convert between JPG, PNG, and WebP | [Try →](https://compresspic-8fn.pages.dev/convert) |
| ✂️ Image Crop | Free crop + preset ratios (1:1, 4:3, 16:9, 3:2) | [Try →](https://compresspic-8fn.pages.dev/crop) |
| 🔏 Watermark | Custom text/color/opacity/6 positions including tile | [Try →](https://compresspic-8fn.pages.dev/watermark) |
| ⚡ Convert to WebP | Batch convert to WebP, 25-35% smaller | [Try →](https://compresspic-8fn.pages.dev/webp) |
| 📋 Batch Compress | Up to 50 images, progress bar + ZIP download | [Try →](https://compresspic-8fn.pages.dev/batch-compress) |
| 📐 Resize | Custom dimensions/lock aspect ratio/percentage scale | [Try →](https://compresspic-8fn.pages.dev/resize) |

---

## 技术栈

- **Framework**: [Next.js 16](https://nextjs.org) (App Router + Static Export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Image Processing**: Canvas API + OffscreenCanvas (Web Worker)
- **Batch Download**: JSZip
- **Deployment**: Cloudflare Pages
- **SEO**: JSON-LD Structured Data, OpenGraph, Twitter Cards, Sitemap

## 快速开始

```bash
# 克隆项目
git clone https://github.com/ByteForge04/compresspic.git
cd compresspic

# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 部署到 Cloudflare Pages
npx wrangler pages deploy out --project-name compresspic
```

## 项目结构

```
compresspic/
├── app/
│   ├── page.tsx              # 首页（图片压缩）
│   ├── layout.tsx            # 根布局（SEO + PWA）
│   ├── convert/              # 格式转换
│   ├── crop/                 # 图片裁剪
│   ├── watermark/            # 图片加水印
│   ├── webp/                 # 图片转WebP
│   ├── batch-compress/       # 批量压缩
│   ├── resize/               # 图片尺寸调整
│   ├── blog/                 # 博客教程
│   ├── faq/                  # 常见问题
│   ├── about/                # 关于
│   └── privacy/              # 隐私政策
├── components/               # React 组件
│   ├── Navbar.tsx            # 导航栏
│   ├── Footer.tsx            # 页脚
│   ├── DropZone.tsx          # 拖拽上传
│   ├── QualitySlider.tsx     # 质量滑块
│   ├── ImageCard.tsx         # 图片卡片
│   ├── CompareView.tsx       # 对比视图
│   ├── BatchActions.tsx      # 批量操作
│   ├── ToolCard.tsx          # 工具卡片
│   ├── HowItWorks.tsx        # 使用说明
│   ├── ComparisonTable.tsx   # 对比表格
│   └── FeatureSection.tsx    # 特性展示
├── lib/                      # 工具函数
│   ├── compress.ts           # 压缩核心逻辑
│   ├── types.ts              # TypeScript 类型
│   └── zip.ts                # ZIP 打包下载
└── public/                   # 静态资源
    ├── sitemap.xml           # 站点地图
    ├── robots.txt            # 爬虫规则
    ├── manifest.json         # PWA 清单
    └── icon.svg              # 应用图标
```

## License

MIT
