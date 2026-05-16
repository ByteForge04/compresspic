'use client';

import { useCallback, useState } from 'react';
import Navbar from '@/components/Navbar';
import DropZone from '@/components/DropZone';
import Footer from '@/components/Footer';
import { ImageItem, MAX_FILES } from '@/lib/types';
import { compressImage, generateId } from '@/lib/compress';
import { downloadSingle } from '@/lib/zip';

type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp';

const formatOptions: { value: OutputFormat; label: string; desc: string }[] = [
  { value: 'image/jpeg', label: 'JPG', desc: '适合照片，体积小' },
  { value: 'image/png', label: 'PNG', desc: '支持透明，无损' },
  { value: 'image/webp', label: 'WebP', desc: '新一代格式，更小体积' },
];

export default function ConvertPage() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('image/webp');
  const [isConverting, setIsConverting] = useState(false);

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
      setIsConverting(true);

      for (const item of newItems) {
        try {
          setItems((prev) =>
            prev.map((i) => (i.id === item.id ? { ...i, status: 'compressing' as const } : i))
          );

          const result = await compressImage(item.file, {
            quality: 90,
            outputFormat,
          });

          const convertedUrl = URL.createObjectURL(result.blob);

          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? {
                    ...i,
                    status: 'done' as const,
                    compressedUrl: convertedUrl,
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

      setIsConverting(false);
    },
    [outputFormat]
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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              图片格式转换
            </h1>
            <p className="text-gray-500 text-lg">
              在 JPG、PNG、WebP 之间自由转换，浏览器本地处理
            </p>
          </div>

          <div className="mb-6">
            <DropZone onFilesSelected={handleFilesSelected} disabled={isConverting} />
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 justify-center flex-wrap">
              <span className="text-sm font-medium text-gray-700">转换为目标格式：</span>
              {formatOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setOutputFormat(opt.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    outputFormat === opt.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {opt.label}
                  <span className="ml-1 text-xs opacity-70">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {items.length > 0 && (
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                已转换 {items.filter((i) => i.status === 'done').length} / {items.length} 张
              </span>
              <button
                onClick={handleClearAll}
                className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                清空全部
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id} className="relative bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="relative aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                  {item.status === 'compressing' && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                      <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {item.status === 'error' && (
                    <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-10">
                      <p className="text-red-500 text-sm">{item.error || '转换失败'}</p>
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
                  {item.status === 'done' && (
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-gray-500">{item.file.type.split('/')[1].toUpperCase()}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-purple-600 font-medium">{outputFormat.split('/')[1].toUpperCase()}</span>
                    </div>
                  )}
                  {item.status === 'done' && (
                    <button
                      onClick={() => downloadSingle(item)}
                      className="mt-3 w-full px-3 py-1.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      下载
                    </button>
                  )}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-white/80 rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-colors"
                    title="移除"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <h2 className="text-xl font-bold text-gray-900 mb-4">支持的转换格式</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">JPG</h3>
                <p className="text-sm text-gray-600">最常用的图片格式，适合照片和复杂图像，体积较小但不支持透明</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">PNG</h3>
                <p className="text-sm text-gray-600">支持透明背景，无损压缩，适合图标、Logo 和需要透明度的图片</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">WebP</h3>
                <p className="text-sm text-gray-600">Google 开发的新一代格式，同等质量下体积比 JPG 小 25-35%，支持透明</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
