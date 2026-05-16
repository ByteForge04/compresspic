import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '批量图片压缩工具 - 一次压缩50张 - CompressPic',
  description: '免费在线批量图片压缩工具，一次最多压缩50张JPG/PNG/WebP图片，支持自定义质量、进度显示、一键ZIP打包下载，浏览器本地处理。',
  keywords: ['批量压缩图片', '批量图片压缩', '多张图片压缩', '图片批量处理', 'ZIP下载', '批量压缩', '图片压缩工具'],
  openGraph: {
    title: '批量图片压缩工具 - CompressPic',
    description: '免费在线批量压缩图片，最多50张，一键ZIP下载。',
    url: 'https://compresspic.com/batch-compress',
    siteName: 'CompressPic',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '批量图片压缩工具 - CompressPic',
    description: '免费在线批量压缩图片，最多50张，一键ZIP下载。',
  },
  alternates: {
    canonical: 'https://compresspic.com/batch-compress',
  },
};

export default function BatchCompressLayout({ children }: { children: React.ReactNode }) {
  return children;
}
