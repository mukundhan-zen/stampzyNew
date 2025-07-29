'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Home, 
  Plus, 
  Search, 
  TrendingUp, 
  Settings, 
  Menu,
  User,
  Collection,
  Images
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { LogoutButton } from '@/components/auth/LogoutButton';

export type NavigationItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
};

const navigationItems: NavigationItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Add Stamp',
    href: '/add-stamp',
    icon: Plus,
  },
  {
    title: 'Browse Stamps',
    href: '/stamps',
    icon: Search,
  },
  {
    title: 'Collections',
    href: '/collections',
    icon: Collection,
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: TrendingUp,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  // Don't show navigation on auth pages
  if (pathname?.startsWith('/login') || pathname?.startsWith('/register') || pathname?.startsWith('/sign-')) {
    return null;
  }

  // Don't show navigation if not authenticated
  if (!user) {
    return null;
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 lg:w-72 lg:bg-sidebar lg:border-r lg:border-sidebar-border",
        className
      )}>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="flex items-center justify-between px-6 py-4 border-b border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
                <Images className="w-5 h-5 text-sidebar-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-sidebar-foreground">
                  Stamp Tracker
                </h1>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.title}
                  {item.badge && (
                    <span className="ml-auto bg-sidebar-ring text-sidebar-primary-foreground text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="px-4 py-4 border-t border-sidebar-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-sidebar-accent rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-sidebar-accent-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {user.user_metadata?.full_name || user.email}
                  </p>
                  <p className="text-xs text-sidebar-foreground/60 truncate">
                    @{user.user_metadata?.username || 'user'}
                  </p>
                </div>
              </div>
              <LogoutButton 
                variant="ghost" 
                size="sm" 
                showIcon={true} 
                showText={false}
                className="text-sidebar-foreground hover:text-sidebar-accent-foreground"
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Navigation Header */}
      <div className="lg:hidden sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open navigation</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Images className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-foreground">
                      Stamp Tracker
                    </h1>
                  </div>
                </div>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.title}
                      {item.badge && (
                        <span className="ml-auto bg-ring text-primary-foreground text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="px-4 py-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-accent-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user.user_metadata?.full_name || user.email}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        @{user.user_metadata?.username || 'user'}
                      </p>
                    </div>
                  </div>
                  <LogoutButton 
                    variant="ghost" 
                    size="sm" 
                    showIcon={true} 
                    showText={false}
                  />
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <Images className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-semibold text-foreground">
            Stamp Tracker
          </h1>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border">
        <nav className="flex justify-around items-center py-2">
          {navigationItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center p-2 text-xs font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{item.title}</span>
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs px-1 rounded-full min-w-[16px] h-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}