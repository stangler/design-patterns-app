import { test, expect } from '@playwright/test';

test('トップページが正しく表示される', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // ページタイトルを確認
  await expect(page).toHaveTitle(/Create Next App/);
  // メインコンテンツが表示されていることを確認
  await expect(page.locator('h1')).toBeVisible();
});

test('patternsページが正しく表示される', async ({ page }) => {
  await page.goto('http://localhost:3000/patterns');

  // patternsページのタイトルを確認
  await expect(page).toHaveTitle(/Create Next App/);
  // patternsページのコンテンツが表示されていることを確認
  await expect(page.locator('h1')).toBeVisible();
});

test('patternsページの機能テスト', async ({ page }) => {
  await page.goto('http://localhost:3000/patterns');

  // patternsページの各要素が表示されていることを確認
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('h1')).toHaveText('デザインパターン一覧');
  
  // 説明文が表示されていることを確認
  await expect(page.getByText('すべてのデザインパターンを探索しましょう')).toBeVisible();
  
  // 3つのデザインパターンカードがあることを確認
  await expect(page.locator('h2')).toHaveCount(3);
  
  // 各カードの要素が表示されていることを確認
  await expect(page.locator('h2').first()).toBeVisible();
  await expect(page.locator('p').first()).toBeVisible();
  
  // カードが正しくレンダリングされていることを確認（背景色のクラスで判定）
  const cards = page.locator('div.bg-white.dark\\:bg-zinc-800');
  await expect(cards).toHaveCount(3);
  
  // 現在のURLが正しいことを確認
  await expect(page).toHaveURL('http://localhost:3000/patterns');
});