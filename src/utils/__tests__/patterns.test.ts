import { describe, it, expect } from 'vitest';
import { getDesignPatterns, getPatternById, searchPatterns } from '@/utils/patterns';

describe('patterns.ts', () => {
  describe('getDesignPatterns', () => {
    it('すべてのデザインパターンを取得する', () => {
      const patterns = getDesignPatterns();
      expect(patterns.length).toBeGreaterThan(0);
      expect(patterns[0].name).toBe('Singleton');
      expect(patterns[1].name).toBe('Factory Method');
      expect(patterns[2].name).toBe('Abstract Factory'); // Creationalの3番目
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
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results.some(p => p.name === 'Singleton')).toBe(true);
    });

    it('説明で検索する', () => {
      const results = searchPatterns('インスタンス');
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results.some(p => p.name === 'Singleton')).toBe(true);
    });

    it('意図で検索する', () => {
      const results = searchPatterns('オブジェクト');
      expect(results.length).toBeGreaterThanOrEqual(1);
      const names = results.map(p => p.name);
      expect(names.some(name => ['Factory Method', 'Observer', 'Abstract Factory'].includes(name))).toBe(true);
    });

    it('空のクエリで全パターンを返す', () => {
      const results = searchPatterns('');
      const allPatterns = getDesignPatterns();
      expect(results.length).toBe(allPatterns.length);
    });

    it('存在しないクエリで空の配列を返す', () => {
      const results = searchPatterns('存在しないパターンXYZ123');
      expect(results).toHaveLength(0);
    });
  });
});