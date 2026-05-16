import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-8 border-t border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">在线工具</h4>
            <div className="flex flex-col gap-2">
              <Link href="/#compress" className="text-sm text-gray-500 hover:text-blue-600">图片压缩</Link>
              <Link href="/convert" className="text-sm text-gray-500 hover:text-blue-600">格式转换</Link>
              <Link href="/crop" className="text-sm text-gray-500 hover:text-blue-600">图片裁剪</Link>
              <Link href="/watermark" className="text-sm text-gray-500 hover:text-blue-600">图片加水印</Link>
              <Link href="/webp" className="text-sm text-gray-500 hover:text-blue-600">图片转WebP</Link>
              <Link href="/batch-compress" className="text-sm text-gray-500 hover:text-blue-600">批量压缩</Link>
              <Link href="/resize" className="text-sm text-gray-500 hover:text-blue-600">图片尺寸调整</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">帮助与支持</h4>
            <div className="flex flex-col gap-2">
              <Link href="/faq" className="text-sm text-gray-500 hover:text-blue-600">常见问题</Link>
              <Link href="/blog" className="text-sm text-gray-500 hover:text-blue-600">博客</Link>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-blue-600">隐私政策</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">关于</h4>
            <div className="flex flex-col gap-2">
              <Link href="/about" className="text-sm text-gray-500 hover:text-blue-600">关于我们</Link>
              <p className="text-sm text-gray-500">所有图片处理均在您的浏览器本地完成，不会上传到任何服务器。</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">CompressPic</h4>
            <p className="text-sm text-gray-500">免费在线图片处理工具，保护您的隐私安全。</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} CompressPic. 保留所有权利。
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <span>🔒 隐私安全</span>
            <span>⚡ 免费使用</span>
            <span>📱 多端适配</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
