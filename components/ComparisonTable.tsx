const rows = [
  { feature: '完全免费', us: true, others: '部分收费' },
  { feature: '本地处理，不上传服务器', us: true, others: '需要上传' },
  { feature: '批量处理', us: true, others: '部分支持' },
  { feature: '无需注册', us: true, others: '需要注册' },
  { feature: '无文件大小限制', us: true, others: '有限制' },
  { feature: '格式转换', us: true, others: '部分支持' },
];

export default function ComparisonTable() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">为什么选择 CompressPic</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">功能</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-blue-600">CompressPic</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-gray-500">其他工具</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.feature} className="border-b border-gray-100 last:border-0">
                  <td className="px-6 py-3.5 text-sm text-gray-700">{row.feature}</td>
                  <td className="px-6 py-3.5 text-center">
                    {row.us ? (
                      <span className="text-emerald-500 text-lg">✓</span>
                    ) : (
                      <span className="text-gray-300 text-lg">✕</span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-center text-sm text-gray-500">{row.others}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
