import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: '网站图片优化指南：提升加载速度的7个技巧 - CompressPic',
  description:
    '7个实用的网站图片优化技巧，包括选择正确格式、压缩图片、响应式图片、懒加载、CDN加速、现代格式WebP/AVIF和正确设置图片尺寸，全面提升网站加载速度。',
  alternates: { canonical: 'https://compresspic.com/blog/website-image-optimization' },
  openGraph: {
    title: '网站图片优化指南：提升加载速度的7个技巧 - CompressPic',
    description: '7个实用的网站图片优化技巧，全面提升网站加载速度。',
    url: 'https://compresspic.com/blog/website-image-optimization',
    siteName: 'CompressPic',
    locale: 'zh_CN',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: '网站图片优化指南：提升加载速度的7个技巧',
    description: '7个实用的网站图片优化技巧，全面提升网站加载速度。',
  },
};

export default function WebsiteImageOptimizationPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">网站图片优化指南：提升加载速度的7个技巧</h1>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">图片优化为什么重要</h2>
              <p className="text-gray-600">
                图片通常占网页总大小的 50% 以上，是影响页面加载速度的最大因素。Google 的 Core Web Vitals 将 LCP（最大内容绘制）作为衡量用户体验的关键指标，而 LCP 元素往往就是页面中的主图或横幅图片。未经优化的图片会直接导致 LCP 超标，影响搜索排名和用户留存。
              </p>
              <p className="text-gray-600">
                数据说明了问题的严重性：移动端页面平均加载时间为 4.2 秒，其中图片加载占了 2.1 秒。53% 的移动用户会放弃加载时间超过 3 秒的页面。每缩短 100 毫秒的加载时间，电商转化率就能提升 1%–2%。图片优化不仅是技术问题，更是直接影响业务收入的关键因素。以下 7 个技巧将帮助你系统性地优化网站图片。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">技巧1：选择正确的格式</h2>
              <p className="text-gray-600">
                选择合适的图片格式是优化的第一步，也是影响最大的因素。照片类图片应使用 WebP 有损格式或 JPG，图标和 Logo 应使用 WebP 无损格式或 PNG，需要动画的图片使用 WebP 动画格式。错误的格式选择可能导致文件体积翻倍甚至更多——例如用 PNG 保存照片，文件大小可能是 WebP 的 5–10 倍。
              </p>
              <p className="text-gray-600">
                详细的格式选择指南请参考我们的<Link href="/blog/image-format-comparison" className="text-blue-600 hover:underline"> JPG vs PNG vs WebP 格式全面对比</Link>。简单来说，如果浏览器支持 WebP（97%+ 的覆盖率），就优先使用 WebP；需要兼容旧浏览器时，使用 <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">&lt;picture&gt;</code> 标签提供 WebP + JPG/PNG 的双重方案。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">技巧2：压缩图片体积</h2>
              <p className="text-gray-600">
                压缩是减少图片体积最直接的手段。对于有损压缩格式（JPG、WebP），将质量设置为 70%–85% 通常可以在保持视觉质量的同时减少 50%–70% 的文件体积。人眼对压缩伪影的敏感度远低于文件体积的差异——一张 80% 质量的 JPG 和 100% 质量的 JPG 在视觉上几乎无法区分，但文件体积可能相差 3 倍。
              </p>
              <p className="text-gray-600">
                使用 <Link href="/" className="text-blue-600 hover:underline">CompressPic 在线压缩工具</Link>，你可以批量压缩图片并实时预览效果。所有处理在浏览器本地完成，无需上传文件，隐私安全有保障。对于无损格式（PNG），可以使用 PNG 优化工具去除元数据和应用更高效的压缩算法，通常还能额外减少 10%–30% 的体积。了解更多压缩原理，请阅读我们的<Link href="/blog/image-compression-guide" className="text-blue-600 hover:underline"> 图片压缩完全指南</Link>。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">技巧3：使用响应式图片</h2>
              <p className="text-gray-600">
                响应式图片是指根据用户的设备屏幕尺寸和分辨率，自动提供最合适大小的图片。在移动端加载一张 1920px 宽的桌面端图片是极大的浪费——一张 400px 宽的图片在手机上看起来完全一样，但文件体积可能只有前者的 1/4。
              </p>
              <p className="text-gray-600">
                使用 HTML 的 <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">srcset</code> 和 <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">sizes</code> 属性，可以为不同屏幕尺寸提供不同分辨率的图片。浏览器会自动选择最合适的版本加载，避免在小屏幕设备上下载过大的图片。对于支持 <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">&lt;picture&gt;</code> 标签的场景，还可以同时提供不同格式的图片，让浏览器选择最优格式。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">技巧4：懒加载</h2>
              <p className="text-gray-600">
                懒加载（Lazy Loading）是指只在图片即将进入视口时才加载，而不是在页面加载时就加载所有图片。对于包含大量图片的长页面，懒加载可以显著减少初始加载时间和带宽消耗。用户可能永远不会滚动到页面底部，那么底部的图片就不需要加载。
              </p>
              <p className="text-gray-600">
                实现懒加载非常简单，只需在 <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">&lt;img&gt;</code> 标签上添加 <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">loading=&quot;lazy&quot;</code> 属性即可，现代浏览器原生支持这一功能。对于首屏的图片（尤其是 LCP 元素），不要使用懒加载，而应该优先加载。可以使用 <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">fetchpriority=&quot;high&quot;</code> 属性来提示浏览器优先加载关键图片。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">技巧5：使用CDN</h2>
              <p className="text-gray-600">
                内容分发网络（CDN）将图片缓存到全球各地的边缘节点，用户可以从距离最近的节点获取图片，大幅减少网络延迟。对于面向全球用户的网站，CDN 可以将图片加载时间从数秒缩短到数百毫秒。即使只服务单一地区，CDN 也能减轻源服务器压力，提高网站的并发处理能力。
              </p>
              <p className="text-gray-600">
                许多现代 CDN 还提供图片优化功能，如 Cloudflare 的 Polish 和 Mirage、Vercel 的 Next/Image、Imgix 等。这些服务可以根据用户的设备和网络条件，自动调整图片格式、尺寸和质量，无需手动维护多个版本的图片。配合 WebP 自动转换功能，CDN 可以在服务端根据浏览器的 Accept 头返回最优格式。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">技巧6：使用现代格式WebP/AVIF</h2>
              <p className="text-gray-600">
                现代图片格式是图片优化的最大红利。WebP 相比 JPG 可减少 25%–35% 的体积，AVIF 更是能减少 50% 的体积。AVIF 基于 AV1 视频编码技术，是目前压缩效率最高的图片格式，Chrome 和 Firefox 已经支持。虽然 AVIF 的编码速度较慢，但对于静态资源的构建流程来说不是问题。
              </p>
              <p className="text-gray-600">
                实际应用中，推荐同时提供 WebP 和 AVIF 两种格式，使用 <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">&lt;picture&gt;</code> 标签按优先级排列。支持 AVIF 的浏览器会加载 AVIF，否则降级到 WebP，再降级到 JPG/PNG。这种渐进增强的策略确保所有用户都能获得最佳体验。详细了解 WebP 的优势，请阅读我们的<Link href="/blog/webp-format-guide" className="text-blue-600 hover:underline"> WebP 格式详解</Link>。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">技巧7：正确设置图片尺寸</h2>
              <p className="text-gray-600">
                始终为图片设置明确的 <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">width</code> 和 <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">height</code> 属性，或者使用 CSS 的 <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">aspect-ratio</code> 属性。这可以让浏览器在图片加载前就预留出正确的空间，避免布局偏移（CLS，Core Web Vitals 的另一个关键指标）。没有尺寸信息的图片会导致页面内容在加载过程中突然跳动，严重影响用户体验。
              </p>
              <p className="text-gray-600">
                同时，确保图片的实际像素尺寸与显示尺寸匹配。上传一张 4000×3000 的图片但只显示为 400×300，意味着用户下载了 10 倍于需要的数据。使用图片编辑工具或在线服务将图片缩放到实际显示尺寸，再进行压缩，可以最大化优化效果。对于高 DPI 屏幕（如 Retina 显示屏），提供 2 倍分辨率的图片即可，无需更高。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">总结</h2>
              <p className="text-gray-600">
                网站图片优化是一个系统工程，从格式选择、压缩处理、响应式适配到加载策略，每个环节都有优化空间。以上 7 个技巧按影响力排序：格式选择和压缩带来的收益最大，懒加载和 CDN 对用户体验的改善最直观。建议优先实施前 3 个技巧，它们投入最小、收益最大。
              </p>
              <p className="text-gray-600">
                立即使用 <Link href="/" className="text-blue-600 hover:underline">CompressPic 在线压缩工具</Link> 和 <Link href="/convert" className="text-blue-600 hover:underline">格式转换工具</Link>，免费优化你的网站图片。如需深入了解图片压缩原理，推荐阅读<Link href="/blog/image-compression-guide" className="text-blue-600 hover:underline"> 图片压缩完全指南</Link>。
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
