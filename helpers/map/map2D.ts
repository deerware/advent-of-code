export enum Axis {
    /** Cartesian = x → right, y ↑ up */
    Cartesian,
    /** Screen = x → right, y ↓ down */
    Screen,
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
    const vert = (dy: number) => axis === Axis.Screen ? -dy : dy;

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