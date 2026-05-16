import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '在线图片裁剪工具 - 自由裁剪/预设比例 - CompressPic',
  description: '免费在线图片裁剪工具，支持自由裁剪和1:1、4:3、16:9、3:2等预设比例，浏览器本地处理保护隐私，无需上传。',
  keywords: ['图片裁剪', '在线裁剪图片', '图片裁剪工具', '裁剪照片', '图片剪裁', '1:1裁剪', '16:9裁剪'],
  openGraph: {
    title: '在线图片裁剪工具 - CompressPic',
    description: '免费在线图片裁剪工具，支持自由裁剪和预设比例，浏览器本地处理。',
    url: 'https://compresspic.com/crop',
    siteName: 'CompressPic',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '在线图片裁剪工具 - CompressPic',
    description: '免费在线图片裁剪工具，支持自由裁剪和预设比例。',
  },
  alternates: {
    canonical: 'https://compresspic.com/crop',
  },
};

export default function CropLayout({ children }: { children: React.ReactNode }) {
  return children;
}
