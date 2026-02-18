import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const pathname = new URL(request.url).pathname;

  console.log('[proxy] pathname:', pathname);

  // /patterns で始まるパスを保護されたルートとする
  const isProtectedRoute = pathname.startsWith('/patterns');

  if (isProtectedRoute) {
    // Supabase のセッション Cookie を確認する
    // Supabase SSR は "sb-<project-ref>-auth-token" という名前の Cookie を使用する
    const cookies = request.cookies.getAll();
    console.log('[proxy] cookies:', cookies.map(c => c.name));
    const hasAuthCookie = cookies.some(
      (cookie) =>
        cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token')
    );

    console.log('[proxy] hasAuthCookie:', hasAuthCookie);

    if (!hasAuthCookie) {
      // 未認証の場合はサインインページにリダイレクト
      console.log('[proxy] redirecting to /auth/sign-in');
      return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/patterns', '/patterns/:path*'],
};