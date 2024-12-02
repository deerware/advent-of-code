import log from '../../log'
import { colors } from '../../types'
import * as global from '../../global';

export default async function rednosedreports() {
    log('Day 2: Red-Nosed Reports');

    global.run('2024/02_Red_Nosed_Reports', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 2],
        ['Part 1', part1, 'input.txt', 598],
        null,
        ['Part 2 test 1', part2, 'sampleData1.txt', 0],
        ['Part 2', part2, 'input.txt', null],
    ]);
}

async function part1(_data: string[]): Promise<number> {
    const data = _data.map(line => line.split(' ').map(Number));
    let count = 0;
    for (const line of data) {
        if (safe(line))
            count++;
    }
    return count;
}

async function part2(data: string[]): Promise<number> {
    return -Infinity;
}

function safe(data: number[]) {
    let num;
    let dir;
    for (const n of data) {
        if (num === undefined) {
            num = n;
            continue;
        }
        if (n === num)
            return false;
        if (dir === undefined) {
            dir = n > num;
        } else {
            if (dir !== n > num)
                return false;
        }

        if (Math.abs(n - num) > 3)
            return false;

        num = n;
    }
    return true;
}