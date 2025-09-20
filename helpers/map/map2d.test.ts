// map2D.test.ts
import { describe, it, expect } from 'vitest';
import * as map2D from './map2D';

describe('dirFrom', () => {
    it('maps string keys without uppercasing', () => {
        const d = map2D.dirFrom({ u: map2D.DIR.UP }, 'u');
        expect(d).toBe(map2D.DIR.UP);
    });

    it('maps string keys with uppercasing normalization', () => {
        const d = map2D.dirFrom({ U: map2D.DIR.UP }, 'u', true);
        expect(d).toBe(map2D.DIR.UP);
    });

    it('supports number-key maps', () => {
        const d = map2D.dirFrom({ 0: map2D.DIR.RIGHT }, 0);
        expect(d).toBe(map2D.DIR.RIGHT);
    });

    it('throws on invalid direction key', () => {
        expect(() => map2D.dirFrom({ X: map2D.DIR.LEFT } as any, 'nope')).toThrowError(
            /Invalid direction/
        );
    });
});

describe('dirFromURDL', () => {
    it('parses U/T as UP', () => {
        expect(map2D.dirFromURDL('U')).toBe(map2D.DIR.UP);
        expect(map2D.dirFromURDL('u')).toBe(map2D.DIR.UP);
        expect(map2D.dirFromURDL('T')).toBe(map2D.DIR.UP);
    });

    it('parses R/D/B/L correctly', () => {
        expect(map2D.dirFromURDL('R')).toBe(map2D.DIR.RIGHT);
        expect(map2D.dirFromURDL('D')).toBe(map2D.DIR.DOWN);
        expect(map2D.dirFromURDL('B')).toBe(map2D.DIR.DOWN);
        expect(map2D.dirFromURDL('L')).toBe(map2D.DIR.LEFT);
    });

    it('throws on unknown letters', () => {
        expect(() => map2D.dirFromURDL('Z')).toThrow();
    });
});

describe('dirFromArrows', () => {
    it('parses ^ and A as UP', () => {
        expect(map2D.dirFromArrows('^')).toBe(map2D.DIR.UP);
        expect(map2D.dirFromArrows('a')).toBe(map2D.DIR.UP);
    });

    it('parses >, V, < as RIGHT/DOWN/LEFT', () => {
        expect(map2D.dirFromArrows('>')).toBe(map2D.DIR.RIGHT);
        expect(map2D.dirFromArrows('V')).toBe(map2D.DIR.DOWN);
        expect(map2D.dirFromArrows('<')).toBe(map2D.DIR.LEFT);
    });

    it('throws on unknown glyphs', () => {
        expect(() => map2D.dirFromArrows('X')).toThrow();
    });
});

describe('move (Axis.Cartesian: x→right, y↑up)', () => {
    const axis = map2D.Axis.Cartesian as const;

    it('moves orthogonally by default count=1', () => {
        expect(map2D.move([0, 0], map2D.DIR.UP, undefined, axis)).toEqual([0, 1]);
        expect(map2D.move([0, 0], map2D.DIR.DOWN, undefined, axis)).toEqual([0, -1]);
        expect(map2D.move([0, 0], map2D.DIR.LEFT, undefined, axis)).toEqual([-1, 0]);
        expect(map2D.move([0, 0], map2D.DIR.RIGHT, undefined, axis)).toEqual([1, 0]);
    });

    it('moves diagonally with DIR_DIAG / DIR8', () => {
        expect(map2D.move([0, 0], map2D.DIR_DIAG.UP_RIGHT, 1, axis)).toEqual([1, 1]);
        expect(map2D.move([0, 0], map2D.DIR8.DOWN_LEFT, 2, axis)).toEqual([-2, -2]);
    });

    it('respects count > 1', () => {
        expect(map2D.move([1, 1], map2D.DIR.RIGHT, 3, axis)).toEqual([4, 1]);
        expect(map2D.move([1, 1], map2D.DIR.UP, 3, axis)).toEqual([1, 4]);
    });

    it('diagonal equals sequential orthogonal steps (UP_RIGHT)', () => {
        const diag = map2D.move([5, 5], map2D.DIR8.UP_RIGHT, 1, axis);
        const step1 = map2D.move([5, 5], map2D.DIR.RIGHT, 1, axis);
        const step2 = map2D.move(step1, map2D.DIR.UP, 1, axis);
        expect(diag).toEqual(step2);
    });
});

describe('move (Axis.Screen: x→right, y↓down)', () => {
    const axis = map2D.Axis.Screen as const;

    it('inverts vertical sign compared to Cartesian', () => {
        expect(map2D.move([0, 0], map2D.DIR.UP, 1, axis)).toEqual([0, -1]);
        expect(map2D.move([0, 0], map2D.DIR.DOWN, 1, axis)).toEqual([0, 1]);
    });

    it('keeps horizontal the same', () => {
        expect(map2D.move([0, 0], map2D.DIR.LEFT, 2, axis)).toEqual([-2, 0]);
        expect(map2D.move([0, 0], map2D.DIR.RIGHT, 2, axis)).toEqual([2, 0]);
    });

    it('diagonals reflect screen orientation (UP_RIGHT → y-)', () => {
        expect(map2D.move([10, 10], map2D.DIR8.UP_RIGHT, 3, axis)).toEqual([13, 7]);
    });
});