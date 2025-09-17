import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';

export default async function rucksackreorganization() {
    log('Day 3: Rucksack Reorganization');

    await g.run('2022/03_Rucksack_Reorganization', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 157],
        ['Part 1', part1, 'input.txt', 8039],
        null,
        ['Part 2 test 1', part2, 'sampleData1.txt', 70],
        ['Part 2', part2, 'input.txt', 2510],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    return _data.map(line => {
        const common: string[] = [];

        if (line.length % 2 !== 0)
            throw new Error('Line length is not even: ' + line);

        const half = line.length / 2;
        const first = line.slice(0, half);
        const second = line.slice(half);

        for (const char of first)
            if (second.includes(char))
                if (!common.includes(char))
                    common.push(char);

        return { line, common };
    });
}

async function part1(data: Data): Promise<number> {
    let common: string[] = [];

    for (const line of data)
        common.push(...line.common);

    return common.reduce((sum, char) => sum + getPriority(char), 0);
}

async function part2(data: Data): Promise<number> {
    if (data.length % 3 !== 0)
        throw new Error('Data length is not multiple of 3: ' + data.length);

    let sum = 0;

    for (let i = 0; i < data.length; i += 3) {
        const group = data.slice(i, i + 3);

        for (const char of group[0].line)
            if (group[1].line.includes(char) && group[2].line.includes(char)) {
                sum += getPriority(char);
                break;
            }
    }

    return sum;
}

function getPriority(char: string): number {
    const code = char.charCodeAt(0);
    if (code >= 97 && code <= 122) // a-z
        return code - 96;
    if (code >= 65 && code <= 90) // A-Z
        return code - 65 + 27;

    throw new Error('Invalid character: ' + char);
}