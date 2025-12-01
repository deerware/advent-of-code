import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';

export default async function secretentrance() {
    log('Day 1: Secret Entrance');

    await g.run('2025/01_Secret_Entrance', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 3],
        ['Part 1', part1, 'input.txt', 997],
        false,
        ['Part 2 test 1', part2, 'sampleData2.txt', 0],
        ['Part 2', part2, 'input.txt', null],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    return _data.map(line => ({ dir: line[0] as 'L' | 'R', dist: parseInt(line.substring(1)) }));
}

async function part1(data: Data): Promise<number> {
    let pos = 50;
    let hits = 0;

    for (const line of data) {
        if (line.dir == 'R')
            pos += line.dist;
        else
            pos -= line.dist;

        pos %= 100;
        if (pos < 0)
            pos += 100;

        if (pos === 0)
            hits++;
    }

    return hits;
}

async function part2(data: Data): Promise<number> {
    return -Infinity;
}