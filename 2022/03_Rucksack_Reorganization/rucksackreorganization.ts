import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';

export default async function rucksackreorganization() {
    log('Day 3: Rucksack Reorganization');

    await g.run('2022/03_Rucksack_Reorganization', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 157],
        ['Part 1', part1, 'input.txt', 8039],
        false,
        ['Part 2 test 1', part2, 'sampleData2.txt', 0],
        ['Part 2', part2, 'input.txt', null],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    return _data;
}

async function part1(data: Data): Promise<number> {
    let common: string[] = [];

    for (const line of data) {
        const _common: string[] = [];

        if (line.length % 2 !== 0)
            throw new Error('Line length is not even: ' + line);

        const half = line.length / 2;
        const first = line.slice(0, half);
        const second = line.slice(half);

        for (const char of first)
            if (second.includes(char))
                if (!_common.includes(char))
                    _common.push(char);

        common.push(..._common);
    }

    return common.reduce((sum, char) => sum + getPriority(char), 0);
}

async function part2(data: Data): Promise<number> {
    return -Infinity;
}

function getPriority(char: string): number {
    const code = char.charCodeAt(0);
    if (code >= 97 && code <= 122) // a-z
        return code - 96;
    if (code >= 65 && code <= 90) // A-Z
        return code - 65 + 27;

    throw new Error('Invalid character: ' + char);
}