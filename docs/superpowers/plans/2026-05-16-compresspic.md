# CompressPic 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个免费在线图片压缩工具网站，浏览器本地处理，面向中文市场，部署到 Vercel。

**Architecture:** Next.js 14 App Router 静态导出，纯前端架构。所有图片压缩在浏览器端通过 Canvas API 完成，ZIP 打包通过 JSZip 实现。无后端依赖。

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, JSZip, file-saver

---

## 文件结构

```
d:\test2\
├── app/
│   ├── layout.tsx            # 全局布局 + SEO meta + JSON-LD
│   ├── page.tsx              # 首页（图片压缩工具）
│   ├── globals.css           # Tailwind 全局样式
│   └── not-found.tsx         # 404 页面
├── components/
│   ├── DropZone.tsx          # 拖拽/点击上传区域
│   ├── QualitySlider.tsx     # 质量调节滑块
│   ├── ImageCard.tsx         # 单张图片卡片
│   ├── CompareView.tsx       # 压缩前后对比模态框
│   ├── BatchActions.tsx      # 批量下载 ZIP
│   ├── FeatureSection.tsx    # 特性说明区
│   └── Footer.tsx            # 页脚
├── lib/
│   ├── types.ts              # 共享类型定义
│   ├── compress.ts           # 压缩核心逻辑
│   └── zip.ts                # ZIP 打包逻辑
├── public/
│   ├── robots.txt            # 搜索引擎抓取规则
│   └── og-image.png          # 社交分享图（后续替换）
├── next.config.mjs           # Next.js 配置（静态导出）
├── tailwind.config.ts        # Tailwind 配置
├── tsconfig.json             # TypeScript 配置
└── package.json              # 依赖管理
```

---

### Task 1: 项目初始化

**Files:**
- Create: `package.json`
- Create: `next.config.mjs`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `app/globals.css`

- [ ] **Step 1: 初始化 Next.js 项目**

Run:
```bash
cd d:\test2
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false --import-alias="@/*" --no-eslint --use-npm
```

选择默认选项。如果目录非空，确认覆盖。

- [ ] **Step 2: 安装额外依赖**

Run:
```bash
cd d:\test2
npm install jszip file-saver
npm install -D @types/file-saver
```

- [ ] **Step 3: 配置静态导出**

修改 `next.config.mjs`：

```mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

- [ ] **Step 4: 验证项目能正常构建**

Run:
```bash
cd d:\test2
npm run build
```

Expected: 构建成功，`out/` 目录生成

- [ ] **Step 5: 提交**

```bash
cd d:\test2
git init
git add .
git commit -m "feat: initialize Next.js project with static export"
```

---

### Task 2: 类型定义

**Files:**
- Create: `lib/types.ts`

- [ ] **Step 1: 创建共享类型文件**

```typescript
// lib/types.ts

export interface ImageItem {
  id: string;
  file: File;
  originalUrl: string;
  compressedUrl: string;
  compressedBlob: Blob;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
  status: 'pending' | 'compressing' | 'done' | 'error';
  error?: string;
}

export interface CompressOptions {
  quality: number;
  outputFormat: 'image/jpeg' | 'image/png' | 'image/webp';
}

export type FormatType = 'image/jpeg' | 'image/png' | 'image/webp';

export const SUPPORTED_FORMATS: FormatType[] = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

export const ACCEPTED_INPUT = '.jpg,.jpeg,.png,.webp';

export const MAX_FILES = 20;

export const DEFAULT_QUALITY = 75;
```

- [ ] **Step 2: 提交**

```bash
cd d:\test2
git add lib/types.ts
git commit -m "feat: add shared type definitions"
```

---

### Task 3: 压缩核心逻辑

**Files:**
- Create: `lib/compress.ts`

- [ ] **Step 1: 实现压缩函数**

```typescript
// lib/compress.ts

import { CompressOptions, ImageItem } from './types';

