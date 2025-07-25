'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { mainNavLinks } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { LucideIcon, icons } from 'lucide-react';

interface DesktopSidebarProps {
  isCollapsed: boolean;
}

// A helper function to get the Lucide icon component from its name
const getIcon = (name: string): LucideIcon | null => {
  const Icon = icons[name as keyof typeof icons];
  return Icon || null;
};

export function DesktopSidebar({ isCollapsed }: DesktopSidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        'hidden md:flex md:flex-col',
        isCollapsed ? 'md:w-14' : 'md:w-64',
        'border-r border-border transition-all duration-300 ease-in-out'
      )}
    >
      <nav className="flex flex-col gap-2 p-2">
        {mainNavLinks.map((link) => {
          const Icon = getIcon(link.icon);
          const isActive = pathname.startsWith(link.path);

          return isCollapsed ? (
            <Tooltip key={link.path}>
              <TooltipTrigger asChild>
                <Link
                  href={link.path}
                  className={cn(
                    buttonVariants({ variant: isActive ? 'default' : 'ghost', size: 'icon' }),
                    'h-9 w-9',
                    isActive &&
                      'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white'
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span className="sr-only">{link.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.label}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={link.path}
              href={link.path}
              className={cn(
                buttonVariants({ variant: isActive ? 'default' : 'ghost', size: 'sm' }),
                isActive &&
                  'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white',
                'justify-start'
              )}
            >
              {Icon && <Icon className="mr-2 h-4 w-4" />} 
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
