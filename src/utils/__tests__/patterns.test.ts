import { describe, it, expect } from 'vitest';
import { getDesignPatterns, getPatternById, searchPatterns } from '@/utils/patterns';

describe('patterns.ts', () => {
  describe('getDesignPatterns', () => {
    it('すべてのデザインパターンを取得する', () => {
      const patterns = getDesignPatterns();
      expect(patterns).toHaveLength(3);
      expect(patterns[0].name).toBe('Singleton');
      expect(patterns[1].name).toBe('Factory Method');
      expect(patterns[2].name).toBe('Observer');
    });
  });

  describe('getPatternById', () => {
    it('有効なIDでデザインパターンを取得する', () => {
      const pattern = getPatternById('singleton');
      expect(pattern).toBeDefined();
      expect(pattern?.name).toBe('Singleton');
    });

    it('無効なIDでundefinedを返す', () => {
      const pattern = getPatternById('invalid-id');
      expect(pattern).toBeUndefined();
    });
  });

  describe('searchPatterns', () => {
    it('名前で検索する', () => {
      const results = searchPatterns('Singleton');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Singleton');
    });

    it('説明で検索する', () => {
      const results = searchPatterns('インスタンス');
      expect(results).toHaveLength(2);
      expect(results.map(p => p.name)).toContain('Singleton');
      expect(results.map(p => p.name)).toContain('Factory Method');
    });

    it('意図で検索する', () => {
      const results = searchPatterns('オブジェクト');
      expect(results).toHaveLength(2);
      expect(results.map(p => p.name)).toContain('Factory Method');
      expect(results.map(p => p.name)).toContain('Observer');
    });

    it('空のクエリで全パターンを返す', () => {
      const results = searchPatterns('');
      expect(results).toHaveLength(3);
    });

    it('存在しないクエリで空の配列を返す', () => {
      const results = searchPatterns('存在しないパターン');
      expect(results).toHaveLength(0);
    });
  });
});