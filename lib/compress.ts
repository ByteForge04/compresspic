// lib/compress.ts

import { CompressOptions } from './types';

export function compressImage(
  file: File,
  options: CompressOptions
): Promise<{ blob: Blob; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('无法创建 Canvas 上下文'));
        return;
      }

      ctx.drawImage(img, 0, 0);

      const outputFormat = options.outputFormat === 'image/png' ? 'image/png' : options.outputFormat;

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('压缩失败'));
            return;
          }
          resolve({
            blob,
            width: img.width,
            height: img.height,
          });
        },
        outputFormat,
        options.outputFormat === 'image/png' ? undefined : options.quality / 100
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('图片加载失败'));
    };

    img.src = url;
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function calcSavings(original: number, compressed: number): number {
  if (original === 0) return 0;
  return Math.round((1 - compressed / original) * 100);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function getOutputFormat(file: File): 'image/jpeg' | 'image/png' | 'image/webp' {
  const type = file.type;
  if (type === 'image/png') return 'image/png';
  if (type === 'image/webp') return 'image/webp';
  return 'image/jpeg';
}
