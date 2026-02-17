import { describe, it, expect, vi, beforeEach } from 'vitest';

// shiki をモック
vi.mock('shiki', () => ({
  codeToHtml: vi.fn(),
}));

import { codeToHtml } from 'shiki';
import { highlightCode } from '@/lib/highlight';

const mockCodeToHtml = vi.mocked(codeToHtml);

describe('highlight.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===================================
  // highlightCode
  // ===================================
  describe('highlightCode', () => {
    it('TypeScriptコードをHTMLに変換して返す', async () => {
      const mockHtml = '<pre><code class="shiki">const x = 1;</code></pre>';
      mockCodeToHtml.mockResolvedValue(mockHtml);

      const result = await highlightCode('const x = 1;');

      expect(result).toBe(mockHtml);
    });

    it('codeToHtml を lang:ts, theme:github-dark で呼び出す', async () => {
      mockCodeToHtml.mockResolvedValue('<pre></pre>');

      await highlightCode('class Foo {}');

      expect(mockCodeToHtml).toHaveBeenCalledWith('class Foo {}', {
        lang: 'ts',
        theme: 'github-dark',
      });
    });

    it('空文字のコードも処理できる', async () => {
      const mockHtml = '<pre><code></code></pre>';
      mockCodeToHtml.mockResolvedValue(mockHtml);

      const result = await highlightCode('');

      expect(result).toBe(mockHtml);
      expect(mockCodeToHtml).toHaveBeenCalledWith('', { lang: 'ts', theme: 'github-dark' });
    });

    it('codeToHtml がエラーをスローした場合は例外が伝播する', async () => {
      mockCodeToHtml.mockRejectedValue(new Error('shiki error'));

      await expect(highlightCode('const x = 1;')).rejects.toThrow('shiki error');
    });
  });
});
