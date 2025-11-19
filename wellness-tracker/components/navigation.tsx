'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, Calendar, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/history', label: 'History', icon: Calendar },
    { href: '/reminders', label: 'Reminders', icon: Bell },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom">
      <div className="flex justify-around items-center h-16 max-w-2xl mx-auto px-4">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors',
                isActive
                  ? 'text-blue-500'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
