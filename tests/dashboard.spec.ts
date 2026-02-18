import { test, expect } from '@playwright/test';

/**
 * ダッシュボードページのテスト
 * Supabase APIをモックして認証済み状態でテストします
 */

// 認証済みセッションのモックレスポンス
const mockAuthSession = {
  data: {
    session: {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      user: {
        id: 'mock-user-id',
        email: 'test@example.com',
        role: 'authenticated',
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      },
    },
    user: {
      id: 'mock-user-id',
      email: 'test@example.com',
      role: 'authenticated',
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    },
  },
  error: null,
};

// 学習進捗データのモックレスポンス（データあり）
const mockProgressData = [
  {
    id: '1',
    user_id: 'mock-user-id',
    pattern_id: 'singleton',
    status: 'completed',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: 'mock-user-id',
    pattern_id: 'observer',
    status: 'in_progress',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
];

// アクティビティデータのモックレスポンス
const mockActivityData = [
  {
    id: '1',
    user_id: 'mock-user-id',
    pattern_id: 'singleton',
    action: 'complete',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: 'mock-user-id',
    pattern_id: 'observer',
    action: 'start',
    created_at: new Date().toISOString(),
  },
];

// Supabase localStorage キー（プロジェクトrefから生成）
const SUPABASE_URL = 'https://dwdmalgfmnehjgwobzsv.supabase.co';
const PROJECT_REF = SUPABASE_URL.replace('https://', '').split('.')[0];
const STORAGE_KEY = `sb-${PROJECT_REF}-auth-token`;

// localStorageに設定するセッションデータ
const mockSessionStorage = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  expires_in: 3600,
  token_type: 'bearer',
  user: {
    id: 'mock-user-id',
    aud: 'authenticated',
    role: 'authenticated',
    email: 'test@example.com',
    email_confirmed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

/**
 * 認証済みセッションをモックするヘルパー（進捗データあり）
 */
async function mockAuthenticatedWithProgress(page: import('@playwright/test').Page) {
  // Supabase全リクエストをモック（Chromiumでの初期化遅延を防ぐ）
  await page.route('**/dwdmalgfmnehjgwobzsv.supabase.co/**', async (route) => {
    const url = route.request().url();
    if (url.includes('/auth/v1/signout')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
      return;
    }
    // 学習進捗データ
    if (url.includes('/rest/v1/learning_progress')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockProgressData),
      });
      return;
    }
    if (url.includes('/rest/v1/learning_history')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockActivityData),
      });
      return;
    }
    if (url.includes('/rest/v1/quiz_answers')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
      return;
    }
    // その他のREST API
    if (url.includes('/rest/v1/')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
      return;
    }
    // Auth API
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockAuthSession),
    });
  });

  // セッションデータをCookieに設定（@supabase/ssr はcookie storageを使用）
  await page.context().addCookies([
    {
      name: STORAGE_KEY,
      value: JSON.stringify(mockSessionStorage),
      domain: 'localhost',
      path: '/',
    },
  ]);

  // トップページに移動してSupabaseクライアントを初期化
  await page.goto('/');
}

/**
 * 認証済みセッションをモックするヘルパー（進捗データなし）
 */
async function mockAuthenticatedEmpty(page: import('@playwright/test').Page) {
  // Supabase全リクエストをモック（Chromiumでの初期化遅延を防ぐ）
  await page.route('**/dwdmalgfmnehjgwobzsv.supabase.co/**', async (route) => {
    const url = route.request().url();
    if (url.includes('/auth/v1/signout')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
      return;
    }
    // 学習進捗データ（空）
    if (url.includes('/rest/v1/learning_progress')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
      return;
    }
    if (url.includes('/rest/v1/learning_history')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
      return;
    }
    if (url.includes('/rest/v1/quiz_answers')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
      return;
    }
    // その他のREST API
    if (url.includes('/rest/v1/')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
      return;
    }
    // Auth API
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockAuthSession),
    });
  });

  // セッションデータをCookieに設定（@supabase/ssr はcookie storageを使用）
  await page.context().addCookies([
    {
      name: STORAGE_KEY,
      value: JSON.stringify(mockSessionStorage),
      domain: 'localhost',
      path: '/',
    },
  ]);

  // トップページに移動してSupabaseクライアントを初期化
  await page.goto('/');
}

test.describe('ダッシュボードページ（未認証）', () => {
  test('未認証ユーザーにはアクセス制限メッセージが表示される', async ({ page }) => {
    // Supabase Auth APIをモック（未認証）
    await page.route('**/auth/v1/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { session: null, user: null }, error: null }),
      });
    });

    await page.goto('/dashboard');

    await expect(page.locator('h1')).toHaveText('アクセス制限', { timeout: 10000 });
    await expect(page.getByText('ダッシュボードを利用するにはサインインが必要です。')).toBeVisible();
  });

  test('未認証時のアクセス制限ページにサインインボタンが表示される', async ({ page }) => {
    await page.route('**/auth/v1/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { session: null, user: null }, error: null }),
      });
    });

    await page.goto('/dashboard');

    // アクセス制限メッセージが表示されるまで待機
    await expect(page.locator('h1')).toHaveText('アクセス制限', { timeout: 10000 });

    // サインインリンクを確認（href属性で特定）
    const signInButton = page.locator('a[href="/auth/sign-in"]').first();
    await expect(signInButton).toBeVisible({ timeout: 10000 });
  });
});

test.describe('ダッシュボードページ（認証済み・データなし）', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedEmpty(page);
  });

  test('ダッシュボードページが正しく表示される', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.locator('h1')).toHaveText('学習ダッシュボード', { timeout: 10000 });
    await expect(page.getByText('デザインパターンの学習進捗を確認しましょう')).toBeVisible();
  });

  test('カテゴリー別進捗セクションが表示される', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.getByText('カテゴリー別進捗')).toBeVisible({ timeout: 10000 });
  });

  test('クイズ成績セクションが表示される', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.getByText('クイズ成績')).toBeVisible({ timeout: 10000 });
  });

  test('クイックリンクセクションが表示される', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.getByText('クイックリンク')).toBeVisible({ timeout: 10000 });
  });

  test('パターン一覧へのリンクが正しい', async ({ page }) => {
    await page.goto('/dashboard');

    const patternsLink = page.getByRole('link', { name: 'パターン一覧へ' });
    await expect(patternsLink).toBeVisible({ timeout: 10000 });
    await expect(patternsLink).toHaveAttribute('href', '/patterns');
  });
});

test.describe('ダッシュボードページ（認証済み・データあり）', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedWithProgress(page);
  });

  test('ダッシュボードページが正しく表示される', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.locator('h1')).toHaveText('学習ダッシュボード', { timeout: 10000 });
  });

  test('最近のアクティビティセクションが表示される', async ({ page }) => {
    await page.goto('/dashboard');

    // アクティビティデータがある場合は最近のアクティビティが表示される
    await expect(page.getByText('最近のアクティビティ')).toBeVisible({ timeout: 10000 });
  });

  test('アクティビティにSingletonパターンが表示される', async ({ page }) => {
    await page.goto('/dashboard');

    // 複数の要素にマッチする可能性があるため first() を使用
    await expect(page.getByText('Singleton').first()).toBeVisible({ timeout: 10000 });
  });
});
