import log from '../../log'
import { colors } from '../../types'
import * as global from '../../global';
import { randomUUID } from 'crypto';

export default async function gardengroups() {
    log('Day 12: Garden Groups');

    await global.run('2024/12_Garden_Groups', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 140],
        ['Part 1 test 1', part1, 'sampleData2.txt', 772],
        ['Part 1 test 1', part1, 'sampleData3.txt', 1930],
        ['Part 1', part1, 'input.txt', 1518548],
        false,
        ['Part 2 test 1', part2, 'sampleData2.txt', 0],
        ['Part 2', part2, 'input.txt', null],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
type Pos = { r: number, c: number };
function parseData(_data: string[]) {
    return _data;
}

async function part1(data: Data): Promise<number> {
    const regions: { [key: string]: { plant: string, area: number, perimeter: number } } = {}
    const posRegMap: { [key: string]: string } = {};

    for (let r = 0; r < data.length; r++) {
        for (let c = 0; c < data[0].length; c++) {
            const pos = { r, c };
            let region = findRegion(data, pos, posRegMap);
            if (!region) {
                region = randomUUID();
                posRegMap[`${r},${c}`] = region;
            }

            if (!regions[region])
                regions[region] = { plant: data[r][c], area: 1, perimeter: 0 };
            else
                regions[region].area++;

            regions[region].perimeter += scanAround(data, pos, true).filter(p => p !== data[r][c]).length;
        }
    }

    let total = 0;
    for (const region of Object.values(regions)) {
        total += region.area * region.perimeter;
    }
    return total;
}

async function part2(data: Data): Promise<number> {
    return -Infinity;
}

const DIRs = [
    { r: -1, c: 0 },
    { r: 1, c: 0 },
    { r: 0, c: -1 },
    { r: 0, c: 1 },
];

function findRegion(data: Data, pos: Pos, posRegMap: { [key: string]: string }, visited: Set<string> = new Set()): string | null {
    const key = `${pos.r},${pos.c}`;
    if (visited.has(key)) return null;
    visited.add(key);

    if (posRegMap[key])
        return posRegMap[key];

    const plant = data[pos.r][pos.c];
    const around = aroundPos(pos, data);
    for (const { r, c } of around) {
        if (data[r][c] !== plant) continue;

        let region = findRegion(data, { r, c }, posRegMap, visited);
        if (region) {
            posRegMap[key] = region;
            return region;
        }
    }
}

function aroundPos(pos: Pos, data?: Data) {
    if (!data)
        return DIRs.map(dir => ({ r: pos.r + dir.r, c: pos.c + dir.c }));

    const around: Pos[] = [];
    for (const dir of DIRs) {
        const r = pos.r + dir.r;
        const c = pos.c + dir.c;
        if (r < 0 || r >= data.length || c < 0 || c >= data[0].length)
            continue;

        around.push({ r, c });
    }
    return around;
}

function scanAround(data: Data, pos: Pos, outOfBound?: false): string[]
function scanAround(data: Data, pos: Pos, outOfBound: true): (string | null)[]
function scanAround(data: Data, pos: Pos, outOfBound = false) {
    const around: (string | null)[] = [];
    for (const { r, c } of aroundPos(pos)) {
        if (r < 0 || r >= data.length || c < 0 || c >= data[0].length) {
            if (outOfBound)
                around.push(null);
            continue;
        }

        around.push(data[r][c]);
    }
    return around;
}