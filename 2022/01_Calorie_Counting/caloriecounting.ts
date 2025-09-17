import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';

export default async function caloriecounting() {
    log('Day 1: Calorie Counting');

    await g.run('2022/01_Calorie_Counting', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 24000],
        ['Part 1', part1, 'input.txt', null],
        false,
        ['Part 2 test 1', part2, 'sampleData2.txt', 0],
        ['Part 2', part2, 'input.txt', null],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    let calories: number[] = [];
    const totals: number[][] = [];

    for (const line of _data) {
        if (line === '') {
            totals.push(calories);
            calories = [];
            continue;
        }
        calories.push(parseInt(line, 10));
    }
    if (calories.length)
        totals.push(calories);

    return totals;
}

async function part1(data: Data): Promise<number> {
    return data.reduce((max, cur) =>
        Math.max(cur.reduce((a, b) => a + b, 0), max), -Infinity);
}

async function part2(data: Data): Promise<number> {
    return -Infinity;
}