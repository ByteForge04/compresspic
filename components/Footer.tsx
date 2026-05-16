export default function Footer() {
  return (
    <footer className="py-8 border-t border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} CompressPic. 所有图片处理均在本地完成。
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
