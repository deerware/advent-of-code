import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';

export default async function secretentrance() {
    log('Day 1: Secret Entrance');

    await g.run('2025/01_Secret_Entrance', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 3],
        ['Part 1', part1, 'input.txt', 997],
        null,
        ['Part 2 test 1', part2, 'sampleData1.txt', 6],
        ['Part 2 test 2', part2, 'sampleData2.txt', 2],
        ['Part 2', part2, 'input.txt', 5978],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    return _data.map(line => ({ dir: line[0] as 'L' | 'R', dist: parseInt(line.substring(1)) }));
}

async function part1(data: Data): Promise<number> {
    return await part0(data);
}

async function part2(data: Data): Promise<number> {
    return await part0(data, true);
}

async function part0(data: Data, part2 = false): Promise<number> {
    let pos = 50;
    let part1Hits = 0;
    let part2Passes = 0;

    for (const line of data) {
        let newPos = pos;

        if (line.dir == 'R') {
            newPos = pos + line.dist;
            part2Passes += Math.floor(newPos / 100);
        } else {
            newPos = pos - line.dist;

            if (newPos <= 0) {
                if (pos != 0 && newPos <= 0)
                    part2Passes++;

                part2Passes += Math.floor(Math.abs(newPos / 100));
            }
        }

        pos = newPos % 100;
        if (pos < 0)
            pos += 100;

        if (pos == 0)
            part1Hits++;
    }

    if (part2)
        return part2Passes;

    return part1Hits;
}