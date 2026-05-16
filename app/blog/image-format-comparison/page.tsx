import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'JPG vs PNG vs WebP：图片格式全面对比 - CompressPic',
  description:
    'JPG、PNG、WebP 三大图片格式的全面对比，包括压缩类型、透明支持、动画支持、文件体积和适用场景，帮助你选择最合适的图片格式。',
  alternates: { canonical: 'https://compresspic.com/blog/image-format-comparison' },
  openGraph: {
    title: 'JPG vs PNG vs WebP：图片格式全面对比 - CompressPic',
    description: 'JPG、PNG、WebP三大图片格式的全面对比，帮助你选择最合适的图片格式。',
    url: 'https://compresspic.com/blog/image-format-comparison',
    siteName: 'CompressPic',
    locale: 'zh_CN',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JPG vs PNG vs WebP：图片格式全面对比',
    description: 'JPG、PNG、WebP三大图片格式的全面对比，帮助你选择最合适的图片格式。',
  },
};

export default function ImageFormatComparisonPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">JPG vs PNG vs WebP：图片格式全面对比</h1>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">三大格式概述</h2>
              <p className="text-gray-600">
                JPG、PNG 和 WebP 是当今互联网上最常用的三种图片格式，每种格式都有其独特的设计目标和适用场景。JPG（Joint Photographic Experts Group）诞生于 1992 年，是最经典的照片压缩格式，几乎所有的数码相机和手机默认输出 JPG 图片。PNG（Portable Network Graphics）发布于 1996 年，作为 GIF 的替代品而设计，以无损压缩和透明通道支持著称。WebP 则是 Google 在 2010 年推出的现代格式，旨在同时取代 JPG 和 PNG。
              </p>
              <p className="text-gray-600">
                理解这三种格式的差异，对于选择合适的图片格式至关重要。选错格式不仅会导致文件体积膨胀，还可能损失图片质量或丢失透明信息。下面我们将从多个维度对三种格式进行详细对比，帮助你在不同场景下做出最佳选择。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">详细对比表格</h2>
              <div className="overflow-x-auto my-4">
                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b border-gray-200">对比项</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b border-gray-200">JPG</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b border-gray-200">PNG</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b border-gray-200">WebP</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 text-gray-900 font-medium">压缩类型</td>
                      <td className="px-4 py-3 text-gray-600">有损</td>
                      <td className="px-4 py-3 text-gray-600">无损</td>
                      <td className="px-4 py-3 text-gray-600">有损 + 无损</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <td className="px-4 py-3 text-gray-900 font-medium">透明支持</td>
                      <td className="px-4 py-3 text-gray-600">不支持</td>
                      <td className="px-4 py-3 text-gray-600">支持（Alpha 通道）</td>
                      <td className="px-4 py-3 text-gray-600">支持（Alpha 通道）</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 text-gray-900 font-medium">动画支持</td>
                      <td className="px-4 py-3 text-gray-600">不支持</td>
                      <td className="px-4 py-3 text-gray-600">不支持（APNG 除外）</td>
                      <td className="px-4 py-3 text-gray-600">支持</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <td className="px-4 py-3 text-gray-900 font-medium">照片体积</td>
                      <td className="px-4 py-3 text-gray-600">中等</td>
                      <td className="px-4 py-3 text-gray-600">大</td>
                      <td className="px-4 py-3 text-blue-600 font-medium">小</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 text-gray-900 font-medium">图形体积</td>
                      <td className="px-4 py-3 text-gray-600">较大</td>
                      <td className="px-4 py-3 text-gray-600">小</td>
                      <td className="px-4 py-3 text-blue-600 font-medium">最小</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <td className="px-4 py-3 text-gray-900 font-medium">浏览器支持</td>
                      <td className="px-4 py-3 text-gray-600">100%</td>
                      <td className="px-4 py-3 text-gray-600">100%</td>
                      <td className="px-4 py-3 text-gray-600">97%+</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-900 font-medium">适用场景</td>
                      <td className="px-4 py-3 text-gray-600">照片、渐变图</td>
                      <td className="px-4 py-3 text-gray-600">图标、Logo、截图</td>
                      <td className="px-4 py-3 text-gray-600">全场景通用</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-gray-600">
                从表格可以看出，WebP 在大多数维度上都优于 JPG 和 PNG。它同时支持有损和无损压缩、透明通道和动画，并且在文件体积方面具有明显优势。唯一的小劣势是浏览器支持率略低于 JPG/PNG，但 97%+ 的覆盖率在实际应用中已经足够。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">什么时候用JPG？</h2>
              <p className="text-gray-600">
                JPG 最适合用于照片和色彩丰富的渐变图片。由于采用 DCT 有损压缩算法，JPG 能够以极小的文件体积呈现复杂的色彩变化，是数码摄影和网页背景图的标准格式。如果你的图片是相机拍摄的照片、包含大量渐变色的设计稿，或者不需要透明背景的彩色图片，JPG 仍然是可靠的选择。
              </p>
              <p className="text-gray-600">
                不过，JPG 有几个明显的局限：不支持透明通道，无法保存透明背景；反复编辑保存会导致质量累积损失（称为"代际损失"）；对于包含锐利边缘和文字的图片，JPG 容易产生明显的压缩伪影。如果你的图片需要透明背景或包含大量文字和线条，应该考虑使用 PNG 或 WebP。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">什么时候用PNG？</h2>
              <p className="text-gray-600">
                PNG 最适合需要透明背景或无损质量的场景。UI 图标、Logo、截图、包含文字的图片，以及任何需要锐利边缘和精确像素的图形，都应该使用 PNG 格式。PNG 的无损压缩确保图片在多次保存后不会出现质量损失，Alpha 透明通道则支持半透明效果，这是 JPG 无法实现的。
              </p>
              <p className="text-gray-600">
                PNG 的主要缺点是文件体积较大，尤其是照片类图片。一张 1920×1080 的照片，PNG 格式可能达到 4–5 MB，而同等视觉质量的 JPG 只需 500–800 KB。如果你的网站大量使用 PNG 照片，会显著影响加载速度。此外，PNG 不支持动画（APNG 格式支持但兼容性有限），需要动画效果时应考虑 WebP 或 GIF。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">什么时候用WebP？</h2>
              <p className="text-gray-600">
                WebP 是最通用的选择，几乎适用于所有场景。对于照片，WebP 有损压缩比 JPG 小 25%–35%；对于图标和 Logo，WebP 无损压缩比 PNG 小 26%；如果需要同时支持透明和动画，WebP 是唯一的选择。在现代网站开发中，将主要图片格式切换为 WebP 是性价比最高的优化措施之一。
              </p>
              <p className="text-gray-600">
                唯一需要谨慎使用 WebP 的场景是：需要与非常老旧的软件或系统兼容时（如旧版 IE 浏览器、某些嵌入式设备），或者工作流中的工具不支持 WebP 编辑时。在这些情况下，可以同时保留 JPG/PNG 原始文件，通过自动化流程生成 WebP 版本用于网页展示。了解更多 WebP 的详细信息，请阅读我们的<Link href="/blog/webp-format-guide" className="text-blue-600 hover:underline"> WebP 格式详解</Link>。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">格式转换建议</h2>
              <p className="text-gray-600">
                格式转换的基本原则是：从高质量源文件向目标格式转换，避免从低质量格式转换到高质量格式。例如，将 PNG 转换为 WebP 无损格式是合理的，因为不会损失质量；但将高度压缩的 JPG 转换为 PNG 则毫无意义，只会增大文件体积而不会提升质量。
              </p>
              <p className="text-gray-600">
                推荐的转换路径：照片类图片从原始文件导出为 WebP 有损格式（质量 80%）；图标和 Logo 从 SVG 或 PNG 源文件导出为 WebP 无损格式；需要兼容旧浏览器时，同时提供 WebP 和 JPG/PNG 两种格式，使用 <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">&lt;picture&gt;</code> 标签实现自动选择。使用 <Link href="/convert" className="text-blue-600 hover:underline">CompressPic 格式转换工具</Link>，你可以轻松在 JPG、PNG 和 WebP 之间转换，所有操作在浏览器本地完成，安全便捷。
              </p>
              <p className="text-gray-600">
                想要深入了解图片压缩的原理和最佳实践？推荐阅读我们的<Link href="/blog/image-compression-guide" className="text-blue-600 hover:underline"> 图片压缩完全指南</Link>。
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
