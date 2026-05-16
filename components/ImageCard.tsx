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
    <div className="relative bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
