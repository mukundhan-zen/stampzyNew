import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';
import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import { EnvVarWarning } from '@/components/env-var-warning';
import AuthButton from '@/components/header-auth';
import { DesktopSidebar } from '@/components/navigation/DesktopSidebar';
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Stamp Collection Tracker',
  description: 'A modern app to manage your stamp collection',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen">
            <DesktopSidebar isCollapsed={false} />
            <div className="flex-1 flex flex-col">
              <header className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex gap-5 items-center font-semibold">
                    <Link href={'/'}>App</Link>
                  </div>
                  {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
                </div>
              </header>
              <main className="flex-1 p-5 pb-20 md:pb-5">{children}</main>
              <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-4">
                <p>
                  Powered by{" "}
                  <a
                    href="https:alchemistudio.ai"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    Alchemi
                  </a>
                </p>
                <ThemeSwitcher />
              </footer>
            </div>
            <MobileBottomNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
