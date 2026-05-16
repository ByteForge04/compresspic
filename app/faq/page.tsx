import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const faqs = [
  {
    q: 'CompressPic 是免费的吗？',
    a: '是的，CompressPic 完全免费，无需注册，无隐藏收费，无文件数量限制。',
  },
  {
    q: '我的图片会被上传到服务器吗？',
    a: '不会。所有图片处理都在您的浏览器本地完成，图片不会离开您的设备。我们无法看到、存储或访问您的任何图片。',
  },
  {
    q: '支持哪些图片格式？',
    a: '目前支持 JPG/JPEG、PNG 和 WebP 三种常见格式的压缩和转换。',
  },
  {
    q: '压缩后的图片质量如何？',
    a: '您可以通过质量滑块自由调节压缩程度（1-100%）。通常 70-80% 的质量设置可以在保持视觉质量的同时大幅减小文件体积。',
  },
  {
    q: '有文件大小限制吗？',
    a: '由于所有处理在浏览器本地完成，文件大小受限于您设备的内存。一般支持 20MB 以内的图片，单次最多处理 20 张。',
  },
  {
    q: '批量压缩后如何下载？',
    a: '您可以逐张下载，也可以点击"全部下载 (ZIP)"按钮将所有压缩后的图片打包为 ZIP 文件一次性下载。',
  },
  {
    q: 'WebP 格式有什么优势？',
    a: 'WebP 是 Google 开发的新一代图片格式，在同等视觉质量下，文件体积比 JPG 小 25-35%，比 PNG 小 80% 以上。现代浏览器均已支持。',
  },
  {
    q: '为什么压缩后图片反而变大了？',
    a: '这通常发生在对已经高度压缩的图片再次压缩时。建议适当提高质量参数，或转换为 WebP 格式以获得更好的压缩效果。',
  },
];

export const metadata = {
  title: '常见问题 - CompressPic',
  description: 'CompressPic 常见问题解答：图片压缩、格式转换、隐私安全等相关问题。',
};

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">常见问题</h1>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="pb-6 border-b border-gray-100 last:border-0">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h2>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
