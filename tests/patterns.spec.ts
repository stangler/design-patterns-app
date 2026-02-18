import { test, expect } from '@playwright/test';

/**
 * パターン一覧・詳細ページのテスト
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
 * 認証済みセッションをモックするヘルパー
 * - Cookieを設定してミドルウェアのチェックをパス
 * - localStorageを設定してクライアントサイドの認証チェックをパス
 */
async function mockAuthenticatedSession(page: import('@playwright/test').Page) {
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
    // 学習進捗関連のREST API
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
    // その他のREST API（存在チェックなど）
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

test.describe('パターン一覧ページ（認証済み）', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedSession(page);
    // ページが完全にロードされるまで待機
    await page.waitForLoadState('domcontentloaded');
  });

  test('パターン一覧ページが正しく表示される', async ({ page }) => {
    await page.goto('/patterns');

    await expect(page.locator('h1')).toHaveText('デザインパターン一覧', { timeout: 10000 });
    await expect(page.getByText('すべてのデザインパターンを探索しましょう')).toBeVisible();
  });

  test('ダッシュボードへのリンクが表示される', async ({ page }) => {
    await page.goto('/patterns');

    const dashboardLink = page.getByText('→ ダッシュボードで進捗を確認');
    await expect(dashboardLink).toBeVisible({ timeout: 10000 });
    await expect(dashboardLink).toHaveAttribute('href', '/dashboard');
  });

  test('パターンカードが複数表示される', async ({ page }) => {
    await page.goto('/patterns');

    // 22パターンが存在するのでカードが複数表示される
    const patternCards = page.locator('a[href^="/patterns/"]');
    await expect(patternCards).toHaveCount(22, { timeout: 10000 });
  });

  test('Singletonパターンのカードが表示される', async ({ page }) => {
    await page.goto('/patterns');

    await expect(page.getByText('Singleton')).toBeVisible({ timeout: 10000 });
  });

  test('カテゴリーバッジが表示される', async ({ page }) => {
    await page.goto('/patterns');

    // creational, structural, behavioral カテゴリーが表示される
    await expect(page.getByText('creational').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('structural').first()).toBeVisible();
    await expect(page.getByText('behavioral').first()).toBeVisible();
  });

  test('難易度が表示される', async ({ page }) => {
    await page.goto('/patterns');

    await expect(page.getByText('難易度: 1').first()).toBeVisible({ timeout: 10000 });
  });

  test('パターンカードのリンク先が正しい', async ({ page }) => {
    await page.goto('/patterns');

    // Observerカードを探して、可視化されるまで待つ
    const observerLink = page.getByRole('link', { name: /Observer/ }).first();
    await expect(observerLink).toBeVisible({ timeout: 10000 });

    // リンク先が正しいことを確認
    await expect(observerLink).toHaveAttribute('href', '/patterns/observer');
  });

  test('パターン詳細ページが正しく表示される（直接移動）', async ({ page }) => {
    // Next.jsのクライアントサイドナビゲーションの問題を回避し、直接移動でテスト
    // domcontentloadedを使用し、タイムアウトを延長
    await page.goto('/patterns/observer', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await expect(page.locator('h1').first()).toHaveText('Observer', { timeout: 20000 });
  });
});

test.describe('パターン一覧ページ（未認証）', () => {
  test('未認証ユーザーはサインインページへリダイレクトされる', async ({ page }) => {
    // Cookieなし（未認証）でアクセス
    await page.goto('/patterns');

    // ミドルウェアによりリダイレクト
    await expect(page).toHaveURL('/auth/sign-in');
  });
});

test.describe('パターン詳細ページ（認証済み）', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedSession(page);
    // ページが完全にロードされるまで待機
    await page.waitForLoadState('domcontentloaded');
  });

  test('Observerパターン詳細ページが正しく表示される', async ({ page }) => {
    // domcontentloadedを使用し、タイムアウトを延長
    await page.goto('/patterns/observer', { waitUntil: 'domcontentloaded', timeout: 60000 });

    await expect(page.locator('h1').first()).toHaveText('Observer', { timeout: 20000 });
  });

  test('存在しないパターンIDにアクセスすると404が返される', async ({ page }) => {
    // ページをロードしてからレスポンスを確認
    const response = await page.goto('/patterns/nonexistent-pattern-xyz', { waitUntil: 'domcontentloaded', timeout: 60000 });
    // responseがundefinedの場合は、ページの内容で404を確認
    if (response) {
      expect(response.status()).toBe(404);
    } else {
      // ページ内容で404を確認
      await expect(page.getByText('404')).toBeVisible({ timeout: 15000 });
    }
  });
});

test.describe('パターン詳細ページ（未認証）', () => {
  test('未認証ユーザーはサインインページへリダイレクトされる', async ({ page }) => {
    // Cookieなし（未認証）でアクセス
    await page.goto('/patterns/observer');

    // ミドルウェアによりリダイレクト
    await expect(page).toHaveURL('/auth/sign-in');
  });
});