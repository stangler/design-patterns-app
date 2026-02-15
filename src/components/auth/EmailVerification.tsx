'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmailVerification() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(window.location.search);
      const tokenHash = params.get('token_hash');
      const type = params.get('type');
      
      if (type !== 'signup_confirmation' || !tokenHash) {
        setMessage('無効な確認リンクです');
        return;
      }

      setIsVerifying(true);
      setMessage('メールを確認しています...');

      try {
        const { error } = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token_hash: tokenHash }),
        }).then(res => res.json());

        if (error) {
          setMessage('メール確認中にエラーが発生しました');
        } else {
          setMessage('メール認証が完了しました！');
          setTimeout(() => {
            router.push('/patterns');
          }, 2000);
        }
      } catch {
        setMessage('メール確認中にエラーが発生しました');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            メール認証
          </h2>
        </div>
        
        <div className="mt-8 space-y-6">
          {message && (
            <div className={`py-4 px-6 rounded-md ${
              message.includes('完了') 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {message}
            </div>
          )}
          
          {isVerifying && (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          )}
        </div>
      </div>
    </div>
  );
}