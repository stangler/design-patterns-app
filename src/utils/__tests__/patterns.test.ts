import { describe, it, expect } from 'vitest';
import {
  getDesignPatterns,
  getPatternById,
  searchPatterns,
  getPatternWithDetails,
} from '@/utils/patterns';

const VALID_CATEGORIES = ['creational', 'structural', 'behavioral'] as const;
const TOTAL_PATTERN_COUNT = 22;

describe('patterns.ts', () => {
  // ===================================
  // getDesignPatterns
  // ===================================
  describe('getDesignPatterns', () => {
    it(`${TOTAL_PATTERN_COUNT}個のデザインパターンを返す`, () => {
      const patterns = getDesignPatterns();
      expect(patterns).toHaveLength(TOTAL_PATTERN_COUNT);
    });

    it('Singletonパターンが含まれる', () => {
      const patterns = getDesignPatterns();
      expect(patterns.some((p) => p.name === 'Singleton')).toBe(true);
    });

    it('全パターンのcategoryが有効な値である', () => {
      const patterns = getDesignPatterns();
      patterns.forEach((p) => {
        expect(VALID_CATEGORIES).toContain(p.category);
      });
    });

    it('全パターンのdifficultyが1〜3の範囲内である', () => {
      const patterns = getDesignPatterns();
      patterns.forEach((p) => {
        expect(p.difficulty).toBeGreaterThanOrEqual(1);
        expect(p.difficulty).toBeLessThanOrEqual(3);
      });
    });

    it('全パターンにid・name・description が存在する', () => {
      const patterns = getDesignPatterns();
      patterns.forEach((p) => {
        expect(p.id).toBeTruthy();
        expect(p.name).toBeTruthy();
        expect(p.description).toBeTruthy();
      });
    });

    it('3カテゴリ（creational / structural / behavioral）が全て含まれる', () => {
      const patterns = getDesignPatterns();
      const categories = new Set(patterns.map((p) => p.category));
      expect(categories).toContain('creational');
      expect(categories).toContain('structural');
      expect(categories).toContain('behavioral');
    });
  });

  // ===================================
  // getPatternById
  // ===================================
  describe('getPatternById', () => {
    it('有効なIDでデザインパターンを取得する', () => {
      const pattern = getPatternById('singleton');
      expect(pattern).toBeDefined();
      expect(pattern?.name).toBe('Singleton');
      expect(pattern?.category).toBe('creational');
    });

    it('無効なIDでundefinedを返す', () => {
      const pattern = getPatternById('invalid-id');
      expect(pattern).toBeUndefined();
    });

    it('空文字でundefinedを返す', () => {
      const pattern = getPatternById('');
      expect(pattern).toBeUndefined();
    });

    it('全パターンのIDで取得できる', () => {
      const patterns = getDesignPatterns();
      patterns.forEach((p) => {
        const found = getPatternById(p.id);
        expect(found).toBeDefined();
        expect(found?.id).toBe(p.id);
      });
    });
  });

  // ===================================
  // searchPatterns
  // ===================================
  describe('searchPatterns', () => {
    it('名前で検索する', () => {
      const results = searchPatterns('Singleton');
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results.some((p) => p.name === 'Singleton')).toBe(true);
    });

    it('説明文で検索する', () => {
      const results = searchPatterns('インスタンス');
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results.some((p) => p.name === 'Singleton')).toBe(true);
    });

    it('大文字小文字を区別せずに検索する', () => {
      const upper = searchPatterns('SINGLETON');
      const lower = searchPatterns('singleton');
      expect(upper.length).toBe(lower.length);
      expect(upper.some((p) => p.name === 'Singleton')).toBe(true);
    });

    it('空のクエリで全パターンを返す', () => {
      const results = searchPatterns('');
      const allPatterns = getDesignPatterns();
      expect(results).toHaveLength(allPatterns.length);
    });

    it('スペースのみのクエリで全パターンを返す', () => {
      const results = searchPatterns('   ');
      const allPatterns = getDesignPatterns();
      expect(results).toHaveLength(allPatterns.length);
    });

    it('存在しないクエリで空の配列を返す', () => {
      const results = searchPatterns('存在しないパターンXYZ123');
      expect(results).toHaveLength(0);
    });
  });

  // ===================================
  // getPatternWithDetails
  // ===================================
  describe('getPatternWithDetails', () => {
    it('有効なIDで詳細情報を返す', () => {
      const detail = getPatternWithDetails('singleton');
      expect(detail).toBeDefined();
      expect(detail?.name).toBe('Singleton');
      expect(detail?.category).toBe('creational');
    });

    it('返却値にoverviewが含まれる', () => {
      const detail = getPatternWithDetails('singleton');
      expect(detail?.overview).toBeDefined();
      expect(typeof detail?.overview).toBe('string');
    });

    it('返却値にcodeExampleが含まれる', () => {
      const detail = getPatternWithDetails('singleton');
      expect(detail?.codeExample).toBeDefined();
      expect(typeof detail?.codeExample).toBe('string');
    });

    it('ベースのDesignPatternフィールドが引き継がれる', () => {
      const base = getPatternById('factory-method');
      const detail = getPatternWithDetails('factory-method');
      expect(detail?.id).toBe(base?.id);
      expect(detail?.name).toBe(base?.name);
      expect(detail?.category).toBe(base?.category);
      expect(detail?.difficulty).toBe(base?.difficulty);
      expect(detail?.description).toBe(base?.description);
    });

    it('無効なIDでundefinedを返す', () => {
      expect(getPatternWithDetails('invalid-id')).toBeUndefined();
    });

    it('空文字でundefinedを返す', () => {
      expect(getPatternWithDetails('')).toBeUndefined();
    });
  });
});
