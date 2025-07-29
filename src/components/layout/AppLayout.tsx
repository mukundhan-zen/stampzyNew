'use client';

import { usePathname } from 'next/navigation';
import { Navigation } from './Navigation';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  // Don't show layout on auth pages
  const isAuthPage = pathname?.startsWith('/login') || 
                     pathname?.startsWith('/register') || 
                     pathname?.startsWith('/sign-');

  if (isAuthPage || loading || !user) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <Navigation />
      
      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden lg:pl-72">
        {/* Main content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
        
        {/* Mobile bottom navigation padding */}
        <div className="lg:hidden h-16" />
      </div>
    </div>
  );
}

export default AppLayout;