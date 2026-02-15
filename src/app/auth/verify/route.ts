import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { token_hash } = await request.json();

    if (!token_hash) {
      return NextResponse.json(
        { error: '無効なトークンです' },
        { status: 400 }
      );
    }

    // Verify the email using Supabase
    const { error } = await supabase.auth.verifyOtp({
      type: 'email',
      token_hash: token_hash
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'メール認証が完了しました' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}