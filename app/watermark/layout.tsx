import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '在线图片加水印工具 - 文字水印/透明度/位置 - CompressPic',
  description: '免费在线图片加水印工具，支持自定义文字、字体大小、颜色、透明度，6种位置含平铺模式，浏览器本地处理保护隐私。',
  keywords: ['图片加水印', '在线水印工具', '图片水印', '文字水印', '照片水印', '版权水印', '批量加水印'],
  openGraph: {
    title: '在线图片加水印工具 - CompressPic',
    description: '免费在线图片加水印工具，支持自定义样式和位置，浏览器本地处理。',
    url: 'https://compresspic.com/watermark',
    siteName: 'CompressPic',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '在线图片加水印工具 - CompressPic',
    description: '免费在线图片加水印工具，支持自定义样式和位置。',
  },
  alternates: {
    canonical: 'https://compresspic.com/watermark',
  },
};

export default function WatermarkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
