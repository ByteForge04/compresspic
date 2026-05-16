import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: '关于 CompressPic - 免费在线图片处理工具',
  description:
    '了解 CompressPic：免费、安全、无需注册的在线图片处理工具。所有图片在浏览器本地处理，保护您的隐私安全。',
  alternates: { canonical: 'https://compresspic.com/about' },
  openGraph: {
    title: '关于 CompressPic - 免费在线图片处理工具',
    description: '了解 CompressPic：免费、安全、无需注册的在线图片处理工具。',
    url: 'https://compresspic.com/about',
    siteName: 'CompressPic',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '关于 CompressPic',
    description: '免费、安全、无需注册的在线图片处理工具。',
  },
};

const tools = [
  { href: '/', title: '图片压缩', description: '压缩 JPG/PNG/WebP 图片大小，最高可减小 80% 体积' },
  { href: '/convert', title: '格式转换', description: '在 JPG、PNG、WebP 之间自由转换图片格式' },
  { href: '/crop', title: '图片裁剪', description: '自由裁剪图片尺寸，支持常用比例预设' },
  { href: '/watermark', title: '图片加水印', description: '为图片添加文字水印，支持位置和透明度设置' },
  { href: '/webp', title: '图片转WebP', description: '将图片转换为 WebP 格式，体积更小加载更快' },
  { href: '/batch-compress', title: '批量压缩', description: '一次性压缩多张图片，支持批量下载 ZIP' },
  { href: '/resize', title: '图片尺寸调整', description: '调整图片宽高尺寸，支持锁定比例和百分比缩放' },
];

const features = [
  { icon: '🆓', title: '完全免费', description: '所有功能免费使用，无隐藏收费，无文件数量限制，无水印' },
  { icon: '🔒', title: '隐私安全', description: '图片不会上传到任何服务器，所有处理在浏览器本地完成' },
  { icon: '🚀', title: '无需注册', description: '打开即用，无需创建账号，无需提供邮箱或任何个人信息' },
  { icon: '⚡', title: '本地处理', description: '利用浏览器 Canvas API 和 Web Worker，在本地高效处理图片' },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">关于 CompressPic</h1>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">我们的使命</h2>
              <p className="text-gray-600">
                CompressPic 的使命是让每个人都能轻松处理图片。无论你是专业设计师、网站开发者，还是偶尔需要压缩图片的普通用户，CompressPic 都为你提供简单、高效、安全的图片处理工具。我们相信，好的工具应该是免费的、易用的，并且尊重用户的隐私。
              </p>
              <p className="text-gray-600">
                在互联网上，有太多所谓的"免费"图片工具实际上在收集用户数据、上传图片到服务器，或者设置各种使用限制。CompressPic 选择了不同的道路——我们将所有计算放在用户的浏览器中完成，你的图片永远不会离开你的设备。这不仅保护了你的隐私，也意味着更快的处理速度，因为不需要等待上传和下载。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">我们的特色</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="p-5 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <div className="text-2xl mb-2">{feature.icon}</div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">支持的工具</h2>
              <div className="space-y-3 my-4">
                {tools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group block p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
                  >
                    <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-gray-600">{tool.description}</p>
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">技术说明</h2>
              <p className="text-gray-600">
                CompressPic 基于现代 Web 技术构建，充分利用浏览器的原生能力来实现高效的图片处理。核心处理流程使用 Canvas API 进行图片的读取、压缩和格式转换，确保兼容性和性能。对于批量处理场景，我们使用 Web Worker 将计算任务移至后台线程，避免阻塞主线程，保持界面的流畅响应。
              </p>
              <p className="text-gray-600">
                网站采用 Next.js 框架构建，以静态方式部署，无需后端服务器。这意味着你的图片数据不会经过任何服务器，同时也保证了网站的快速访问和高可用性。整个应用在构建时预渲染为静态页面，配合 CDN 分发，实现了极快的加载速度。我们的代码完全开源，欢迎在 GitHub 上查看和贡献。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">联系我们</h2>
              <p className="text-gray-600">
                如果你有任何问题、建议或反馈，欢迎通过以下方式联系我们：
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
                <li>GitHub Issues：在项目仓库提交 Issue 反馈问题或建议</li>
                <li>常见问题：访问<Link href="/faq" className="text-blue-600 hover:underline"> 常见问题</Link>页面查看热门问题解答</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
