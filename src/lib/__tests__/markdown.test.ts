import { describe, it, expect, vi, beforeEach } from 'vitest';

// vi.mock はホイストされるため、vi.hoisted() でモック関数を先に定義する
const { mockExistsSync, mockReadFileSync } = vi.hoisted(() => ({
  mockExistsSync: vi.fn(),
  mockReadFileSync: vi.fn(),
}));

vi.mock('fs', () => ({
  default: {
    existsSync: mockExistsSync,
    readFileSync: mockReadFileSync,
  },
  existsSync: mockExistsSync,
  readFileSync: mockReadFileSync,
}));

import { getMarkdownFile, getSolutionCode } from '@/lib/markdown';

describe('markdown.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===================================
  // getMarkdownFile
  // ===================================
  describe('getMarkdownFile', () => {
    it('ファイルが存在する場合はmetaとcontentHtmlを返す', async () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('---\ntitle: Singleton\n---\n# Singleton Pattern\nThis is a test.');

      const result = await getMarkdownFile('creational', 'singleton', 'explanation.md');

      expect(result).not.toBeNull();
      expect(result?.meta).toEqual({ title: 'Singleton' });
      expect(result?.contentHtml).toContain('Singleton Pattern');
    });

    it('ファイルが存在しない場合はnullを返す', async () => {
      mockExistsSync.mockReturnValue(false);

      const result = await getMarkdownFile('creational', 'singleton', 'explanation.md');

      expect(result).toBeNull();
    });

    it('フロントマターなしのMarkdownも処理できる', async () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('# Simple Content\nNo front matter here.');

      const result = await getMarkdownFile('creational', 'singleton', 'question.md');

      expect(result).not.toBeNull();
      expect(result?.meta).toEqual({});
      expect(result?.contentHtml).toContain('Simple Content');
    });
  });

  // ===================================
  // getSolutionCode
  // ===================================
  describe('getSolutionCode', () => {
    it('solution.tsが存在する場合はコードを返す', () => {
      const sampleCode = 'class Singleton { private static instance: Singleton; }';
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(sampleCode);

      const result = getSolutionCode('creational', 'singleton');

      expect(result).toBe(sampleCode);
    });

    it('solution.tsが存在しない場合はnullを返す', () => {
      mockExistsSync.mockReturnValue(false);

      const result = getSolutionCode('creational', 'singleton');

      expect(result).toBeNull();
    });
  });
});
