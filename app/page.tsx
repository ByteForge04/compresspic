'use client';

import { useCallback, useState } from 'react';
import Navbar from '@/components/Navbar';
import DropZone from '@/components/DropZone';
import QualitySlider from '@/components/QualitySlider';
import ImageCard from '@/components/ImageCard';
import CompareView from '@/components/CompareView';
import BatchActions from '@/components/BatchActions';
import ToolCard from '@/components/ToolCard';
import HowItWorks from '@/components/HowItWorks';
import ComparisonTable from '@/components/ComparisonTable';
import FeatureSection from '@/components/FeatureSection';
import Footer from '@/components/Footer';
import { ImageItem, DEFAULT_QUALITY, MAX_FILES } from '@/lib/types';
import { compressImage, generateId, getOutputFormat } from '@/lib/compress';

const tools = [
  {
    href: '/#compress',
    icon: (
      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
    title: '图片压缩',
    description: '压缩 JPG/PNG/WebP 图片大小，最高可减小 80% 体积',
    color: 'bg-blue-100',
  },
  {
    href: '/convert',
    icon: (
      <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    title: '格式转换',
    description: '在 JPG、PNG、WebP 之间自由转换图片格式',
    color: 'bg-purple-100',
  },
  {
    href: '/crop',
    icon: (
      <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 3v3m0 0H4m3 0h10a2 2 0 012 2v10m0 0v3m0-3H7a2 2 0 01-2-2V6m0 0V3" />
      </svg>
    ),
    title: '图片裁剪',
    description: '自由裁剪图片尺寸，支持常用比例预设',
    color: 'bg-green-100',
  },
  {
    href: '/watermark',
    icon: (
      <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: '图片加水印',
    description: '为图片添加文字水印，支持位置和透明度设置',
    color: 'bg-amber-100',
  },
  {
    href: '/webp',
    icon: (
      <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: '图片转WebP',
    description: '将图片转换为 WebP 格式，体积更小加载更快',
    color: 'bg-teal-100',
  },
  {
    href: '/batch-compress',
    icon: (
      <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    title: '批量压缩',
    description: '一次性压缩多张图片，支持批量下载 ZIP',
    color: 'bg-indigo-100',
  },
  {
    href: '/resize',
    icon: (
      <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
      </svg>
    ),
    title: '图片尺寸调整',
    description: '调整图片宽高尺寸，支持锁定比例和百分比缩放',
    color: 'bg-rose-100',
  },
];

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
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              免费在线图片处理工具
            </h1>
            <p className="text-gray-500 text-lg">
              浏览器本地处理，保护您的隐私安全
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {tools.map((tool) => (
              <ToolCard key={tool.href} {...tool} />
            ))}
          </div>

          <div id="compress">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">图片压缩</h2>

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
        </div>

        <HowItWorks />
        <ComparisonTable />
        <FeatureSection />

        {compareItem && compareItem.status === 'done' && (
          <CompareView item={compareItem} onClose={() => setCompareItem(null)} />
        )}
      </main>
      <Footer />
    </>
  );
}
