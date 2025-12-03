import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';

export default async function lobby() {
    log('Day 3: Lobby');

    await g.run('2025/03_Lobby', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 357],
        ['Part 1', part1, 'input.txt', 17229],
        null,
        ['Part 2 test 1', part2, 'sampleData1.txt', 0],
        ['Part 2', part2, 'input.txt', null],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    return _data.map(line => line.split('').map(n => parseInt(n)));
}

async function part1(data: Data): Promise<number> {
    let sum = 0;
    for (const line of data) {
        let max = 0;
        let maxI = 0;

        for (let i = 0; i < line.length - 1; i++) {
            if (line[i] > max) {
                max = line[i];
                maxI = i;
            }
        }

        sum = max * 10;

        let max2 = 0;

        for (let i = maxI + 1; i < line.length; i++) {
            if (line[i] > max2)
                max2 = line[i]
        }

        sum += max2;
    }

    return sum;
}

async function part2(data: Data): Promise<number> {
    return -Infinity;
}