'use client';

import { AuthProvider } from '@/context/AuthContext';

import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProtectedRoute>{children}</ProtectedRoute>
    </AuthProvider>
  );
}
 