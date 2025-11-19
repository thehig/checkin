'use client';

import { createClient } from '@/lib/supabase/client';
import { Apple, Chrome } from 'lucide-react';

export default function LoginPage() {
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Error logging in with Google:', error);
    }
  };

  const handleAppleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Error logging in with Apple:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Wellness Tracker
          </h1>
          <p className="text-gray-600">
            Track your wellness journey with ease
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 active:scale-[0.98] transition-all shadow-sm"
            >
              <Chrome className="w-6 h-6" />
              Continue with Google
            </button>

            <button
              onClick={handleAppleLogin}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-900 active:scale-[0.98] transition-all shadow-sm"
            >
              <Apple className="w-6 h-6" />
              Continue with Apple
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                Secure authentication
              </span>
            </div>
          </div>

          <p className="text-xs text-center text-gray-500">
            Your data is encrypted and stored securely. We never share your information.
          </p>
        </div>
      </div>
    </div>
  );
}
