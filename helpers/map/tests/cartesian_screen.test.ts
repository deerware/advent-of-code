// cartesian_screen.test.ts
import { describe, it, expect } from 'vitest';
import * as map2D from '../map2D';
import * as cartesian from '../cartesian';
import * as grid from '../grid';

describe('module re-exports', () => {
    it('re-exports DIR/DIR_DIAG/DIR8 and parsers consistently', () => {
        expect(cartesian.DIR.UP).toBe(map2D.DIR.UP);
        expect(cartesian.DIR_DIAG.UP_RIGHT).toBe(map2D.DIR_DIAG.UP_RIGHT);
        expect(cartesian.DIR8.LEFT).toBe(map2D.DIR8.LEFT);

        // Functions should be the same references (they’re re-exported)
        expect(cartesian.dirFrom).toBe(map2D.dirFrom);
        expect(cartesian.dirFromURDL).toBe(map2D.dirFromURDL);
        expect(cartesian.dirFromArrows).toBe(map2D.dirFromArrows);

        // Same for screen
        expect(grid.DIR.UP).toBe(map2D.DIR.UP);
        expect(grid.dirFromArrows).toBe(map2D.dirFromArrows);
    });
});

describe('cartesian.move uses Axis.Cartesian semantics', () => {
    it('UP increases y by +1', () => {
        expect(cartesian.move([0, 0], map2D.DIR.UP)).toEqual([0, 1]);
    });

    it('DOWN decreases y by -1', () => {
        expect(cartesian.move([0, 0], map2D.DIR.DOWN)).toEqual([0, -1]);
    });

    it('RIGHT and LEFT affect x only', () => {
        expect(cartesian.move([5, 5], map2D.DIR.RIGHT, 2)).toEqual([7, 5]);
        expect(cartesian.move([5, 5], map2D.DIR.LEFT, 3)).toEqual([2, 5]);
    });

    it('defaults count to 1', () => {
        expect(cartesian.move([2, 2], map2D.DIR.RIGHT)).toEqual([3, 2]);
    });

    it('diagonal equals orthogonal sequence', () => {
        const diag = cartesian.move([1, 1], map2D.DIR8.UP_LEFT);
        const seq = cartesian.move(cartesian.move([1, 1], map2D.DIR.LEFT), map2D.DIR.UP);
        expect(diag).toEqual(seq);
    });
});

describe('screen.move uses Axis.Screen semantics', () => {
    it('UP decreases y by -1 (screen coords)', () => {
        expect(grid.move([0, 0], map2D.DIR.UP)).toEqual([0, -1]);
    });

    it('DOWN increases y by +1 (screen coords)', () => {
        expect(grid.move([0, 0], map2D.DIR.DOWN, 4)).toEqual([0, 4]);
    });

    it('RIGHT and LEFT affect x only', () => {
        expect(grid.move([5, 5], map2D.DIR.RIGHT, 2)).toEqual([7, 5]);
        expect(grid.move([5, 5], map2D.DIR.LEFT, 3)).toEqual([2, 5]);
    });

    it('diagonals reflect screen orientation', () => {
        expect(grid.move([10, 10], map2D.DIR8.UP_RIGHT, 3)).toEqual([13, 7]);
    });
});
