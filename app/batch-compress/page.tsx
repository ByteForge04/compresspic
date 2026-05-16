'use client';

import { useCallback, useState } from 'react';
import Navbar from '@/components/Navbar';
import DropZone from '@/components/DropZone';
import Footer from '@/components/Footer';
import { ImageItem } from '@/lib/types';
import { compressImage, formatFileSize, calcSavings, generateId } from '@/lib/compress';
import { downloadAsZip } from '@/lib/zip';

const BATCH_MAX_FILES = 50;

export default function BatchCompressPage() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [quality, setQuality] = useState(75);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);

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

      setItems((prev) => [...prev, ...newItems].slice(0, BATCH_MAX_FILES));
      setIsProcessing(true);
      setProcessedCount(0);

      let count = 0;
      for (const item of newItems) {
        try {
          setItems((prev) =>
            prev.map((i) => (i.id === item.id ? { ...i, status: 'compressing' as const } : i))
          );

          const outputFormat = item.file.type === 'image/png' ? 'image/png' as const : 'image/jpeg' as const;
          const result = await compressImage(item.file, {
            quality,
            outputFormat,
          });

          const compressedUrl = URL.createObjectURL(result.blob);
          count++;

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
          setProcessedCount(count);
        } catch (err) {
          count++;
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? { ...i, status: 'error' as const, error: String(err) }
                : i
            )
          );
          setProcessedCount(count);
        }
      }

      setIsProcessing(false);
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
    setProcessedCount(0);
  }, [items]);

  const handleDownloadAll = useCallback(async () => {
    const doneItems = items.filter((i) => i.status === 'done');
    if (doneItems.length === 0) return;
    await downloadAsZip(doneItems);
  }, [items]);

  const doneItems = items.filter((i) => i.status === 'done');
  const totalOriginal = doneItems.reduce((sum, i) => sum + i.originalSize, 0);
  const totalCompressed = doneItems.reduce((sum, i) => sum + i.compressedSize, 0);
  const totalSavings = calcSavings(totalOriginal, totalCompressed);
  const progressPercent = items.length > 0 ? Math.round((processedCount / items.length) * 100) : 0;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              批量压缩图片
            </h1>
            <p className="text-gray-500 text-lg">
              一次性压缩多张图片，最多支持 {BATCH_MAX_FILES} 张，浏览器本地处理
            </p>
          </div>

          <div className="mb-6">
            <DropZone onFilesSelected={handleFilesSelected} disabled={isProcessing} />
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-4 justify-center">
              <span className="text-sm font-medium text-gray-700">压缩质量：</span>
              <input
                type="range"
                min={1}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-48 accent-indigo-600"
              />
              <span className="text-sm font-medium text-indigo-600">{quality}%</span>
            </div>
          </div>

          {isProcessing && items.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">
                  处理进度：{processedCount} / {items.length}
                </span>
                <span className="text-sm font-medium text-indigo-600">{progressPercent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {items.length > 0 && !isProcessing && (
            <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
              <span className="text-sm text-gray-500">
                已完成 {doneItems.length} / {items.length} 张
                {doneItems.length > 0 && (
                  <span className="ml-3 text-indigo-600 font-medium">
                    总计节省 {totalSavings}%（{formatFileSize(totalOriginal)} → {formatFileSize(totalCompressed)}）
                  </span>
                )}
              </span>
              <div className="flex items-center gap-2">
                {doneItems.length > 0 && (
                  <button
                    onClick={handleDownloadAll}
                    className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
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
                      <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
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
                  {item.status === 'done' && (
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-gray-500">{formatFileSize(item.originalSize)}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-indigo-600 font-medium">{formatFileSize(item.compressedSize)}</span>
                      <span className="text-indigo-600 font-medium">-{calcSavings(item.originalSize, item.compressedSize)}%</span>
                    </div>
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">批量压缩功能介绍</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-indigo-50 rounded-xl">
                <h3 className="font-semibold text-indigo-600 mb-2">高效批量处理</h3>
                <p className="text-sm text-gray-600">支持一次上传最多 50 张图片，自动逐张压缩处理，实时显示进度条和压缩结果</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-xl">
                <h3 className="font-semibold text-indigo-600 mb-2">智能压缩统计</h3>
                <p className="text-sm text-gray-600">自动汇总所有图片的压缩效果，显示总体节省比例和文件大小对比，直观了解压缩收益</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-xl">
                <h3 className="font-semibold text-indigo-600 mb-2">一键打包下载</h3>
                <p className="text-sm text-gray-600">压缩完成后可一键打包为 ZIP 文件下载，无需逐张保存，大幅提升工作效率</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
