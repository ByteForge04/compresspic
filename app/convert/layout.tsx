import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '在线图片格式转换 - JPG/PNG/WebP互转 - CompressPic',
  description: '免费在线图片格式转换工具，支持JPG转PNG、PNG转WebP、WebP转JPG等格式互转，浏览器本地处理保护隐私。',
  keywords: ['图片格式转换', 'JPG转PNG', 'PNG转WebP', 'WebP转JPG', '在线格式转换', '图片转换工具', '格式互转'],
  openGraph: {
    title: '在线图片格式转换 - CompressPic',
    description: '免费在线图片格式转换，JPG/PNG/WebP互转。',
    url: 'https://compresspic.com/convert',
    siteName: 'CompressPic',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '在线图片格式转换 - CompressPic',
    description: '免费在线图片格式转换，JPG/PNG/WebP互转。',
  },
  alternates: {
    canonical: 'https://compresspic.com/convert',
  },
};

export default function ConvertLayout({ children }: { children: React.ReactNode }) {
  return children;
}
