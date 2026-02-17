import { createBrowserClient } from '@supabase/ssr';

export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// シングルトンインスタンス
let client: ReturnType<typeof createBrowserSupabaseClient> | null = null;

export function getSupabaseClient() {
  if (!client) {
    client = createBrowserSupabaseClient();
  }
  return client;
}