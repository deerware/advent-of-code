import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';

export default async function giftshop() {
    log('Day 2: Gift Shop');

    await g.run('2025/02_Gift_Shop', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 1227775554],
        ['Part 1', part1, 'input.txt', 19605500130],
        false,
        ['Part 2 test 1', part2, 'sampleData2.txt', 0],
        ['Part 2', part2, 'input.txt', null],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    const ranges = [];
    for (const line of _data.join('').split(',')) {
        ranges.push(line.split('-').map(n => parseInt(n)));
    }

    return ranges;
}

async function part1(data: Data): Promise<number> {
    let invalidSum = 0;

    for (const range of data) {

        for (let i = range[0]; i <= range[1]; i++) {
            const str = i.toString();
            if (str.length % 2 == 1)
                continue;

            const half = str.length / 2;

            if (str.substring(0, half) == str.substring(half))
                invalidSum += i;

        }
    }

    return invalidSum;
}

async function part2(data: Data): Promise<number> {
    return -Infinity;
}