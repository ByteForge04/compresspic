'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

const toolLinks = [
  { href: '/#compress', label: '图片压缩', icon: '↓' },
  { href: '/convert', label: '格式转换', icon: '⇄' },
  { href: '/crop', label: '图片裁剪', icon: '⊞' },
  { href: '/watermark', label: '图片加水印', icon: '⊞' },
  { href: '/webp', label: '图片转WebP', icon: '⚡' },
  { href: '/batch-compress', label: '批量压缩', icon: '▤' },
  { href: '/resize', label: '图片尺寸调整', icon: '⤡' },
];

const navLinks = [
  { href: '/', label: '首页' },
  { href: '/blog', label: '博客' },
  { href: '/faq', label: '常见问题' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-gray-900">
          CompressPic
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              pathname === '/' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            首页
          </Link>

          <div ref={dropdownRef} className="relative">
            <button
              className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                toolLinks.some((t) => t.href === pathname)
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onMouseEnter={() => setDropdownOpen(true)}
            >
              工具
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div
                className="absolute left-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50"
                onMouseLeave={() => setDropdownOpen(false)}
              >
                {toolLinks.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => setDropdownOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      pathname === tool.href
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-base">{tool.icon}</span>
                    {tool.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {navLinks.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="菜单"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className={`block px-4 py-3 text-sm font-medium transition-colors ${
              pathname === '/' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            首页
          </Link>

          <div className="px-4 py-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">工具</span>
          </div>
          {toolLinks.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 pl-8 pr-4 py-2.5 text-sm font-medium transition-colors ${
                pathname === tool.href
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-base">{tool.icon}</span>
              {tool.label}
            </Link>
          ))}

          {navLinks.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-3 text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
