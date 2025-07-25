'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { mainNavLinks } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { LucideIcon, icons } from 'lucide-react';

// A helper function to get the Lucide icon component from its name
const getIcon = (name: string): LucideIcon | null => {
  const Icon = icons[name as keyof typeof icons];
  return Icon || null;
};

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border md:hidden">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto">
        {mainNavLinks.map((link) => {
          const Icon = getIcon(link.icon);
          const isActive = pathname.startsWith(link.path);

          return (
            <Link
              key={link.path}
              href={link.path}
              className={cn(
                'inline-flex flex-col items-center justify-center px-5 font-medium hover:bg-muted focus:outline-none transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {Icon && <Icon className="w-5 h-5 mb-1" />}
              <span className="text-xs font-medium">{link.label}</span>
              <span className="sr-only">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
