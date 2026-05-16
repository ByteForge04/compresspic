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
