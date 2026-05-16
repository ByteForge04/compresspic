import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '图片转WebP工具 - JPG/PNG转WebP免费在线 - CompressPic',
  description: '免费在线将JPG、PNG图片转换为WebP格式，体积减小25-35%，支持批量转换和自定义质量，浏览器本地处理保护隐私。',
  keywords: ['图片转WebP', 'JPG转WebP', 'PNG转WebP', 'WebP转换', '在线WebP转换', 'WebP格式', '图片格式转换'],
  openGraph: {
    title: '图片转WebP工具 - CompressPic',
    description: '免费在线将图片转换为WebP格式，体积更小加载更快。',
    url: 'https://compresspic.com/webp',
    siteName: 'CompressPic',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '图片转WebP工具 - CompressPic',
    description: '免费在线将图片转换为WebP格式，体积更小加载更快。',
  },
  alternates: {
    canonical: 'https://compresspic.com/webp',
  },
};

export default function WebpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
