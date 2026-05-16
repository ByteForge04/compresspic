'use client';

import { useCallback, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import DropZone from '@/components/DropZone';
import Footer from '@/components/Footer';
import { formatFileSize, generateId } from '@/lib/compress';
import { ImageItem } from '@/lib/types';

const scalePresets = [25, 50, 75, 100, 150, 200];

export default function ResizePage() {
  const [item, setItem] = useState<ImageItem | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [targetW, setTargetW] = useState(0);
  const [targetH, setTargetH] = useState(0);
  const [lockRatio, setLockRatio] = useState(true);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const aspectRef = useRef(1);

  const handleFilesSelected = useCallback((files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    const id = generateId();
    const newItem: ImageItem = {
      id,
      file,
      originalUrl: URL.createObjectURL(file),
      compressedUrl: '',
      compressedBlob: new Blob(),
      originalSize: file.size,
      compressedSize: 0,
      width: 0,
      height: 0,
      status: 'pending',
    };
    setItem(newItem);
    setPreviewUrl('');
    setPreviewBlob(null);
    setError('');

    const img = new Image();
    img.onload = () => {
      setImgEl(img);
      setTargetW(img.width);
      setTargetH(img.height);
      aspectRef.current = img.width / img.height;
      setItem((prev) => prev ? { ...prev, width: img.width, height: img.height, status: 'done' } : prev);
    };
    img.onerror = () => {
      setError('图片加载失败');
    };
    img.src = newItem.originalUrl;
  }, []);

  const handleWidthChange = useCallback((w: number) => {
    setTargetW(w);
    if (lockRatio && aspectRef.current > 0) {
      setTargetH(Math.round(w / aspectRef.current));
    }
    setPreviewUrl('');
    setPreviewBlob(null);
  }, [lockRatio]);

  const handleHeightChange = useCallback((h: number) => {
    setTargetH(h);
    if (lockRatio && aspectRef.current > 0) {
      setTargetW(Math.round(h * aspectRef.current));
    }
    setPreviewUrl('');
    setPreviewBlob(null);
  }, [lockRatio]);

  const handleScaleSelect = useCallback((percent: number) => {
    if (!imgEl) return;
    const w = Math.round(imgEl.width * percent / 100);
    const h = Math.round(imgEl.height * percent / 100);
    setTargetW(w);
    setTargetH(h);
    setPreviewUrl('');
    setPreviewBlob(null);
  }, [imgEl]);

  const handleResize = useCallback(() => {
    if (!imgEl || targetW <= 0 || targetH <= 0) return;
    setIsProcessing(true);
    setError('');

    try {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError('无法创建 Canvas 上下文');
        setIsProcessing(false);
        return;
      }
      ctx.drawImage(imgEl, 0, 0, targetW, targetH);

      canvas.toBlob((blob) => {
        if (!blob) {
          setError('调整尺寸失败');
          setIsProcessing(false);
          return;
        }
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        setPreviewBlob(blob);
        setIsProcessing(false);
      }, 'image/png');
    } catch {
      setError('调整尺寸过程出错');
      setIsProcessing(false);
    }
  }, [imgEl, targetW, targetH, previewUrl]);

  const handleDownload = useCallback(() => {
    if (!previewBlob || !item) return;
    const baseName = item.file.name.replace(/\.[^.]+$/, '');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(previewBlob);
    a.download = `${baseName}_${targetW}x${targetH}.png`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [previewBlob, item, targetW, targetH]);

  const handleReset = useCallback(() => {
    if (item) URL.revokeObjectURL(item.originalUrl);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setItem(null);
    setImgEl(null);
    setPreviewUrl('');
    setPreviewBlob(null);
    setError('');
    setTargetW(0);
    setTargetH(0);
  }, [item, previewUrl]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              图片尺寸调整
            </h1>
            <p className="text-gray-500 text-lg">
              自由调整图片宽高，支持锁定比例和百分比缩放，浏览器本地处理
            </p>
          </div>

          {!item && (
            <div className="mb-6">
              <DropZone onFilesSelected={handleFilesSelected} />
            </div>
          )}

          {item && imgEl && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  原图尺寸：{imgEl.width} × {imgEl.height} | {formatFileSize(item.originalSize)}
                </span>
                <button
                  onClick={handleReset}
                  className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  重新选择
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm p-4">
                <div className="relative aspect-video bg-rose-50 flex items-center justify-center overflow-hidden rounded-lg">
                  <img
                    src={previewUrl || item.originalUrl}
                    alt={item.file.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">尺寸设置</h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">宽度（px）</label>
                    <input
                      type="number"
                      min={1}
                      value={targetW}
                      onChange={(e) => handleWidthChange(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">高度（px）</label>
                    <input
                      type="number"
                      min={1}
                      value={targetH}
                      onChange={(e) => handleHeightChange(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <button
                    onClick={() => setLockRatio(!lockRatio)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      lockRatio
                        ? 'bg-rose-100 text-rose-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {lockRatio ? '🔒' : '🔓'}
                    锁定宽高比
                  </button>
                  <span className="text-xs text-gray-400">
                    原始比例：{(imgEl.width / imgEl.height).toFixed(2)}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-gray-900 mb-3">百分比缩放</h3>
                <div className="flex items-center gap-2 flex-wrap mb-6">
                  {scalePresets.map((p) => (
                    <button
                      key={p}
                      onClick={() => handleScaleSelect(p)}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-rose-100 text-rose-600 hover:bg-rose-200 transition-colors"
                    >
                      {p}%
                    </button>
                  ))}
                </div>

                <div className="text-sm text-gray-500 mb-4">
                  目标尺寸：{targetW} × {targetH}
                </div>

                <button
                  onClick={handleResize}
                  disabled={isProcessing || targetW <= 0 || targetH <= 0}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? '处理中...' : '调整尺寸'}
                </button>
              </div>

              {error && (
                <div className="p-4 bg-red-50 rounded-xl text-red-500 text-sm">
                  {error}
                </div>
              )}

              {previewUrl && previewBlob && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">调整后预览</h3>
                  <div className="relative bg-rose-50 rounded-lg overflow-hidden flex items-center justify-center p-4">
                    <img
                      src={previewUrl}
                      alt="调整后预览"
                      className="max-w-full max-h-96 object-contain"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      调整后尺寸：{targetW} × {targetH} | 大小：{formatFileSize(previewBlob.size)}
                    </span>
                    <button
                      onClick={handleDownload}
                      className="px-6 py-2.5 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors"
                    >
                      下载调整后图片
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-16">
            <h2 className="text-xl font-bold text-gray-900 mb-4">图片尺寸调整功能介绍</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-rose-50 rounded-xl">
                <h3 className="font-semibold text-rose-600 mb-2">锁定宽高比</h3>
                <p className="text-sm text-gray-600">默认锁定宽高比，调整宽度时自动计算高度，避免图片变形拉伸，保持原始比例</p>
              </div>
              <div className="p-4 bg-rose-50 rounded-xl">
                <h3 className="font-semibold text-rose-600 mb-2">百分比缩放</h3>
                <p className="text-sm text-gray-600">提供 25%、50%、75%、100%、150%、200% 等常用缩放比例，一键快速调整图片尺寸</p>
              </div>
              <div className="p-4 bg-rose-50 rounded-xl">
                <h3 className="font-semibold text-rose-600 mb-2">精确控制</h3>
                <p className="text-sm text-gray-600">支持输入精确的像素尺寸，满足网页设计、社交媒体等特定尺寸需求，本地处理保护隐私</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
}
