import Link from 'next/link';

interface ToolCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

export default function ToolCard({ href, icon, title, description, color }: ToolCardProps) {
  return (
    <Link
      href={href}
      className="group block p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
    >
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${color}`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
}
