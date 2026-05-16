// lib/zip.ts

import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ImageItem } from './types';

export async function downloadAsZip(items: ImageItem[]): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder('compressed');

  if (!folder) {
    throw new Error('无法创建 ZIP 文件夹');
  }

  for (const item of items) {
    if (item.status !== 'done' || !item.compressedBlob) continue;

    const ext = item.compressedBlob.type === 'image/png'
      ? 'png'
      : item.compressedBlob.type === 'image/webp'
      ? 'webp'
      : 'jpg';

    const baseName = item.file.name.replace(/\.[^.]+$/, '');
    folder.file(`${baseName}_compressed.${ext}`, item.compressedBlob);
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'compressed_images.zip');
}

export function downloadSingle(item: ImageItem): void {
  if (item.status !== 'done' || !item.compressedBlob) return;

  const ext = item.compressedBlob.type === 'image/png'
    ? 'png'
    : item.compressedBlob.type === 'image/webp'
    ? 'webp'
    : 'jpg';

  const baseName = item.file.name.replace(/\.[^.]+$/, '');
  saveAs(item.compressedBlob, `${baseName}_compressed.${ext}`);
}
