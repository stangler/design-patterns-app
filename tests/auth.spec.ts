import { test, expect } from '@playwright/test';

/**
 * 認証フローのテスト
 * Supabase APIをモックして外部依存なしでテストします
 */

// Supabase URLの全リクエストをモックするヘルパー
// Chromiumでは実Supabase APIへのリクエストが遅延し、ローディング状態が長引く問題を防ぐ
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

test.describe('サインインページ', () => {
  test.beforeEach(async ({ page }) => {
    // Supabase全リクエストをモック（Chromiumでの初期化遅延を防ぐ）
    await mockAllSupabaseRequests(page);
  });

  test('サインインページが正しく表示される', async ({ page }) => {
    await page.goto('/auth/sign-in');

    await expect(page.locator('h2')).toHaveText('サインイン');
    await expect(page.locator('input#email')).toBeVisible();
    await expect(page.locator('input#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toHaveText('サインイン');
  });

  test('「パスワードを忘れた場合」リンクが表示される', async ({ page }) => {
    await page.goto('/auth/sign-in');

    const resetLink = page.getByText('パスワードを忘れた場合');
    await expect(resetLink).toBeVisible();
    await expect(resetLink).toHaveAttribute('href', '/auth/reset-password');
  });

  test('空フォームでサインインするとHTML5バリデーションが機能する', async ({ page }) => {
    await page.goto('/auth/sign-in');
    // フォームが表示されるまで待機
    await expect(page.locator('button[type="submit"]')).toBeVisible({ timeout: 10000 });

    // 何も入力せずにサブミット
    await page.locator('button[type="submit"]').click({ force: true });

    // HTML5のrequiredバリデーションによりフォームは送信されない
    // emailフィールドがフォーカスされたままになる
    await expect(page).toHaveURL('/auth/sign-in');
  });

  test('無効なメールアドレス形式でサインインするとバリデーションが機能する', async ({ page }) => {
    await page.goto('/auth/sign-in');
    // フォームが表示されるまで待機
    await expect(page.locator('input#email')).toBeVisible({ timeout: 10000 });

    await page.locator('input#email').fill('invalid-email');
    await page.locator('input#password').fill('password123');
    await page.locator('button[type="submit"]').click({ force: true });

    // HTML5のtype="email"バリデーションによりフォームは送信されない
    await expect(page).toHaveURL('/auth/sign-in');
  });

  test('Supabaseエラー時にエラーメッセージが表示される', async ({ page }) => {

    // Supabase認証APIをモック（認証失敗を返す）- beforeEachのモックより優先される（LIFO）
    await page.route('**/dwdmalgfmnehjgwobzsv.supabase.co/auth/v1/**', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'invalid_grant',
          error_description: 'Invalid login credentials',
        }),
      });
    });

    await page.goto('/auth/sign-in');
    await expect(page.locator('button[type="submit"]')).toBeVisible({ timeout: 10000 });

    await page.locator('input#email').fill('test@example.com');
    await page.locator('input#password').fill('wrongpassword');
    await page.locator('button[type="submit"]').click();

    // エラーメッセージが表示されることを確認
    const errorMessage = page.locator('.bg-red-100, .bg-red-900');
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
  });

  test('サインイン中はボタンが無効化される', async ({ page }) => {

    // Supabase認証APIをモック（遅延レスポンス）- beforeEachのモックより優先される（LIFO）
    await page.route('**/dwdmalgfmnehjgwobzsv.supabase.co/auth/v1/**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'invalid_grant' }),
      });
    });

    await page.goto('/auth/sign-in');
    await expect(page.locator('button[type="submit"]')).toBeVisible({ timeout: 10000 });

    await page.locator('input#email').fill('test@example.com');
    await page.locator('input#password').fill('password123');
    await page.locator('button[type="submit"]').click();

    // サブミット中はボタンが無効化されテキストが変わる
    await expect(page.locator('button[type="submit"]')).toBeDisabled({ timeout: 10000 });
    await expect(page.locator('button[type="submit"]')).toHaveText('サインイン中...', { timeout: 10000 });
  });

  test('「パスワードを忘れた場合」リンクのhrefが正しい', async ({ page }) => {
    await page.goto('/auth/sign-in');

    const resetLink = page.getByText('パスワードを忘れた場合');
    await expect(resetLink).toBeVisible({ timeout: 10000 });
    await expect(resetLink).toHaveAttribute('href', '/auth/reset-password');
  });
});

