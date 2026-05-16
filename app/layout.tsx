import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '免费在线图片压缩工具 - CompressPic',
  description:
    '免费在线压缩JPG/PNG/WebP图片，浏览器本地处理保护隐私，无需上传服务器，批量压缩一键下载。',
  keywords: [
    '图片压缩',
    '在线图片压缩',
    '图片压缩工具',
    '压缩图片大小',
    'JPG压缩',
    'PNG压缩',
    'WebP压缩',
    '批量压缩图片',
    '免费图片压缩',
  ],
  openGraph: {
    title: '免费在线图片压缩工具 - CompressPic',
    description:
      '免费在线压缩JPG/PNG/WebP图片，浏览器本地处理保护隐私，无需上传服务器，批量压缩一键下载。',
    url: 'https://compresspic.com',
    siteName: 'CompressPic',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '免费在线图片压缩工具 - CompressPic',
    description:
      '免费在线压缩JPG/PNG/WebP图片，浏览器本地处理保护隐私，无需上传服务器，批量压缩一键下载。',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'CompressPic',
  description: '免费在线图片压缩工具',
  url: 'https://compresspic.com',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'CNY',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
