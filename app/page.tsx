'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    console.log('🏠 Home page - checking auth:', { isAuthenticated, loading });
    
    if (!loading) {
      if (isAuthenticated) {
        console.log('✅ Authenticated - redirecting to dashboard');
        router.replace('/dashboard'); // Use replace instead of push
      } else {
        console.log('❌ Not authenticated - redirecting to login');
        router.replace('/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}