import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: '隐私政策 - CompressPic',
  description: 'CompressPic 隐私政策：所有图片处理均在浏览器本地完成，我们不会收集、存储或上传您的任何图片。',
  alternates: { canonical: 'https://compresspic.com/privacy' },
  openGraph: {
    title: '隐私政策 - CompressPic',
    description: 'CompressPic 隐私政策：所有图片处理均在浏览器本地完成，保护您的隐私。',
    url: 'https://compresspic.com/privacy',
    siteName: 'CompressPic',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '隐私政策 - CompressPic',
    description: '所有图片处理均在浏览器本地完成，保护您的隐私。',
  },
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">隐私政策</h1>
          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">核心承诺</h2>
              <p className="text-gray-600">CompressPic 的核心设计原则是保护用户隐私。所有图片处理均在您的浏览器本地完成，您的图片不会上传到任何服务器。</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">数据处理</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>您上传的图片仅在您的浏览器内存中处理</li>
                <li>处理完成后，图片数据会从内存中释放</li>
                <li>我们不会收集、存储、传输或以任何方式访问您的图片</li>
                <li>关闭网页后，所有数据将自动清除</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">我们收集的信息</h2>
              <p className="text-gray-600">我们可能通过第三方分析服务（如 Google Analytics）收集匿名的访问统计数据，包括：</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>页面访问量和访问时间</li>
                <li>浏览器类型和设备信息</li>
                <li>来源网站和搜索关键词</li>
              </ul>
              <p className="text-gray-600 mt-2">这些数据不包含任何个人信息，仅用于改善网站体验。</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">广告</h2>
              <p className="text-gray-600">我们可能通过 Google AdSense 展示广告。AdSense 可能使用 Cookie 来展示相关广告。您可以访问 <a href="https://policies.google.com/technologies/ads" className="text-blue-600 hover:underline">Google 广告设置</a> 来管理广告偏好。</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Cookie</h2>
              <p className="text-gray-600">本网站可能使用 Cookie 用于分析和广告目的。您可以通过浏览器设置管理或禁用 Cookie。</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">联系方式</h2>
              <p className="text-gray-600">如果您对本隐私政策有任何疑问，请通过 GitHub 仓库联系我们。</p>
            </section>
            <section>
              <p className="text-sm text-gray-400 mt-8">最后更新：2026年5月</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
