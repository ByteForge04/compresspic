import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: '图片处理教程与技巧 - CompressPic博客',
  description:
    'CompressPic 博客：图片压缩、格式转换、网站优化等实用教程与技巧，帮助你高效处理图片。',
  alternates: { canonical: 'https://compresspic.com/blog' },
  openGraph: {
    title: '图片处理教程与技巧 - CompressPic博客',
    description: 'CompressPic 博客：图片压缩、格式转换、网站优化等实用教程与技巧。',
    url: 'https://compresspic.com/blog',
    siteName: 'CompressPic',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '图片处理教程与技巧 - CompressPic博客',
    description: '图片压缩、格式转换、网站优化等实用教程与技巧。',
  },
};

const articles = [
  {
    href: '/blog/image-compression-guide',
    title: '图片压缩完全指南：从原理到实践',
    description:
      '全面了解图片压缩的原理与方法，包括有损与无损压缩的区别、JPG/PNG/WebP 压缩原理对比、如何选择合适的压缩质量，以及批量压缩的最佳实践。',
    tag: '压缩技巧',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    href: '/blog/webp-format-guide',
    title: 'WebP格式详解：为什么你应该使用WebP',
    description:
      '深入了解 WebP 图片格式的优势、与 JPG/PNG 的体积对比、浏览器兼容性，以及如何将图片转换为 WebP 格式来优化网站性能。',
    tag: '格式介绍',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    href: '/blog/image-format-comparison',
    title: 'JPG vs PNG vs WebP：图片格式全面对比',
    description:
      'JPG、PNG、WebP 三大图片格式的全面对比，包括压缩类型、透明支持、动画支持、文件体积和适用场景，帮助你选择最合适的图片格式。',
    tag: '格式对比',
    color: 'bg-green-100 text-green-700',
  },
  {
    href: '/blog/website-image-optimization',
    title: '网站图片优化指南：提升加载速度的7个技巧',
    description:
      '7个实用的网站图片优化技巧，包括选择正确格式、压缩图片、响应式图片、懒加载、CDN加速、现代格式WebP/AVIF和正确设置图片尺寸。',
    tag: '网站优化',
    color: 'bg-orange-100 text-orange-700',
  },
];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">CompressPic 博客</h1>
          <p className="text-gray-500 mb-8">图片处理教程与技巧，帮助你高效管理和优化图片</p>

          <div className="grid grid-cols-1 gap-4">
            {articles.map((article) => (
              <Link
                key={article.href}
                href={article.href}
                className="group block p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
              >
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-3 ${article.color}`}>
                  {article.tag}
                </span>
                <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-600">{article.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
