import log from '../../log'
import { colors } from '../../types'
import * as global from '../../global';

export default async function linenlayout() {
    log('Day 19: Linen Layout');

    await global.run('2024/19_Linen_Layout', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 6],
        ['Part 1', part1, 'input.txt', 236],
        false,
        ['Part 2 test 1', part2, 'sampleData2.txt', 0],
        ['Part 2', part2, 'input.txt', null],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    const available = _data[0].split(', ');
    available.sort((a, b) => b.length - a.length);

    const designs = _data.slice(2);

    return { available, designs };
}

async function part1(data: Data): Promise<number> {
    let possible = 0;

    for (const design of data.designs) {
        if (evaluate(design, data.available))
            possible++;
    }
    return possible;
}

async function part2(data: Data): Promise<number> {
    return -Infinity;
}

function evaluate(design: string, available: string[]): boolean {
    for (const a of available) {
        if (design === a)
            return true;

        if (design.startsWith(a))
            if (evaluate(design.slice(a.length), available))
                return true;
    }

    return false;
}