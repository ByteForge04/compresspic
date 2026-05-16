'use client';

import { useCallback, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import DropZone from '@/components/DropZone';
import Footer from '@/components/Footer';
import { compressImage, formatFileSize, generateId } from '@/lib/compress';
import { downloadSingle } from '@/lib/zip';
import { ImageItem } from '@/lib/types';

const presetRatios = [
  { label: '1:1', w: 1, h: 1 },
  { label: '4:3', w: 4, h: 3 },
  { label: '16:9', w: 16, h: 9 },
  { label: '3:2', w: 3, h: 2 },
];

export default function CropPage() {
  const [item, setItem] = useState<ImageItem | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropW, setCropW] = useState(0);
  const [cropH, setCropH] = useState(0);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFilesSelected = useCallback(async (files: File[]) => {
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
      setCropX(0);
      setCropY(0);
      setCropW(img.width);
      setCropH(img.height);
      setItem((prev) => prev ? { ...prev, width: img.width, height: img.height, status: 'done' } : prev);
    };
    img.onerror = () => {
      setError('图片加载失败');
    };
    img.src = newItem.originalUrl;
  }, []);

  const handleRatioSelect = useCallback((ratio: { w: number; h: number }) => {
    if (!imgEl) return;
    const imgW = imgEl.width;
    const imgH = imgEl.height;
    const imgRatio = imgW / imgH;
    const targetRatio = ratio.w / ratio.h;

    let w: number, h: number;
    if (imgRatio > targetRatio) {
      h = imgH;
      w = Math.round(h * targetRatio);
    } else {
      w = imgW;
      h = Math.round(w / targetRatio);
    }
    const x = Math.round((imgW - w) / 2);
    const y = Math.round((imgH - h) / 2);
    setCropX(x);
    setCropY(y);
    setCropW(w);
    setCropH(h);
    setPreviewUrl('');
    setPreviewBlob(null);
  }, [imgEl]);

  const handleCrop = useCallback(() => {
    if (!imgEl) return;
    setIsProcessing(true);
    setError('');

    try {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = cropW;
      canvas.height = cropH;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError('无法创建 Canvas 上下文');
        setIsProcessing(false);
        return;
      }
      ctx.clearRect(0, 0, cropW, cropH);
      ctx.drawImage(imgEl, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

      canvas.toBlob((blob) => {
        if (!blob) {
          setError('裁剪失败');
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
      setError('裁剪过程出错');
      setIsProcessing(false);
    }
  }, [imgEl, cropX, cropY, cropW, cropH, previewUrl]);

  const handleDownload = useCallback(() => {
    if (!previewBlob || !item) return;
    const ext = 'png';
    const baseName = item.file.name.replace(/\.[^.]+$/, '');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(previewBlob);
    a.download = `${baseName}_cropped.${ext}`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [previewBlob, item]);

  const handleReset = useCallback(() => {
    if (item) URL.revokeObjectURL(item.originalUrl);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setItem(null);
    setImgEl(null);
    setPreviewUrl('');
    setPreviewBlob(null);
    setError('');
    setCropX(0);
    setCropY(0);
    setCropW(0);
    setCropH(0);
  }, [item, previewUrl]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              图片裁剪
            </h1>
            <p className="text-gray-500 text-lg">
              自由裁剪图片尺寸，支持预设比例，浏览器本地处理
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
                  原图尺寸：{imgEl.width} × {imgEl.height}
                </span>
                <button
                  onClick={handleReset}
                  className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  重新选择
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm p-4">
                <div className="relative aspect-video bg-green-50 flex items-center justify-center overflow-hidden rounded-lg">
                  <img
                    src={item.originalUrl}
                    alt={item.file.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">预设比例</h3>
                <div className="flex items-center gap-2 flex-wrap mb-6">
                  {presetRatios.map((r) => (
                    <button
                      key={r.label}
                      onClick={() => handleRatioSelect(r)}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                    >
                      {r.label}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setCropX(0);
                      setCropY(0);
                      setCropW(imgEl.width);
                      setCropH(imgEl.height);
                      setPreviewUrl('');
                      setPreviewBlob(null);
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    原图
                  </button>
                </div>

                <h3 className="text-sm font-semibold text-gray-900 mb-4">裁剪参数</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">X 坐标</label>
                    <input
                      type="number"
                      min={0}
                      max={imgEl.width}
                      value={cropX}
                      onChange={(e) => {
                        setCropX(Number(e.target.value));
                        setPreviewUrl('');
                        setPreviewBlob(null);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Y 坐标</label>
                    <input
                      type="number"
                      min={0}
                      max={imgEl.height}
                      value={cropY}
                      onChange={(e) => {
                        setCropY(Number(e.target.value));
                        setPreviewUrl('');
                        setPreviewBlob(null);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">宽度</label>
                    <input
                      type="number"
                      min={1}
                      max={imgEl.width}
                      value={cropW}
                      onChange={(e) => {
                        setCropW(Number(e.target.value));
                        setPreviewUrl('');
                        setPreviewBlob(null);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">高度</label>
                    <input
                      type="number"
                      min={1}
                      max={imgEl.height}
                      value={cropH}
                      onChange={(e) => {
                        setCropH(Number(e.target.value));
                        setPreviewUrl('');
                        setPreviewBlob(null);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  裁剪区域：{cropW} × {cropH}，起始坐标 ({cropX}, {cropY})
                </div>

                <button
                  onClick={handleCrop}
                  disabled={isProcessing || cropW <= 0 || cropH <= 0}
                  className="mt-4 px-6 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? '裁剪中...' : '裁剪图片'}
                </button>
              </div>

              {error && (
                <div className="p-4 bg-red-50 rounded-xl text-red-500 text-sm">
                  {error}
                </div>
              )}

              {previewUrl && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">裁剪预览</h3>
                  <div className="relative bg-green-50 rounded-lg overflow-hidden flex items-center justify-center p-4">
                    <img
                      src={previewUrl}
                      alt="裁剪预览"
                      className="max-w-full max-h-96 object-contain"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      裁剪后尺寸：{cropW} × {cropH}
                      {previewBlob && ` | 大小：${formatFileSize(previewBlob.size)}`}
                    </span>
                    <button
                      onClick={handleDownload}
                      className="px-6 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      下载裁剪图片
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-16">
            <h2 className="text-xl font-bold text-gray-900 mb-4">图片裁剪功能介绍</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-xl">
                <h3 className="font-semibold text-green-600 mb-2">自由裁剪</h3>
                <p className="text-sm text-gray-600">通过输入精确的坐标和尺寸参数，对图片进行任意区域的裁剪，满足精细化的裁剪需求</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <h3 className="font-semibold text-green-600 mb-2">预设比例</h3>
                <p className="text-sm text-gray-600">提供 1:1、4:3、16:9、3:2 等常用比例一键裁剪，快速适配社交媒体和网页设计需求</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <h3 className="font-semibold text-green-600 mb-2">本地处理</h3>
                <p className="text-sm text-gray-600">所有裁剪操作在浏览器本地完成，图片不会上传到服务器，确保您的隐私和数据安全</p>
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
