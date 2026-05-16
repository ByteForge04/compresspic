// lib/types.ts

export interface ImageItem {
  id: string;
  file: File;
  originalUrl: string;
  compressedUrl: string;
  compressedBlob: Blob;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
  status: 'pending' | 'compressing' | 'done' | 'error';
  error?: string;
}

export interface CompressOptions {
  quality: number;
  outputFormat: 'image/jpeg' | 'image/png' | 'image/webp';
}

export type FormatType = 'image/jpeg' | 'image/png' | 'image/webp';

export const SUPPORTED_FORMATS: FormatType[] = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

export const ACCEPTED_INPUT = '.jpg,.jpeg,.png,.webp';

export const MAX_FILES = 20;

export const DEFAULT_QUALITY = 75;
