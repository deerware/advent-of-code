import log from '../../log'
import { colors } from '../../types'
import * as global from '../../global';

export default async function hoofit() {
    log('Day 10: Hoof It');

    await global.run('2024/10_Hoof_It', [
        // ['Part 1 pre-test 1', part1, 'sampleData1.txt', 2],
        // ['Part 1 pre-test 2', part1, 'sampleData2.txt', 4],
        // ['Part 1 pre-test 3', part1, 'sampleData3.txt', 3],
        ['Part 1 test 1', part1, 'sampleData4.txt', 36],
        ['Part 1', part1, 'input.txt', 550],
        null,
        // ['Part 2 pre-test 1', part2, 'sampleData5.txt', 3],
        // ['Part 2 pre-test 2', part2, 'sampleData6.txt', 13],
        // ['Part 2 pre-test 3', part2, 'sampleData7.txt', 227],
        ['Part 2 test 1', part2, 'sampleData8.txt', 81],
        ['Part 2', part2, 'input.txt', 1255],
    ], parseData);
}

type Pos = { r: number, c: number };
type Data = ReturnType<typeof parseData>;

function parseData(_data: string[]) {
    const startingPoints: Pos[] = [];
    for (let r = 0; r < _data.length; r++) {
        for (let c = 0; c < _data[r].length; c++) {
            if (_data[r][c] === '0')
                startingPoints.push({ r, c });
        }
    }

    return {
        map: _data,
        startingPoints
    };
}

async function part1(data: Data): Promise<number> {
    let sum = 0;
    for (const sp of data.startingPoints)
        sum += explore(data, sp).length;

    return sum;
}

async function part2(data: Data): Promise<number> {
    let sum = 0;
    for (const sp of data.startingPoints)
        sum += explore(data, sp, false).length;

    return sum;
}

function explore({ map }: Data, p: Pos, part1 = true) {
    const queue: Pos[] = [p];
    const finished: Pos[] = [];
    const visited: Pos[] = [];

    while (queue.length > 0) {
        const current = queue.shift()!;
        const around = scanAround(map, current);

        if (around === true) {
            finished.push(current);
            continue;
        }

        for (const a of around) {
            if (part1 && visited.some(v => v.r === a.r && v.c === a.c))
                continue;

            queue.push(a);

            if (part1)
                visited.push(a);
        }
    }

    return finished;
}

function scanAround(map: Data['map'], p: Pos): Pos[] | true {
    const current = parseInt(map[p.r][p.c]);

    if (current === 9)
        return true;

    const valid: Pos[] = []

    const directions = [{ r: -1, c: 0 }, { r: 1, c: 0 }, { r: 0, c: -1 }, { r: 0, c: 1 }];

    for (const dir of directions) {
        const newPos = { r: p.r + dir.r, c: p.c + dir.c };
        if (newPos.r < 0 || newPos.r >= map.length || newPos.c < 0 || newPos.c >= map[0].length)
            continue;

        const next = parseInt(map[newPos.r][newPos.c]);
        if (next === current + 1)
            valid.push(newPos);
    }

    return valid;
}