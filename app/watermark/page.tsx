'use client';

import { useCallback, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import DropZone from '@/components/DropZone';
import Footer from '@/components/Footer';
import { formatFileSize, generateId } from '@/lib/compress';
import { ImageItem } from '@/lib/types';

type WatermarkPosition = 'center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'tile';

const positionOptions: { value: WatermarkPosition; label: string }[] = [
  { value: 'center', label: '居中' },
  { value: 'bottom-right', label: '右下角' },
  { value: 'bottom-left', label: '左下角' },
  { value: 'top-right', label: '右上角' },
  { value: 'top-left', label: '左上角' },
  { value: 'tile', label: '平铺' },
];

export default function WatermarkPage() {
  const [item, setItem] = useState<ImageItem | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [watermarkText, setWatermarkText] = useState('CompressPic');
  const [fontSize, setFontSize] = useState(24);
  const [color, setColor] = useState('#ffffff');
  const [opacity, setOpacity] = useState(50);
  const [position, setPosition] = useState<WatermarkPosition>('center');
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      setItem((prev) => prev ? { ...prev, width: img.width, height: img.height, status: 'done' } : prev);
    };
    img.onerror = () => {
      setError('图片加载失败');
    };
    img.src = newItem.originalUrl;
  }, []);

  const handleApplyWatermark = useCallback(() => {
    if (!imgEl || !watermarkText.trim()) return;
    setIsProcessing(true);
    setError('');

    try {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = imgEl.width;
      canvas.height = imgEl.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError('无法创建 Canvas 上下文');
        setIsProcessing(false);
        return;
      }

      ctx.drawImage(imgEl, 0, 0);

      ctx.globalAlpha = opacity / 100;
      ctx.font = `${fontSize}px sans-serif`;
      ctx.fillStyle = color;
      ctx.textBaseline = 'middle';

      const metrics = ctx.measureText(watermarkText);
      const textW = metrics.width;
      const textH = fontSize;
      const padding = 20;

      if (position === 'tile') {
        ctx.textAlign = 'left';
        const stepX = textW + 60;
        const stepY = textH + 60;
        ctx.save();
        for (let y = -stepY; y < canvas.height + stepY; y += stepY) {
          for (let x = -stepX; x < canvas.width + stepX; x += stepX) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(-Math.PI / 6);
            ctx.fillText(watermarkText, 0, 0);
            ctx.restore();
          }
        }
        ctx.restore();
      } else {
        let x: number, y: number;
        ctx.textAlign = 'center';

        switch (position) {
          case 'top-left':
            ctx.textAlign = 'left';
            x = padding;
            y = padding + textH / 2;
            break;
          case 'top-right':
            ctx.textAlign = 'right';
            x = canvas.width - padding;
            y = padding + textH / 2;
            break;
          case 'bottom-left':
            ctx.textAlign = 'left';
            x = padding;
            y = canvas.height - padding - textH / 2;
            break;
          case 'bottom-right':
            ctx.textAlign = 'right';
            x = canvas.width - padding;
            y = canvas.height - padding - textH / 2;
            break;
          case 'center':
          default:
            x = canvas.width / 2;
            y = canvas.height / 2;
            break;
        }
        ctx.fillText(watermarkText, x, y);
      }

      ctx.globalAlpha = 1;

      canvas.toBlob((blob) => {
        if (!blob) {
          setError('添加水印失败');
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
      setError('添加水印过程出错');
      setIsProcessing(false);
    }
  }, [imgEl, watermarkText, fontSize, color, opacity, position, previewUrl]);

  const handleDownload = useCallback(() => {
    if (!previewBlob || !item) return;
    const baseName = item.file.name.replace(/\.[^.]+$/, '');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(previewBlob);
    a.download = `${baseName}_watermarked.png`;
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
  }, [item, previewUrl]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              图片加水印
            </h1>
            <p className="text-gray-500 text-lg">
              为图片添加文字水印，支持自定义样式和位置，浏览器本地处理
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
                <div className="relative aspect-video bg-amber-50 flex items-center justify-center overflow-hidden rounded-lg">
                  <img
                    src={previewUrl || item.originalUrl}
                    alt={item.file.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">水印设置</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">水印文字</label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      placeholder="输入水印文字"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      字体大小：<span className="text-amber-600 font-medium">{fontSize}px</span>
                    </label>
                    <input
                      type="range"
                      min={12}
                      max={72}
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full accent-amber-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>12px</span>
                      <span>72px</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">颜色</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
                        />
                        <span className="text-sm text-gray-600">{color}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        透明度：<span className="text-amber-600 font-medium">{opacity}%</span>
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={opacity}
                        onChange={(e) => setOpacity(Number(e.target.value))}
                        className="w-full accent-amber-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-2">位置</label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {positionOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setPosition(opt.value)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            position === opt.value
                              ? 'bg-amber-600 text-white'
                              : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleApplyWatermark}
                  disabled={isProcessing || !watermarkText.trim()}
                  className="mt-6 px-6 py-2.5 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? '处理中...' : '添加水印'}
                </button>
              </div>

              {error && (
                <div className="p-4 bg-red-50 rounded-xl text-red-500 text-sm">
                  {error}
                </div>
              )}

              {previewUrl && previewBlob && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      水印后大小：{formatFileSize(previewBlob.size)}
                    </span>
                    <button
                      onClick={handleDownload}
                      className="px-6 py-2.5 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      下载水印图片
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-16">
            <h2 className="text-xl font-bold text-gray-900 mb-4">图片水印功能介绍</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-amber-50 rounded-xl">
                <h3 className="font-semibold text-amber-600 mb-2">自定义样式</h3>
                <p className="text-sm text-gray-600">支持自定义水印文字、字体大小、颜色和透明度，满足不同场景的版权保护需求</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl">
                <h3 className="font-semibold text-amber-600 mb-2">多种位置</h3>
                <p className="text-sm text-gray-600">提供居中、四角和平铺六种位置选择，平铺模式可在整张图片上重复水印</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl">
                <h3 className="font-semibold text-amber-600 mb-2">安全可靠</h3>
                <p className="text-sm text-gray-600">所有水印处理在浏览器本地完成，图片不会上传到任何服务器，保护您的隐私</p>
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
