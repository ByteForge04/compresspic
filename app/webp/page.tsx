'use client';

import { useCallback, useState } from 'react';
import Navbar from '@/components/Navbar';
import DropZone from '@/components/DropZone';
import Footer from '@/components/Footer';
import { ImageItem, MAX_FILES } from '@/lib/types';
import { compressImage, formatFileSize, calcSavings, generateId } from '@/lib/compress';
import { downloadSingle, downloadAsZip } from '@/lib/zip';

export default function WebpPage() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [quality, setQuality] = useState(80);
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
            quality,
            outputFormat: 'image/webp',
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

  const handleDownloadAll = useCallback(async () => {
    const doneItems = items.filter((i) => i.status === 'done');
    if (doneItems.length === 0) return;
    await downloadAsZip(doneItems);
  }, [items]);

  const doneCount = items.filter((i) => i.status === 'done').length;
  const totalOriginal = items.filter((i) => i.status === 'done').reduce((sum, i) => sum + i.originalSize, 0);
  const totalCompressed = items.filter((i) => i.status === 'done').reduce((sum, i) => sum + i.compressedSize, 0);
  const totalSavings = calcSavings(totalOriginal, totalCompressed);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              图片转 WebP
            </h1>
            <p className="text-gray-500 text-lg">
              将图片转换为 WebP 格式，大幅减小体积，浏览器本地处理
            </p>
          </div>

          <div className="mb-6">
            <DropZone onFilesSelected={handleFilesSelected} disabled={isConverting} />
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-4 justify-center">
              <span className="text-sm font-medium text-gray-700">质量：</span>
              <input
                type="range"
                min={1}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-48 accent-teal-600"
              />
              <span className="text-sm font-medium text-teal-600">{quality}%</span>
            </div>
          </div>

          {items.length > 0 && (
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                已转换 {doneCount} / {items.length} 张
                {doneCount > 0 && (
                  <span className="ml-3 text-teal-600 font-medium">
                    总计节省 {totalSavings}%（{formatFileSize(totalOriginal)} → {formatFileSize(totalCompressed)}）
                  </span>
                )}
              </span>
              <div className="flex items-center gap-2">
                {doneCount > 1 && (
                  <button
                    onClick={handleDownloadAll}
                    className="px-4 py-1.5 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    打包下载 ZIP
                  </button>
                )}
                <button
                  onClick={handleClearAll}
                  className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  清空全部
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id} className="relative bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="relative aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                  {item.status === 'compressing' && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                      <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
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
                      <span className="text-gray-500">{formatFileSize(item.originalSize)}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-teal-600 font-medium">{formatFileSize(item.compressedSize)}</span>
                      <span className="text-teal-600 font-medium">-{calcSavings(item.originalSize, item.compressedSize)}%</span>
                    </div>
                  )}
                  {item.status === 'done' && (
                    <button
                      onClick={() => downloadSingle(item)}
                      className="mt-3 w-full px-3 py-1.5 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      下载 WebP
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">为什么选择 WebP 格式</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-teal-50 rounded-xl">
                <h3 className="font-semibold text-teal-600 mb-2">更小的体积</h3>
                <p className="text-sm text-gray-600">WebP 格式在同等画质下比 JPG 小 25-35%，比 PNG 小 26%，显著减少存储和带宽成本</p>
              </div>
              <div className="p-4 bg-teal-50 rounded-xl">
                <h3 className="font-semibold text-teal-600 mb-2">广泛兼容</h3>
                <p className="text-sm text-gray-600">主流浏览器（Chrome、Firefox、Edge、Safari 14+）均已支持 WebP，覆盖绝大多数用户</p>
              </div>
              <div className="p-4 bg-teal-50 rounded-xl">
                <h3 className="font-semibold text-teal-600 mb-2">支持透明</h3>
                <p className="text-sm text-gray-600">WebP 同时支持有损和无损压缩，还支持透明通道（Alpha），是 PNG 的理想替代格式</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