test.describe('サインアップページ', () => {
  test.beforeEach(async ({ page }) => {
    // Supabase全リクエストをモック（Chromiumでの初期化遅延を防ぐ）
    await mockAllSupabaseRequests(page);
  });

  test('サインアップページが正しく表示される', async ({ page }) => {
    await page.goto('/auth/sign-up');

    await expect(page.locator('h2')).toHaveText('アカウントを作成');
    await expect(page.locator('input#email')).toBeVisible();
    await expect(page.locator('input#password')).toBeVisible();
    await expect(page.locator('input#confirmPassword')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toHaveText('アカウントを作成');
  });

  test('パスワードが一致しない場合にエラーメッセージが表示される', async ({ page }) => {

    await page.goto('/auth/sign-up');
    // フォームが表示されるまで待機
    await expect(page.locator('button[type="submit"]')).toBeVisible({ timeout: 10000 });

    await page.locator('input#email').fill('test@example.com');
    await page.locator('input#password').fill('password123');
    await page.locator('input#confirmPassword').fill('differentpassword');
    await page.locator('button[type="submit"]').click();

    await expect(page.getByText('パスワードが一致しません')).toBeVisible({ timeout: 10000 });
  });

  test('パスワードが6文字未満の場合にエラーメッセージが表示される', async ({ page }) => {

    await page.goto('/auth/sign-up');
    // フォームが表示されるまで待機
    await expect(page.locator('button[type="submit"]')).toBeVisible({ timeout: 10000 });

    await page.locator('input#email').fill('test@example.com');
    await page.locator('input#password').fill('abc');
    await page.locator('input#confirmPassword').fill('abc');
    await page.locator('button[type="submit"]').click();

    await expect(page.getByText('パスワードは6文字以上で入力してください')).toBeVisible({ timeout: 10000 });
  });

  test('サインアップ成功時に確認メールメッセージが表示される', async ({ page }) => {

    // Supabase サインアップAPIをモック（成功を返す）- beforeEachのモックより優先される（LIFO）
    await page.route('**/dwdmalgfmnehjgwobzsv.supabase.co/auth/v1/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'mock-user-id',
          email: 'test@example.com',
          confirmation_sent_at: new Date().toISOString(),
        }),
      });
    });

    await page.goto('/auth/sign-up');
    await expect(page.locator('button[type="submit"]')).toBeVisible({ timeout: 10000 });

    await page.locator('input#email').fill('test@example.com');
    await page.locator('input#password').fill('password123');
    await page.locator('input#confirmPassword').fill('password123');
    await page.locator('button[type="submit"]').click();

    await expect(page.getByText('確認メールを送信しました。メールをご確認ください。')).toBeVisible({ timeout: 10000 });
  });

  test('サインアップ成功後にフォームがリセットされる', async ({ page }) => {

    // Supabase サインアップAPIをモック - beforeEachのモックより優先される（LIFO）
    await page.route('**/dwdmalgfmnehjgwobzsv.supabase.co/auth/v1/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'mock-user-id',
          email: 'test@example.com',
        }),
      });
    });

    await page.goto('/auth/sign-up');
    await expect(page.locator('button[type="submit"]')).toBeVisible({ timeout: 10000 });

    await page.locator('input#email').fill('test@example.com');
    await page.locator('input#password').fill('password123');
    await page.locator('input#confirmPassword').fill('password123');
    await page.locator('button[type="submit"]').click();

    // フォームがリセットされることを確認
    await expect(page.locator('input#email')).toHaveValue('', { timeout: 10000 });
    await expect(page.locator('input#password')).toHaveValue('', { timeout: 10000 });
    await expect(page.locator('input#confirmPassword')).toHaveValue('', { timeout: 10000 });
  });

  test('サインアップ中はボタンが無効化される', async ({ page }) => {

    // Supabase サインアップAPIをモック（遅延レスポンス）- beforeEachのモックより優先される（LIFO）
    await page.route('**/dwdmalgfmnehjgwobzsv.supabase.co/auth/v1/**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'mock-user-id' }),
      });
    });

    await page.goto('/auth/sign-up');
    await expect(page.locator('button[type="submit"]')).toBeVisible({ timeout: 10000 });

    await page.locator('input#email').fill('test@example.com');
    await page.locator('input#password').fill('password123');
    await page.locator('input#confirmPassword').fill('password123');
    await page.locator('button[type="submit"]').click();

    await expect(page.locator('button[type="submit"]')).toBeDisabled({ timeout: 10000 });
    await expect(page.locator('button[type="submit"]')).toHaveText('作成中...', { timeout: 10000 });
  });
});

test.describe('パスワードリセットページ', () => {
  test.beforeEach(async ({ page }) => {
    // Supabase全リクエストをモック（Chromiumでの初期化遅延を防ぐ）
    await mockAllSupabaseRequests(page);
  });

  test('パスワードリセットページが正しく表示される', async ({ page }) => {
    await page.goto('/auth/reset-password');

    await expect(page.locator('h2')).toHaveText('パスワードリセット');
    await expect(page.locator('input#email')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toHaveText('リセットメールを送信');
  });

  test('「サインインに戻る」ボタンが表示される', async ({ page }) => {
    await page.goto('/auth/reset-password');

    // 「サインインに戻る」はbutton要素（href属性なし）
    const signInButton = page.getByText('サインインに戻る');
    await expect(signInButton).toBeVisible({ timeout: 10000 });
    await expect(signInButton).toHaveRole('button');
  });

  test('リセットメール送信成功時に成功メッセージが表示される', async ({ page }) => {

    // Supabase パスワードリセットAPIをモック - beforeEachのモックより優先される（LIFO）
    // resetPasswordForEmailは /auth/v1/recover または /auth/v1/magiclink エンドポイントを使用
    await page.route('**/dwdmalgfmnehjgwobzsv.supabase.co/auth/v1/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
    });

    await page.goto('/auth/reset-password');
    await expect(page.locator('button[type="submit"]')).toBeVisible({ timeout: 10000 });

    await page.locator('input#email').fill('test@example.com');
    await page.locator('button[type="submit"]').click();

    await expect(
      page.getByText('パスワードリセットメールを送信しました。メールをご確認ください。')
    ).toBeVisible({ timeout: 10000 });
  });

  test('空のメールアドレスで送信するとバリデーションエラーが表示される', async ({ page }) => {
    await page.goto('/auth/reset-password');

    // メールアドレスを入力せずにサブミット
    await page.locator('button[type="submit"]').click({ force: true });

    // HTML5のrequiredバリデーションによりフォームは送信されない
    await expect(page).toHaveURL('/auth/reset-password');
  });
});