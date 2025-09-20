// dir.test.ts
import { describe, it, expect } from 'vitest';
import { dir, Axis, DIR8, type Pos } from '../map2D';

describe('dir: null when positions equal', () => {
    it('returns null for identical positions', () => {
        expect(dir([0, 0], [0, 0], Axis.Cartesian)).toBeNull();
        expect(dir([3, -5], [3, -5], Axis.Screen)).toBeNull();
    });
});

describe('dir: pure horizontal', () => {
    const axisC = Axis.Cartesian;
    const axisS = Axis.Screen;

    it('RIGHT when x2 > x1', () => {
        const a: Pos = [0, 0];
        const b: Pos = [5, 0];
        expect(dir(a, b, axisC)).toBe(DIR8.RIGHT);
        expect(dir(a, b, axisS)).toBe(DIR8.RIGHT);
    });

    it('LEFT when x2 < x1', () => {
        const a: Pos = [5, 0];
        const b: Pos = [0, 0];
        expect(dir(a, b, axisC)).toBe(DIR8.LEFT);
        expect(dir(a, b, axisS)).toBe(DIR8.LEFT);
    });
});

describe('dir: pure vertical (depends on axis)', () => {
    it('Cartesian: UP if y2 > y1, DOWN if y2 < y1', () => {
        expect(dir([0, 0], [0, 3], Axis.Cartesian)).toBe(DIR8.UP);
        expect(dir([0, 0], [0, -3], Axis.Cartesian)).toBe(DIR8.DOWN);
    });

    it('Screen: DOWN if y2 > y1, UP if y2 < y1', () => {
        expect(dir([0, 0], [0, 3], Axis.Screen)).toBe(DIR8.DOWN);
        expect(dir([0, 0], [0, -3], Axis.Screen)).toBe(DIR8.UP);
    });
});

describe('dir: diagonals (Cartesian vs Screen)', () => {
    it('Q1/Q4 reflect axis vertical convention', () => {
        // dx>0, dy>0
        expect(dir([0, 0], [2, 3], Axis.Cartesian)).toBe(DIR8.UP_RIGHT);
        expect(dir([0, 0], [2, 3], Axis.Screen)).toBe(DIR8.DOWN_RIGHT);

        // dx>0, dy<0
        expect(dir([0, 0], [2, -3], Axis.Cartesian)).toBe(DIR8.DOWN_RIGHT);
        expect(dir([0, 0], [2, -3], Axis.Screen)).toBe(DIR8.UP_RIGHT);
    });

    it('Q2/Q3 reflect axis vertical convention', () => {
        // dx<0, dy>0
        expect(dir([0, 0], [-2, 3], Axis.Cartesian)).toBe(DIR8.UP_LEFT);
        expect(dir([0, 0], [-2, 3], Axis.Screen)).toBe(DIR8.DOWN_LEFT);

        // dx<0, dy<0
        expect(dir([0, 0], [-2, -3], Axis.Cartesian)).toBe(DIR8.DOWN_LEFT);
        expect(dir([0, 0], [-2, -3], Axis.Screen)).toBe(DIR8.UP_LEFT);
    });
});

describe('dir: boundary sanity', () => {
    it('prefers cardinal when aligned axes (no diagonal)', () => {
        expect(dir([7, 9], [7, 12], Axis.Cartesian)).toBe(DIR8.UP);
        expect(dir([7, 9], [10, 9], Axis.Cartesian)).toBe(DIR8.RIGHT);
    });

    it('handles large distances same as small (only direction matters)', () => {
        expect(dir([0, 0], [1000, 1], Axis.Cartesian)).toBe(DIR8.UP_RIGHT);
        expect(dir([0, 0], [1000, -1], Axis.Screen)).toBe(DIR8.UP_RIGHT);
    });
});
