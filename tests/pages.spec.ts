import { test, expect } from '@playwright/test';

/**
 * 基本的なページ表示テスト
 * baseURL（http://localhost:3000）を使用した相対パスでテストします
 */

test('トップページが正しく表示される', async ({ page }) => {
  await page.goto('/');

  // ページタイトルの確認
  await expect(page).toHaveTitle(/デザインパターン学習サイト/);
  // メインコンテンツが表示されていることを確認
  await expect(page.locator('h1')).toBeVisible();
});

test('トップページにデザインパターン学習サイトの見出しが表示される', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('h1')).toHaveText('デザインパターン学習サイト');
});

test('トップページに今日のおすすめデザインパターンセクションが表示される', async ({ page }) => {
  // Supabase Auth APIをモック（未認証）
  await page.route('**/auth/v1/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: { session: null, user: null }, error: null }),
    });
  });

  await page.goto('/');

  await expect(page.getByText('今日のおすすめデザインパターン')).toBeVisible({ timeout: 10000 });
});

test('サインインページが正しく表示される', async ({ page }) => {
  await page.goto('/auth/sign-in');

  await expect(page).toHaveTitle(/デザインパターン学習サイト/);
  await expect(page.locator('h2')).toHaveText('サインイン');
});

test('サインアップページが正しく表示される', async ({ page }) => {
  await page.goto('/auth/sign-up');

  await expect(page).toHaveTitle(/デザインパターン学習サイト/);
  await expect(page.locator('h2')).toHaveText('アカウントを作成');
});

test('パスワードリセットページが正しく表示される', async ({ page }) => {
  await page.goto('/auth/reset-password');

  await expect(page).toHaveTitle(/デザインパターン学習サイト/);
  await expect(page.locator('h2')).toHaveText('パスワードリセット');
});

test('未認証ユーザーが /patterns にアクセスすると /auth/sign-in にリダイレクトされる', async ({ page }) => {
  // Cookieなし（未認証）でアクセス - ミドルウェアがリダイレクトする
  await page.goto('/patterns');

  await expect(page).toHaveURL('/auth/sign-in');
});