export function compressImage(
  file: File,
  options: CompressOptions
): Promise<{ blob: Blob; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('无法创建 Canvas 上下文'));
        return;
      }

      ctx.drawImage(img, 0, 0);

      const outputFormat = options.outputFormat === 'image/png' ? 'image/png' : options.outputFormat;

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('压缩失败'));
            return;
          }
          resolve({
            blob,
            width: img.width,
            height: img.height,
          });
        },
        outputFormat,
        options.outputFormat === 'image/png' ? undefined : options.quality / 100
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('图片加载失败'));
    };

    img.src = url;
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function calcSavings(original: number, compressed: number): number {
  if (original === 0) return 0;
  return Math.round((1 - compressed / original) * 100);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function getOutputFormat(file: File): 'image/jpeg' | 'image/png' | 'image/webp' {
  const type = file.type;
  if (type === 'image/png') return 'image/png';
  if (type === 'image/webp') return 'image/webp';
  return 'image/jpeg';
}
```

- [ ] **Step 2: 提交**

```bash
cd d:\test2
git add lib/compress.ts
git commit -m "feat: add image compression core logic"
```

---

### Task 4: ZIP 打包逻辑

**Files:**
- Create: `lib/zip.ts`

- [ ] **Step 1: 实现 ZIP 打包函数**

```typescript
// lib/zip.ts

import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ImageItem } from './types';

export async function downloadAsZip(items: ImageItem[]): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder('compressed');

  if (!folder) {
    throw new Error('无法创建 ZIP 文件夹');
  }

  for (const item of items) {
    if (item.status !== 'done' || !item.compressedBlob) continue;

    const ext = item.compressedBlob.type === 'image/png'
      ? 'png'
      : item.compressedBlob.type === 'image/webp'
      ? 'webp'
      : 'jpg';

    const baseName = item.file.name.replace(/\.[^.]+$/, '');
    folder.file(`${baseName}_compressed.${ext}`, item.compressedBlob);
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'compressed_images.zip');
}

export function downloadSingle(item: ImageItem): void {
  if (item.status !== 'done' || !item.compressedBlob) return;

  const ext = item.compressedBlob.type === 'image/png'
    ? 'png'
    : item.compressedBlob.type === 'image/webp'
    ? 'webp'
    : 'jpg';

  const baseName = item.file.name.replace(/\.[^.]+$/, '');
  saveAs(item.compressedBlob, `${baseName}_compressed.${ext}`);
}
```

- [ ] **Step 2: 提交**

```bash
cd d:\test2
git add lib/zip.ts
git commit -m "feat: add ZIP download logic"
```

---

### Task 5: DropZone 组件

**Files:**
- Create: `components/DropZone.tsx`

- [ ] **Step 1: 实现拖拽上传组件**

```tsx
'use client';

import { useCallback, useRef, useState } from 'react';
import { ACCEPTED_INPUT, MAX_FILES } from '@/lib/types';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export default function DropZone({ onFilesSelected, disabled }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith('image/')
      );
      if (files.length > 0) {
        onFilesSelected(files.slice(0, MAX_FILES));
      }
    },
    [disabled, onFilesSelected]
  );

  const handleClick = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      if (files.length > 0) {
        onFilesSelected(files.slice(0, MAX_FILES));
      }
      if (inputRef.current) inputRef.current.value = '';
    },
    [onFilesSelected]
  );

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative flex flex-col items-center justify-center
        w-full min-h-[200px] p-8
        border-2 border-dashed rounded-xl cursor-pointer
        transition-all duration-200
        ${isDragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_INPUT}
        multiple
        onChange={handleChange}
        className="hidden"
      />
      <svg
        className="w-12 h-12 mb-4 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
      <p className="text-base font-medium text-gray-700">
        拖拽图片到此处，或点击选择文件
      </p>
      <p className="mt-2 text-sm text-gray-500">
        支持 JPG / PNG / WebP，最多 {MAX_FILES} 张
      </p>
    </div>
  );
}
```

- [ ] **Step 2: 提交**

```bash
cd d:\test2
git add components/DropZone.tsx
git commit -m "feat: add DropZone component"
```

---

### Task 6: QualitySlider 组件

**Files:**
- Create: `components/QualitySlider.tsx`

- [ ] **Step 1: 实现质量滑块组件**

```tsx
'use client';

