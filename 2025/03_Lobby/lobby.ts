import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';

export default async function lobby() {
    log('Day 3: Lobby');

    await g.run('2025/03_Lobby', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 357],
        ['Part 1', part1, 'input.txt', 17229],
        null,
        ['Part 2 test 1', part2, 'sampleData1.txt', 3121910778619],
        ['Part 2', part2, 'input.txt', null],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    return _data.map(line => line.split('').map(n => parseInt(n)));
}

async function part1(data: Data): Promise<number> {
    return part0(data, 2);
}

async function part2(data: Data): Promise<number> {
    return part0(data, 12);
}

async function part0(data: Data, batteries: number): Promise<number> {
    let sum = 0;
    for (const line of data) {
        let maxI = -1;

        for (let b = 1; b <= batteries; b++) {
            let max = 0;
            maxI++;
            for (let i = maxI; i < (line.length - batteries + b); i++) {
                if (line[i] > max) {
                    max = line[i];
                    maxI = i;
                }

                if (max == 9)
                    break;
            }

            sum += max * Math.pow(10, batteries - b);
        }
    }

    return sum;
}