import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '在线图片尺寸调整工具 - 修改图片大小/像素 - CompressPic',
  description: '免费在线图片尺寸调整工具，支持自定义宽高像素、锁定宽高比、百分比缩放，浏览器本地处理保护隐私，无需上传。',
  keywords: ['图片尺寸调整', '调整图片大小', '修改图片像素', '图片缩放', '图片改尺寸', '在线调整图片', '图片分辨率'],
  openGraph: {
    title: '在线图片尺寸调整工具 - CompressPic',
    description: '免费在线调整图片尺寸，支持锁定比例和百分比缩放。',
    url: 'https://compresspic.com/resize',
    siteName: 'CompressPic',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '在线图片尺寸调整工具 - CompressPic',
    description: '免费在线调整图片尺寸，支持锁定比例和百分比缩放。',
  },
  alternates: {
    canonical: 'https://compresspic.com/resize',
  },
};

export default function ResizeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
