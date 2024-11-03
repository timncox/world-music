import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import Header from './components/Header';
import AudioPlayer from './components/AudioPlayer';
import SignInButton from './components/SignInButton';
import PaymentButton from './components/PaymentButton';
import { useMiniKit } from './hooks/useMiniKit';

export default function App() {
  const { data: session } = useSession();
  const { isInitialized, error: initError, authenticate, pay } = useMiniKit();
  const [isPaid, setIsPaid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(initError);

  const handleSignIn = async () => {
    if (!isInitialized) return;
    setError(null);
    setIsProcessing(true);
    try {
      const result = await authenticate();
      if (!result.success) {
        setError(result.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Failed to authenticate');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!isInitialized || !session) return;
    setError(null);
    setIsProcessing(true);
    try {
      const result = await pay();
      if (result.success) {
        setIsPaid(true);
      } else {
        setError(result.error || 'Payment failed');
      }
    } catch (err) {
      setError('Failed to process payment');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white">
      <div className="container mx-auto px-4 py-12 max-w-md">
        <div className="space-y-8">
          <Header />
          
          <div className="aspect-square rounded-lg overflow-hidden shadow-2xl border-2 border-indigo-400">
            <img
              src="https://timncox.github.io/aj.jpeg"
              alt="Arushi Jain - My People Have Deep Roots"
              className="w-full h-full object-cover"
            />
          </div>

          <AudioPlayer
            isUnlocked={isPaid}
            audioUrl="https://timncox.github.io/ajroots.m4a"
          />

          <div className="flex flex-col gap-4">
            {!session && (
              <SignInButton 
                onSignIn={handleSignIn}
                isProcessing={isProcessing}
                error={error}
              />
            )}
            
            {session && !isPaid && (
              <PaymentButton 
                onPayment={handlePayment}
                isProcessing={isProcessing}
                error={error}
              />
            )}
          </div>

          {isPaid && (
            <p className="text-center text-indigo-400">
              ✨ Enjoy your exclusive content!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}