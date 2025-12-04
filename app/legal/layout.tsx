'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Shield, RefreshCw } from 'lucide-react';

const LAST_UPDATED = "December 4, 2025";

const navigation = [
  {
    name: 'Terms of Service',
    href: '/legal/terms',
    icon: FileText,
  },
  {
    name: 'Privacy Policy',
    href: '/legal/privacy',
    icon: Shield,
  },
  {
    name: 'Refund Policy',
    href: '/legal/refund',
    icon: RefreshCw,
  },
];

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Navigation - Horizontal Scrollable Tabs (Sticky) */}
      <div className="lg:hidden sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex min-w-max px-4 py-3 space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap
                    transition-all duration-200
                    ${
                      isActive
                        ? 'bg-navy text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Layout with Sidebar */}
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar - Sticky */}
          <aside className="lg:sticky lg:top-8 lg:self-start lg:w-64 flex-shrink-0">
            <nav className="hidden lg:block space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg
                      transition-all duration-200
                      ${
                        isActive
                          ? 'bg-navy text-white shadow-md'
                          : 'bg-white text-slate-700 hover:bg-slate-100 hover:shadow-sm'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Last Updated - Desktop */}
            <div className="hidden lg:block mt-8 p-4 bg-slate-100 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600">
                <span className="font-semibold">Last Updated:</span>
                <br />
                {LAST_UPDATED}
              </p>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Last Updated - Mobile */}
            <div className="lg:hidden mb-6 p-3 bg-slate-100 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600">
                <span className="font-semibold">Last Updated:</span> {LAST_UPDATED}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 md:p-8 lg:p-12">
              {children}
            </div>
          </main>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

