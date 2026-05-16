'use client';

import { useCallback, useState } from 'react';
import DropZone from '@/components/DropZone';
import QualitySlider from '@/components/QualitySlider';
import ImageCard from '@/components/ImageCard';
import CompareView from '@/components/CompareView';
import BatchActions from '@/components/BatchActions';
import FeatureSection from '@/components/FeatureSection';
import Footer from '@/components/Footer';
import { ImageItem, DEFAULT_QUALITY, MAX_FILES } from '@/lib/types';
import { compressImage, generateId, getOutputFormat } from '@/lib/compress';

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
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            免费在线图片压缩工具
          </h1>
          <p className="text-gray-500 text-lg">
            浏览器本地处理，保护您的隐私安全
          </p>
        </div>

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

      {items.length === 0 && <FeatureSection />}

      {compareItem && compareItem.status === 'done' && (
        <CompareView item={compareItem} onClose={() => setCompareItem(null)} />
      )}

      <Footer />
    </main>
  );
}
