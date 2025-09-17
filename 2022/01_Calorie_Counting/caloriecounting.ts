import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';

export default async function caloriecounting() {
    log('Day 1: Calorie Counting');

    await g.run('2022/01_Calorie_Counting', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 24000],
        ['Part 1', part1, 'input.txt', 70509],
        null,
        ['Part 2 test 1', part2, 'sampleData1.txt', 45000],
        ['Part 2', part2, 'input.txt', 208567],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    let calories: number = 0;
    const totals: number[] = [];

    for (const line of _data) {
        if (line === '') {
            totals.push(calories);
            calories = 0
            continue;
        }
        calories += parseInt(line);
    }

    if (calories)
        totals.push(calories);

    return totals;
}

async function part1(data: Data): Promise<number> {
    return Math.max(...data);
}

async function part2(_data: Data): Promise<number> {
    const data = _data.sort((a, b) => b - a);

    return data[0] + data[1] + data[2];
}