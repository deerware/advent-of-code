export enum Axis {
    /** Cartesian = x → right, y ↑ up */
    Cartesian,
    /** Grid = x → right, y ↓ down */
    Grid,
}

export enum DIR {
    UP = '^',
    RIGHT = '>',
    DOWN = 'V',
    LEFT = '<',
}

export enum DIR_DIAG {
    UP_RIGHT = 'F',
    DOWN_RIGHT = 'L',
    DOWN_LEFT = 'J',
    UP_LEFT = '7',
}

export enum DIR8 {
    UP = '^',
    RIGHT = '>',
    DOWN = 'V',
    LEFT = '<',
    UP_RIGHT = 'F',
    DOWN_RIGHT = 'L',
    DOWN_LEFT = 'J',
    UP_LEFT = '7',
}

export type DIR_ANY = DIR8 | DIR | DIR_DIAG;

export type Pos = [x: number, y: number];

export function dirFrom(match: { [key: string]: DIR }, el: string, uppercase?: boolean): DIR;
export function dirFrom(match: { [key: number]: DIR }, el: number, uppercase?: boolean): DIR;
export function dirFrom(match: { [key: string | number]: DIR }, el: string | number, uppercase?: boolean): DIR;
export function dirFrom(
    match: { [key: string | number]: DIR },
    el: string | number,
    uppercase = false
): DIR {
    if (uppercase && typeof el === "string")
        el = el.toUpperCase();

    if (match[el] === undefined)
        throw new Error("Invalid direction.");

    return match[el];
}

export function dirFromURDL(from: string): DIR {
    return dirFrom(
        {
            U: DIR.UP,
            T: DIR.UP,
            R: DIR.RIGHT,
            D: DIR.DOWN,
            B: DIR.DOWN,
            L: DIR.LEFT,
        },
        from,
        true
    );
}

export function dirFromArrows(from: string): DIR {
    return dirFrom(
        {
            "^": DIR.UP,
            A: DIR.UP,
            ">": DIR.RIGHT,
            V: DIR.DOWN,
            "<": DIR.LEFT,
        },
        from,
        true
    );
}

/**
 * Move `count` steps from (x,y) in a given direction.
 * Axis controls whether positive y means "up" (Cartesian) or "down" (Grid).
 * Defaults to Cartesian for backward-compatibility.
 */
export function move(
    [x, y]: Pos,
    dir: DIR_ANY,
    count = 1,
    axis: Axis = Axis.Cartesian
): Pos {
    // In Grid mode we flip the sign of "vertical" motion.
    const vert = (dy: number) => axis === Axis.Grid ? -dy : dy;

    switch (dir) {
        case DIR8.UP:
            return [x, y + vert(count)];
        case DIR8.UP_RIGHT:
            return [x + count, y + vert(count)];
        case DIR8.RIGHT:
            return [x + count, y];
        case DIR8.DOWN_RIGHT:
            return [x + count, y - vert(count)];
        case DIR8.DOWN:
            return [x, y - vert(count)];
        case DIR8.DOWN_LEFT:
            return [x - count, y - vert(count)];
        case DIR8.LEFT:
            return [x - count, y];
        case DIR8.UP_LEFT:
            return [x - count, y + vert(count)];
    }

    throw new Error("Unimplemented");
}

/** default = returns distances like [1, 3] */
export function manhattan(
    pos1: Pos,
    pos2: Pos,
    /** true = returns distances like [1, 3] false = returns distances like [-1, 3] */
    abs = true
): [dx: number, dy: number] {
    const dx = pos2[0] - pos1[0];
    const dy = pos2[1] - pos1[1];

    if (abs)
        return [Math.abs(dx), Math.abs(dy)];

    return [dx, dy];
}

function same(pos1: Pos, pos2: Pos) {
    return same.X(pos1, pos2) && same.Y(pos1, pos2);
}

same.X = (pos1: Pos, pos2: Pos) => {
    return pos1[0] == pos2[0];
}

same.Y = (pos1: Pos, pos2: Pos) => {
    return pos1[1] == pos2[1];
}

export { same };

function yDir(y: number, axis: Axis): DIR8 {
    if (y == 0)
        throw 'y == 0';

    if (axis == Axis.Cartesian)
        return y > 0 ? DIR8.UP : DIR8.DOWN;

    if (axis == Axis.Grid)
        return y > 0 ? DIR8.DOWN : DIR8.UP;

    throw 'Unimplemented axis';
}

export function dir(pos1: Pos, pos2: Pos, axis: Axis): DIR8 | null {
    if (same(pos1, pos2))
        return null;

    const distance = manhattan(pos1, pos2, false)

    if (same.X(pos1, pos2))
        return yDir(distance[1], axis);

    if (same.Y(pos1, pos2))
        return distance[0] > 0 ? DIR8.RIGHT : DIR8.LEFT;

    if (distance[0] > 0)
        if (yDir(distance[1], axis) == DIR8.UP)
            return DIR8.UP_RIGHT
        else
            return DIR8.DOWN_RIGHT

    if (yDir(distance[1], axis) == DIR8.UP)
        return DIR8.UP_LEFT
    else
        return DIR8.DOWN_LEFT
}

export function posKey(pos: Pos) {
    return `x${pos[0]}y${pos[1]}`;
}

export function isWithinBounds(pos: Pos, xDim: number, yDim: number) {
    return pos[0] >= 0 && pos[0] < xDim && pos[1] >= 0 && pos[1] < yDim;
}

export function forEach<T>(map: T[][], callback: ((tile: T, pos: Pos) => boolean | void)) {
    for (let y = 0; y < map.length; y++) {
        const row = map[y];
        for (let x = 0; x < row.length; x++)
            callback(row[x], [x, y]);
    }
}