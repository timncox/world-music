import React from 'react';
import { LogIn } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';

interface SignInButtonProps {
  onSignIn: () => Promise<void>;
  isProcessing: boolean;
  error: string | null;
}

export default function SignInButton({ onSignIn, isProcessing, error }: SignInButtonProps) {
  const { data: session } = useSession();

  const handleSignIn = async () => {
    if (session) return;
    try {
      await signIn('worldcoin', { 
        callbackUrl: window.location.origin,
        redirect: true
      });
    } catch (err) {
      console.error('Sign in error:', err);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleSignIn}
        disabled={isProcessing || !!session}
        className="w-full py-4 px-6 rounded-lg flex items-center justify-center space-x-2 text-lg font-semibold bg-indigo-500 hover:bg-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <LogIn className="w-6 h-6" />
        <span>{isProcessing ? 'Connecting...' : 'Sign in with World ID'}</span>
      </button>
      {error && (
        <p className="text-red-400 text-sm text-center">{error}</p>
      )}
    </div>
  );
}