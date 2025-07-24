import { LogoutButton } from '@/components/auth/LogoutButton';

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-4xl p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <LogoutButton />
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Welcome to your stamp collection!
        </p>
      </div>
    </div>
  );
}
