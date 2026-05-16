const steps = [
  {
    num: '01',
    title: '选择图片',
    desc: '拖拽或点击上传需要处理的图片，支持 JPG、PNG、WebP 格式',
  },
  {
    num: '02',
    title: '调整参数',
    desc: '根据需要调整压缩质量、输出格式等参数',
  },
  {
    num: '03',
    title: '下载结果',
    desc: '处理完成后一键下载，支持单张下载或批量打包',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">如何使用</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white text-xl font-bold mb-4">
                {step.num}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
