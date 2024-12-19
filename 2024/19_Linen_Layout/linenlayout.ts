import log from '../../log'
import { colors } from '../../types'
import * as global from '../../global';
import cache from '../../helpers/cache';

export default async function linenlayout() {
    log('Day 19: Linen Layout');

    await global.run('2024/19_Linen_Layout', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 6],
        ['Part 1', part1, 'input.txt', 236],
        null,
        ['Part 2 test 1', part2, 'sampleData1.txt', 16],
        ['Part 2', part2, 'input.txt', 643685981770598],
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
    evaluate.clear();

    let possible = 0;
    for (const design of data.designs)
        if (evaluate(design, data.available) > 0)
            possible++;

    return possible;
}

async function part2(data: Data): Promise<number> {
    evaluate.clear();

    let variants = 0;
    for (const design of data.designs)
        variants += evaluate(design, data.available);

    return variants;
}

const evaluate = cache(_evaluate, (design) => design);
function _evaluate(design: string, available: string[]) {
    if (design === '')
        return 1;

    let variants = 0;
    for (const a of available)
        if (design.startsWith(a))
            variants += evaluate(design.slice(a.length), available);

    return variants;
}