import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const pathname = new URL(request.url).pathname;

  // /patterns で始まるパスを保護されたルートとする
  const isProtectedRoute = pathname.startsWith('/patterns');

  if (isProtectedRoute) {
    // Supabase SSR クライアントを作成
    let supabaseResponse = NextResponse.next({
      request,
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value);
            });
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) => {
              supabaseResponse.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    // セッションを取得して認証状態を確認
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      // 未認証の場合はサインインページにリダイレクト
      return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }

    return supabaseResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/patterns/:path*']
};