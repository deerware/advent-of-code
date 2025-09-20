// manhattan_same.test.ts
import { describe, it, expect } from 'vitest';
import { manhattan, same, type Pos } from '../map2D';

describe('manhattan', () => {
    it('returns absolute distances by default (abs=true)', () => {
        const p1: Pos = [4, -2];
        const p2: Pos = [3, 1];
        expect(manhattan(p1, p2)).toEqual([1, 3]);
    });

    it('returns signed deltas when abs=false (pos1 - pos2)', () => {
        const p1: Pos = [4, -2];
        const p2: Pos = [3, 1];
        expect(manhattan(p1, p2, false)).toEqual([-1, 3]);
    });

    it('is symmetric in abs mode', () => {
        const a: Pos = [10, 10];
        const b: Pos = [13, 8];
        expect(manhattan(a, b)).toEqual([3, 2]);
        expect(manhattan(b, a)).toEqual([3, 2]);
    });

    it('is antisymmetric in signed mode', () => {
        const a: Pos = [10, 10];
        const b: Pos = [13, 8];
        expect(manhattan(a, b, false)).toEqual([3, -2]);
        expect(manhattan(b, a, false)).toEqual([-3, 2]);
    });
});

describe('same', () => {
    it('true only if both coordinates match', () => {
        expect(same([1, 2], [1, 2])).toBe(true);
        expect(same([1, 2], [1, 3])).toBe(false);
        expect(same([1, 2], [0, 2])).toBe(false);
    });

    it('same.X compares x only', () => {
        expect(same.X([5, 0], [5, 99])).toBe(true);
        expect(same.X([5, 0], [6, 0])).toBe(false);
    });

    it('same.Y compares y only', () => {
        expect(same.Y([0, 7], [99, 7])).toBe(true);
        expect(same.Y([0, 7], [0, 8])).toBe(false);
    });
});