import { DEFAULT_QUALITY } from '@/lib/types';

interface QualitySliderProps {
  quality: number;
  onChange: (quality: number) => void;
  disabled?: boolean;
}

export default function QualitySlider({ quality, onChange, disabled }: QualitySliderProps) {
  return (
    <div className="flex items-center gap-4 w-full max-w-md mx-auto">
      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
        压缩质量
      </label>
      <input
        type="range"
        min={1}
        max={100}
        value={quality}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
      />
      <span className="text-sm font-semibold text-blue-600 min-w-[3rem] text-right">
        {quality}%
      </span>
    </div>
  );
}
```

- [ ] **Step 2: 提交**

```bash
cd d:\test2
git add components/QualitySlider.tsx
git commit -m "feat: add QualitySlider component"
```

---

### Task 7: ImageCard 组件

**Files:**
- Create: `components/ImageCard.tsx`

- [ ] **Step 1: 实现图片卡片组件**

```tsx
'use client';

import { ImageItem } from '@/lib/types';
import { formatFileSize, calcSavings } from '@/lib/compress';
import { downloadSingle } from '@/lib/zip';

interface ImageCardProps {
  item: ImageItem;
  onCompare: (item: ImageItem) => void;
  onRemove: (id: string) => void;
}

export default function ImageCard({ item, onCompare, onRemove }: ImageCardProps) {
  const savings = item.status === 'done' ? calcSavings(item.originalSize, item.compressedSize) : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
        {item.status === 'compressing' && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {item.status === 'error' && (
          <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-10">
            <p className="text-red-500 text-sm">{item.error || '压缩失败'}</p>
          </div>
        )}
        {(item.status === 'done' || item.status === 'compressing') && (
          <img
            src={item.status === 'done' ? item.compressedUrl : item.originalUrl}
            alt={item.file.name}
            className="w-full h-full object-contain"
          />
        )}
        {item.status === 'pending' && (
          <img
            src={item.originalUrl}
            alt={item.file.name}
            className="w-full h-full object-contain opacity-50"
          />
        )}
      </div>

      <div className="p-4">
        <p className="text-sm font-medium text-gray-900 truncate" title={item.file.name}>
          {item.file.name}
        </p>

        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-gray-500">
            {formatFileSize(item.originalSize)}
          </span>
          {item.status === 'done' && (
            <>
              <span className="text-gray-400">→</span>
              <span className="text-gray-700 font-medium">
                {formatFileSize(item.compressedSize)}
              </span>
              <span className="text-emerald-600 font-semibold">
                -{savings}%
              </span>
            </>
          )}
        </div>

        {item.status === 'done' && (
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => onCompare(item)}
              className="flex-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              对比
            </button>
            <button
              onClick={() => downloadSingle(item)}
              className="flex-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              下载
            </button>
          </div>
        )}

        <button
          onClick={() => onRemove(item.id)}
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-white/80 rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-colors"
          title="移除"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 提交**

```bash
cd d:\test2
git add components/ImageCard.tsx
git commit -m "feat: add ImageCard component"
```

---

### Task 8: CompareView 组件

**Files:**
- Create: `components/CompareView.tsx`

- [ ] **Step 1: 实现压缩前后对比模态框**

```tsx
'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { ImageItem } from '@/lib/types';
import { formatFileSize, calcSavings } from '@/lib/compress';

interface CompareViewProps {
  item: ImageItem;
  onClose: () => void;
}

export default function CompareView({ item, onClose }: CompareViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const isDragging = useRef(false);

  const savings = calcSavings(item.originalSize, item.compressedSize);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current || !isDragging.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  }, []);

  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => handleMove(e.clientX),
    [handleMove]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => handleMove(e.touches[0].clientX),
    [handleMove]
  );

  useEffect(() => {
    const handleGlobalMouseUp = () => { isDragging.current = false; };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{item.file.name}</h3>
            <p className="text-sm text-gray-500">
              {formatFileSize(item.originalSize)} → {formatFileSize(item.compressedSize)}
              <span className="ml-2 text-emerald-600 font-medium">-{savings}%</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <div
          ref={containerRef}
          className="relative select-none cursor-col-resize overflow-hidden"
          style={{ aspectRatio: `${item.width}/${item.height}`, maxHeight: '60vh' }}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchMove={handleTouchMove}
        >
          <img
            src={item.compressedUrl}
            alt="压缩后"
            className="absolute inset-0 w-full h-full object-contain"
          />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src={item.originalUrl}
              alt="原始"
              className="absolute inset-0 w-full h-full object-contain"
              style={{ width: `${containerRef.current?.offsetWidth || 800}px` }}
            />
          </div>

          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
              <span className="text-gray-600 text-xs">⟷</span>
            </div>
          </div>

          <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 text-white text-xs rounded">
            原始
          </div>
          <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 text-white text-xs rounded">
            压缩后
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 提交**

```bash
cd d:\test2
git add components/CompareView.tsx
git commit -m "feat: add CompareView component"
```

---

### Task 9: BatchActions 组件

**Files:**
- Create: `components/BatchActions.tsx`

- [ ] **Step 1: 实现批量操作组件**

```tsx
'use client';

import { ImageItem } from '@/lib/types';
import { downloadAsZip } from '@/lib/zip';
import { formatFileSize, calcSavings } from '@/lib/compress';

interface BatchActionsProps {
  items: ImageItem[];
  onClearAll: () => void;
}

export default function BatchActions({ items, onClearAll }: BatchActionsProps) {
  const doneItems = items.filter((i) => i.status === 'done');
  const totalOriginal = doneItems.reduce((sum, i) => sum + i.originalSize, 0);
  const totalCompressed = doneItems.reduce((sum, i) => sum + i.compressedSize, 0);
  const totalSavings = calcSavings(totalOriginal, totalCompressed);

  if (doneItems.length === 0) return null;

  const handleDownloadAll = async () => {
    try {
      await downloadAsZip(doneItems);
    } catch (err) {
      console.error('ZIP 下载失败:', err);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-blue-50 rounded-xl">
      <div className="text-sm text-gray-700">
        已压缩 <span className="font-semibold text-blue-600">{doneItems.length}</span> 张图片，
        共节省 <span className="font-semibold text-emerald-600">{totalSavings}%</span>
        <span className="text-gray-500 ml-1">
          ({formatFileSize(totalOriginal)} → {formatFileSize(totalCompressed)})
        </span>
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleDownloadAll}
          className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          全部下载 (ZIP)
        </button>
        <button
          onClick={onClearAll}
          className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          清空全部
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 提交**

```bash
cd d:\test2
git add components/BatchActions.tsx
git commit -m "feat: add BatchActions component"
```

---

### Task 10: FeatureSection 组件

**Files:**
- Create: `components/FeatureSection.tsx`

- [ ] **Step 1: 实现特性说明区组件**

```tsx
'use client';

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: '本地处理',
    desc: '图片不会上传到任何服务器，所有处理在您的浏览器中完成，保护隐私安全',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: '极速压缩',
    desc: '利用浏览器原生 Canvas API，无需等待网络传输，即时完成压缩',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: '全设备支持',
    desc: '手机、平板、电脑均可使用，响应式设计适配各种屏幕尺寸',
  },
];

export default function FeatureSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="text-center p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-100 text-blue-600 mb-4">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 提交**

```bash
cd d:\test2
git add components/FeatureSection.tsx
git commit -m "feat: add FeatureSection component"
```

---

### Task 11: Footer 组件

**Files:**
- Create: `components/Footer.tsx`

- [ ] **Step 1: 实现页脚组件**

```tsx
export default function Footer() {
  return (
    <footer className="py-8 border-t border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} CompressPic. 所有图片处理均在本地完成。
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <span>🔒 隐私安全</span>
            <span>⚡ 免费使用</span>
            <span>📱 多端适配</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: 提交**

```bash
cd d:\test2
git add components/Footer.tsx
git commit -m "feat: add Footer component"
```

---

### Task 12: 主页面集成

**Files:**
- Create: `app/page.tsx`

- [ ] **Step 1: 实现主页面，集成所有组件**

```tsx
'use client';

import { useCallback, useState } from 'react';
import DropZone from '@/components/DropZone';
import QualitySlider from '@/components/QualitySlider';
import ImageCard from '@/components/ImageCard';
import CompareView from '@/components/CompareView';
import BatchActions from '@/components/BatchActions';
import FeatureSection from '@/components/FeatureSection';
import Footer from '@/components/Footer';
import { ImageItem, DEFAULT_QUALITY, MAX_FILES } from '@/lib/types';
import { compressImage, generateId, getOutputFormat } from '@/lib/compress';

export default function Home() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [quality, setQuality] = useState(DEFAULT_QUALITY);
  const [compareItem, setCompareItem] = useState<ImageItem | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFilesSelected = useCallback(
    async (files: File[]) => {
      const newItems: ImageItem[] = files.map((file) => ({
        id: generateId(),
        file,
        originalUrl: URL.createObjectURL(file),
        compressedUrl: '',
        compressedBlob: new Blob(),
        originalSize: file.size,
        compressedSize: 0,
        width: 0,
        height: 0,
        status: 'pending' as const,
      }));

      setItems((prev) => [...prev, ...newItems].slice(0, MAX_FILES));
      setIsCompressing(true);

      for (const item of newItems) {
        try {
          setItems((prev) =>
            prev.map((i) => (i.id === item.id ? { ...i, status: 'compressing' as const } : i))
          );

          const outputFormat = getOutputFormat(item.file);
          const result = await compressImage(item.file, {
            quality,
            outputFormat,
          });

          const compressedUrl = URL.createObjectURL(result.blob);

          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? {
                    ...i,
                    status: 'done' as const,
                    compressedUrl,
                    compressedBlob: result.blob,
                    compressedSize: result.blob.size,
                    width: result.width,
                    height: result.height,
                  }
                : i
            )
          );
        } catch (err) {
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? { ...i, status: 'error' as const, error: String(err) }
                : i
            )
          );
        }
      }

      setIsCompressing(false);
    },
    [quality]
  );

  const handleRemove = useCallback((id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) {
        URL.revokeObjectURL(item.originalUrl);
        if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const handleClearAll = useCallback(() => {
    items.forEach((item) => {
      URL.revokeObjectURL(item.originalUrl);
      if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl);
    });
    setItems([]);
  }, [items]);

  const handleRecompress = useCallback(
    async (newQuality: number) => {
      const doneItems = items.filter((i) => i.status === 'done');
      if (doneItems.length === 0) return;

      setIsCompressing(true);

      for (const item of doneItems) {
        try {
          setItems((prev) =>
            prev.map((i) => (i.id === item.id ? { ...i, status: 'compressing' as const } : i))
          );

          const outputFormat = getOutputFormat(item.file);
          const result = await compressImage(item.file, {
            quality: newQuality,
            outputFormat,
          });

          if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl);
          const compressedUrl = URL.createObjectURL(result.blob);

          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? {
                    ...i,
                    status: 'done' as const,
                    compressedUrl,
                    compressedBlob: result.blob,
                    compressedSize: result.blob.size,
                    width: result.width,
                    height: result.height,
                  }
                : i
            )
          );
        } catch (err) {
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? { ...i, status: 'error' as const, error: String(err) }
                : i
            )
          );
        }
      }

      setIsCompressing(false);
    },
    [items]
  );

  const handleQualityChange = useCallback(
    (newQuality: number) => {
      setQuality(newQuality);
      if (items.length > 0) {
        handleRecompress(newQuality);
      }
    },
    [items.length, handleRecompress]
  );

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            免费在线图片压缩工具
          </h1>
          <p className="text-gray-500 text-lg">
            浏览器本地处理，保护您的隐私安全
          </p>
        </div>

        <div className="mb-6">
          <DropZone onFilesSelected={handleFilesSelected} disabled={isCompressing} />
        </div>

        {items.length > 0 && (
          <div className="mb-6">
            <QualitySlider
              quality={quality}
              onChange={handleQualityChange}
              disabled={isCompressing}
            />
          </div>
        )}

        {items.length > 0 && (
          <div className="mb-6">
            <BatchActions items={items} onClearAll={handleClearAll} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <ImageCard
              key={item.id}
              item={item}
              onCompare={setCompareItem}
              onRemove={handleRemove}
            />
          ))}
        </div>
      </div>

      {items.length === 0 && <FeatureSection />}

      {compareItem && compareItem.status === 'done' && (
        <CompareView item={compareItem} onClose={() => setCompareItem(null)} />
      )}

      <Footer />
    </main>
  );
}
```

- [ ] **Step 2: 提交**

```bash
cd d:\test2
git add app/page.tsx
git commit -m "feat: add main page with all components integrated"
```

---

### Task 13: Layout 与 SEO

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: 实现全局布局，包含 SEO meta 和 JSON-LD**

```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '免费在线图片压缩工具 - CompressPic',
  description:
    '免费在线压缩JPG/PNG/WebP图片，浏览器本地处理保护隐私，无需上传服务器，批量压缩一键下载。',
  keywords: [
    '图片压缩',
    '在线图片压缩',
    '图片压缩工具',
    '压缩图片大小',
    'JPG压缩',
    'PNG压缩',
    'WebP压缩',
    '批量压缩图片',
    '免费图片压缩',
  ],
  openGraph: {
    title: '免费在线图片压缩工具 - CompressPic',
    description:
      '免费在线压缩JPG/PNG/WebP图片，浏览器本地处理保护隐私，无需上传服务器，批量压缩一键下载。',
    url: 'https://compresspic.com',
    siteName: 'CompressPic',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '免费在线图片压缩工具 - CompressPic',
    description:
      '免费在线压缩JPG/PNG/WebP图片，浏览器本地处理保护隐私，无需上传服务器，批量压缩一键下载。',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'CompressPic',
  description: '免费在线图片压缩工具',
  url: 'https://compresspic.com',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'CNY',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: 提交**

```bash
cd d:\test2
git add app/layout.tsx
git commit -m "feat: add layout with SEO meta and JSON-LD"
```

---

### Task 14: 全局样式

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: 更新全局样式**

替换 `app/globals.css` 的内容：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply text-gray-900 bg-white;
  }
}

@layer utilities {
  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #2563eb;
    cursor: pointer;
  }

  input[type='range']::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #2563eb;
    cursor: pointer;
    border: none;
  }
}
```

- [ ] **Step 2: 提交**

```bash
cd d:\test2
git add app/globals.css
git commit -m "feat: update global styles with range slider customization"
```

---

### Task 15: robots.txt 和 404 页面

**Files:**
- Create: `public/robots.txt`
- Create: `app/not-found.tsx`

- [ ] **Step 1: 创建 robots.txt**

```
User-agent: *
Allow: /

Sitemap: https://compresspic.com/sitemap.xml
```

- [ ] **Step 2: 创建 404 页面**

```tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
        <p className="text-gray-600 mb-6">页面不存在</p>
        <Link
          href="/"
          className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 提交**

```bash
cd d:\test2
git add public/robots.txt app/not-found.tsx
git commit -m "feat: add robots.txt and 404 page"
```

---

### Task 16: 构建验证与修复

**Files:**
- Possibly modify: various files based on build errors

- [ ] **Step 1: 运行构建**

Run:
```bash
cd d:\test2
npm run build
```

Expected: 构建成功，`out/` 目录生成

- [ ] **Step 2: 修复任何构建错误**

如果构建失败，根据错误信息修复代码，然后重新构建。

- [ ] **Step 3: 本地预览**

Run:
```bash
cd d:\test2
npx serve out
```

在浏览器中打开 `http://localhost:3000` 验证：
- 拖拽上传功能正常
- 图片压缩功能正常
- 质量滑块调节正常
- 对比视图正常
- 单张下载正常
- ZIP 批量下载正常
- 响应式布局正常

- [ ] **Step 4: 最终提交**

```bash
cd d:\test2
git add .
git commit -m "feat: CompressPic MVP complete"
```
