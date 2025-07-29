import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            Create Your Account
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Join our community of stamp collectors and start managing your collection today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link 
              href="/sign-in" 
              className="font-medium text-accent hover:text-accent/80 underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}