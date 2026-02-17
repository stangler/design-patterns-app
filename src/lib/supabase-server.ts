import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // ミドルウェアから呼ばれる場合は Cookie の設定ができない場合がある
            // その場合はエラーを無視して続行
          }
        },
      },
    }
  );
}

// ミドルウェア用の Supabase クライアント作成関数
export function createMiddlewareClient(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // ミドルウェアでは Set-Cookie ヘッダーをレスポンスに追加する必要がある
          // この関数はミドルウェア内で使用されるため、ここでは何もしない
          // 実際の Cookie 設定はミドルウェア側で行う
        },
      },
    }
  );

  return supabase;
}