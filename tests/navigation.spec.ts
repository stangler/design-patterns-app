import { test, expect } from '@playwright/test';

/**
 * ナビゲーション・ルーティング保護のテスト
 * ミドルウェアによるアクセス制御とナビゲーションの動作を検証します
 */

// Supabase全リクエストをモックするヘルパー（Chromiumでの初期化遅延を防ぐ）
async function mockAllSupabaseRequests(page: import('@playwright/test').Page) {
  await page.route('**/dwdmalgfmnehjgwobzsv.supabase.co/**', async (route) => {
    const url = route.request().url();
    // Auth API
    if (url.includes('/auth/v1/')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { session: null, user: null }, error: null }),
      });
      return;
    }
    // REST API
    if (url.includes('/rest/v1/')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
      return;
    }
    // その他
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: { session: null, user: null }, error: null }),
    });
  });
}

test.describe('ミドルウェアによるルーティング保護', () => {
  test('未認証ユーザーが /patterns にアクセスすると /auth/sign-in にリダイレクトされる', async ({ page }) => {
    // Cookieなし（未認証）でアクセス
    await page.goto('/patterns');

    // ミドルウェアによりサインインページへリダイレクトされる
    await expect(page).toHaveURL('/auth/sign-in');
  });

  test('未認証ユーザーが /patterns/singleton にアクセスすると /auth/sign-in にリダイレクトされる', async ({ page }) => {
    // Cookieなし（未認証）でアクセス
    await page.goto('/patterns/singleton');

    // ミドルウェアによりサインインページへリダイレクトされる
    await expect(page).toHaveURL('/auth/sign-in');
  });

  test('未認証ユーザーが /dashboard にアクセスするとアクセス制限が表示される', async ({ page }) => {
    // Supabase全リクエストをモック（未認証を返す）
    await mockAllSupabaseRequests(page);

    await page.goto('/dashboard');

    // ダッシュボードはクライアントサイドで制御されるためアクセス制限メッセージが表示される
    await expect(page.locator('h1')).toHaveText('アクセス制限', { timeout: 10000 });
    await expect(page.getByText('ダッシュボードを利用するにはサインインが必要です。')).toBeVisible();
  });
});

test.describe('Navbarの表示（未認証）', () => {
  test.beforeEach(async ({ page }) => {
    // Supabase全リクエストをモック（Chromiumでの初期化遅延を防ぐ）
    await mockAllSupabaseRequests(page);
  });

  test('未認証時にNavbarにサインインとアカウント作成ボタンが表示される', async ({ page }) => {
    await page.goto('/');

    const navbar = page.locator('nav');
    await expect(navbar.getByText('サインイン')).toBeVisible();
    await expect(navbar.getByText('アカウントを作成')).toBeVisible();
    // ログアウトボタンは表示されない
    await expect(navbar.getByText('ログアウト')).not.toBeVisible();
  });

  test('未認証時にNavbarのサインインリンクが /auth/sign-in を指している', async ({ page }) => {
    await page.goto('/');

    const navbar = page.locator('nav');
    const signInLink = navbar.getByRole('link', { name: 'サインイン' });
    await expect(signInLink).toHaveAttribute('href', '/auth/sign-in');
  });

  test('未認証時にNavbarのアカウント作成リンクが /auth/sign-up を指している', async ({ page }) => {
    await page.goto('/');

    const navbar = page.locator('nav');
    const signUpLink = navbar.getByRole('link', { name: 'アカウントを作成' });
    await expect(signUpLink).toHaveAttribute('href', '/auth/sign-up');
  });

  test('Navbarのサイトタイトルをクリックするとトップページへ遷移する', async ({ page }) => {
    await page.goto('/auth/sign-in');
    // Navbarが表示されるまで待機
    await expect(page.locator('nav')).toBeVisible({ timeout: 10000 });

    // サイトタイトルのリンクを確認してクリック
    const siteTitle = page.locator('nav').getByRole('link', { name: 'デザインパターン学習サイト' });
    await siteTitle.click({ force: true });

    await expect(page).toHaveURL('/');
  });
});

// Supabase localStorage キー
const SUPABASE_URL = 'https://dwdmalgfmnehjgwobzsv.supabase.co';
const PROJECT_REF = SUPABASE_URL.replace('https://', '').split('.')[0];
const STORAGE_KEY = `sb-${PROJECT_REF}-auth-token`;

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

test.describe('Navbarの表示（認証済み）', () => {
  test('認証済み時にNavbarにダッシュボードとパターン一覧リンクが表示される', async ({ page }) => {
    // Supabase Auth APIをモック（トークンリフレッシュ用）
    await page.route('**/auth/v1/**', async (route) => {
      const url = route.request().url();
      if (url.includes('/auth/v1/signout')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({}),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
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
        }),
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

    await page.goto('/');

    const navbar = page.locator('nav');
    await expect(navbar.getByText('ダッシュボード')).toBeVisible({ timeout: 10000 });
    await expect(navbar.getByText('パターン一覧')).toBeVisible();
    await expect(navbar.getByText('ログアウト')).toBeVisible();
    // 未認証用ボタンは表示されない
    await expect(navbar.getByRole('link', { name: 'サインイン' })).not.toBeVisible();
  });
});

test.describe('トップページのナビゲーション', () => {
  test.beforeEach(async ({ page }) => {
    // Supabase全リクエストをモック（Chromiumでの初期化遅延を防ぐ）
    await mockAllSupabaseRequests(page);
  });

  test('未認証時にトップページにサインインとアカウント作成ボタンが表示される', async ({ page }) => {
    await page.goto('/');

    const main = page.locator('main');
    await expect(main.getByRole('link', { name: 'サインイン' })).toBeVisible({ timeout: 10000 });
    await expect(main.getByRole('link', { name: 'アカウントを作成' })).toBeVisible();
  });

  test('未認証時のトップページでサインインボタンをクリックするとサインインページへ遷移する', async ({ page }) => {
    await page.goto('/');
    // メインコンテンツのサインインリンクが表示されるまで待機
    const signInLink = page.locator('main').getByRole('link', { name: 'サインイン' });
    await expect(signInLink).toBeVisible({ timeout: 10000 });
    // force: true で要素が安定するのを待たずにクリック
    await signInLink.click({ force: true });

    await expect(page).toHaveURL('/auth/sign-in');
  });

  test('未認証時のトップページでアカウント作成ボタンをクリックするとサインアップページへ遷移する', async ({ page }) => {
    await page.goto('/');
    // メインコンテンツのアカウント作成リンクが表示されるまで待機
    const signUpLink = page.locator('main').getByRole('link', { name: 'アカウントを作成' });
    await expect(signUpLink).toBeVisible({ timeout: 10000 });
    // force: true で要素が安定するのを待たずにクリック
    await signUpLink.click({ force: true });

    await expect(page).toHaveURL('/auth/sign-up');
  });
});

test.describe('404ページ', () => {
  test('存在しないページにアクセスすると404が返される', async ({ page }) => {
    const response = await page.goto('/nonexistent-page-xyz');
    expect(response?.status()).toBe(404);
  });
});
