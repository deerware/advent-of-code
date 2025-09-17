import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';

export default async function tuningtrouble() {
    log('Day 6: Tuning Trouble');

    await g.run('2022/06_Tuning_Trouble', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 7],
        ['Part 1 test 2', part1, 'sampleData2.txt', 5],
        ['Part 1 test 3', part1, 'sampleData3.txt', 6],
        ['Part 1 test 4', part1, 'sampleData4.txt', 10],
        ['Part 1 test 5', part1, 'sampleData5.txt', 11],
        ['Part 1', part1, 'input.txt', null],
        false,
        ['Part 2 test 1', part2, 'sampleData1.txt', 19],
        ['Part 2 test 2', part2, 'sampleData2.txt', 23],
        ['Part 2 test 3', part2, 'sampleData3.txt', 23],
        ['Part 2 test 4', part2, 'sampleData4.txt', 29],
        ['Part 2 test 5', part2, 'sampleData5.txt', 26],
        ['Part 2', part2, 'input.txt', null],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    if (_data.length > 1)
        throw ('data error');

    return _data[0];
}

async function part1(data: Data): Promise<number> {
    for (let i = 4; i < data.length; i++) {
        const part = data.substring(i - 4, i);

        let gut = true;
        for (let j = 1; j <= part.length; j++)
            if (part.substring(0, j).includes(part[j])) {
                gut = false;
                break;
            }

        if (gut)
            return i;
    }

    return -Infinity;
}

async function part2(data: Data): Promise<number> {
    return -Infinity;
}