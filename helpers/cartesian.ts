// I know it's not really cartesian, but I don't know what to call it.

// Tohle celý asi zahodit, ale nechám to tu pro inspiraci, třeba to někdy předělám na něco fajnovýho.

const defaultNamedDIRs = {
    left: { r: -1, c: 0 },
    right: { r: 1, c: 0 },
    top: { r: 0, c: -1 },
    bottom: { r: 0, c: 1 },
};
const namedXDIRs = {
    top_left: { r: -1, c: -1 },
    top_right: { r: -1, c: 1 },
    bottom_right: { r: 1, c: 1 },
    bottom_left: { r: 1, c: -1 },
};
const defaultDIRs = [
    { r: -1, c: 0 },
    { r: 0, c: 1 },
    { r: 1, c: 0 },
    { r: 0, c: -1 }
];
const namedAllDIRs = { ...defaultNamedDIRs, ...namedXDIRs };

export type Pos = { r: number, c: number };
export type PosD = Pos & { dir: allDIR };

export type DIR = keyof typeof defaultNamedDIRs;
export type xDIR = keyof typeof namedXDIRs;
export type allDIR = keyof typeof namedAllDIRs;

export default {
    /** T-R-B-L */
    DIRs: defaultDIRs,
    namedDIRs: defaultNamedDIRs,
    /** TR-BR-BL-TL */
    XDIRs: [
        { r: -1, c: 1 },
        { r: 1, c: 1 },
        { r: 1, c: -1 },
        { r: -1, c: -1 },
    ],
    namedXDIRs: namedXDIRs,
    /** T-TR-R-BR-B-BL-L-TL */
    allDIRs: [
        { r: -1, c: 0 },
        { r: -1, c: 1 },
        { r: 0, c: 1 },
        { r: 1, c: 1 },
        { r: 1, c: 0 },
        { r: 1, c: -1 },
        { r: 0, c: -1 },
        { r: -1, c: -1 },
    ],
    namedAllDIRs,
    posAround(pos: Pos, DIRs: Pos[] = defaultDIRs) {
        return DIRs.map(d => ({ r: pos.r + d.r, c: pos.c + d.c }));
    },
    cPosAround<T extends DIR>(pos: Pos, namedDIRs?: Record<T, Pos>) {
        if (!namedDIRs)
            namedDIRs = defaultNamedDIRs as Record<T, Pos>;

        const result: PosD[] = [];
        for (const name in namedDIRs) {
            result.push({ r: pos.r + namedDIRs[name].r, c: pos.c + namedDIRs[name].c, dir: name as T });
        }
        return result;
    },
    namedPosAround<T extends string>(pos: Pos, namedDIRs: Record<T, Pos>) {
        const named: Record<string, Pos> = {};
        for (const name in namedDIRs) {
            named[name] = { r: pos.r + namedDIRs[name].r, c: pos.c + namedDIRs[name].c };
        }
        return named as Record<T, Pos>;
    },
    dataAround,
    namedDataAround,
    move(pos: Pos, dir: keyof typeof namedAllDIRs) {
        return { r: pos.r + namedAllDIRs[dir].r, c: pos.c + namedAllDIRs[dir].c };
    },
    get,
    key(pos: Pos) {
        return `${pos.r},${pos.c}`;
    }
}

function dataAround<T>(pos: Pos, data: T[][], outOfBounds?: false, DIRs?: Pos[]): T[]
function dataAround<T>(pos: Pos, data: T[][], outOfBounds: true, DIRs?: Pos[]): (T | null)[]
function dataAround<T>(pos: Pos, data: string[], outOfBounds?: false, DIRs?: Pos[]): string[]
function dataAround<T>(pos: Pos, data: string[], outOfBounds: true, DIRs?: Pos[]): (string | null)[]
function dataAround<T>(pos: Pos, data: T[][] | string[], outOfBounds = false, DIRs: Pos[] = defaultDIRs): (T | string | null)[] {
    const around = [];
    for (const { r, c } of DIRs) {
        const newRow = pos.r + r;
        const newCol = pos.c + c;

        if (newRow < 0 || newRow >= data.length || newCol < 0 || newCol >= data[0].length) {
            if (outOfBounds)
                around.push(null);
            continue;
        }

        around.push(data[newRow][newCol]);
    }
    return around;
}

function namedDataAround<T, K extends string>(pos: Pos, data: T[][], namedDIRs: Record<K, Pos>): Record<K, T | null>
function namedDataAround<T, K extends string>(pos: Pos, data: string[], namedDIRs: Record<K, Pos>): Record<K, string | null>
function namedDataAround<T, K extends string>(pos: Pos, data: T[][] | string[], namedDIRs: Record<K, Pos>): Record<K, T | string | null> {
    const named: Record<string, T | string | null> = {};
    for (const name in namedDIRs) {
        const { r, c } = namedDIRs[name];
        const newRow = pos.r + r;
        const newCol = pos.c + c;

        if (newRow < 0 || newRow >= data.length || newCol < 0 || newCol >= data[0].length)
            named[name] = null;
        else
            named[name] = data[newRow][newCol];
    }
    return named as Record<K, T | string | null>;
}

function get<T>(data: T[][], pos: Pos): T | null
function get<T>(data: string[], pos: Pos): string | null
function get<T>(data: T[][] | string[], pos: Pos): T | string | null {
    if (pos.r < 0 || pos.r >= data.length || pos.c < 0 || pos.c >= data[0].length)
        return null;

    return data[pos.r][pos.c] ?? null;
}