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
