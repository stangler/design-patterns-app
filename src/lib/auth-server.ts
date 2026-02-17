import { createClient } from './supabase-server';

export interface User {
  id: string;
  email: string;
  email_confirmed_at?: string;
  created_at: string;
}

// サーバーサイド用の認証取得メソッド
// Next.jsのサーバーコンポーネントやミドルウェアで使用
export async function getCurrentUserServer() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  } catch (error) {
    console.error('Server-side auth check failed:', error);
    return { user: null, error };
  }
}