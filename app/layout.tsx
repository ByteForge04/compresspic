import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '免费在线图片处理工具 - CompressPic',
  description:
    '免费在线图片压缩、格式转换工具，浏览器本地处理保护隐私，无需上传服务器，批量处理一键下载。',
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
    '图片格式转换',
    'JPG转PNG',
    'PNG转WebP',
    'WebP转换',
    '图片裁剪',
    '图片加水印',
    '批量压缩',
    '图片尺寸调整',
    '在线图片处理',
    '图片工具',
    '图片编辑',
    '图片优化',
    '网站图片优化',
  ],
  openGraph: {
    title: '免费在线图片处理工具 - CompressPic',
    description:
      '免费在线图片压缩、格式转换工具，浏览器本地处理保护隐私，无需上传服务器，批量处理一键下载。',
    url: 'https://compresspic.com',
    siteName: 'CompressPic',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '免费在线图片处理工具 - CompressPic',
    description:
      '免费在线图片压缩、格式转换工具，浏览器本地处理保护隐私，无需上传服务器，批量处理一键下载。',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://compresspic.com',
  },
};

const webAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'CompressPic',
  description: '免费在线图片处理工具集 - 压缩、转换、裁剪、加水印、调整尺寸，浏览器本地处理保护隐私',
  url: 'https://compresspic.com',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'CNY',
  },
  featureList: [
    '图片压缩',
    '格式转换',
    '图片裁剪',
    '图片加水印',
    '图片转WebP',
    '批量压缩',
    '图片尺寸调整',
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'CompressPic 是免费的吗？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '是的，CompressPic 完全免费，无需注册，无隐藏收费，无文件数量限制。',
      },
    },
    {
      '@type': 'Question',
      name: '我的图片会被上传到服务器吗？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '不会。所有图片处理都在您的浏览器本地完成，图片不会离开您的设备。',
      },
    },
    {
      '@type': 'Question',
      name: '支持哪些图片格式？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '目前支持 JPG/JPEG、PNG 和 WebP 三种常见格式的压缩和转换。',
      },
    },
    {
      '@type': 'Question',
      name: 'WebP 格式有什么优势？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'WebP 是 Google 开发的新一代图片格式，在同等视觉质量下，文件体积比 JPG 小 25-35%，比 PNG 小 80% 以上。',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="google-site-verification" content="eaMXDE4wfUgPU9T-bNRDjvaz5xOYdRKHr_MFrf1qfE0" />
        <meta name="apple-mobile-web-app-title" content="CompressPic" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
