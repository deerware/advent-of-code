import log from '../../log'
import { colors } from '../../types'
import * as global from '../../global';

export default async function rednosedreports() {
    log('Day 2: Red-Nosed Reports');

    await global.run('2024/02_Red_Nosed_Reports', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 2],
        ['Part 1', part1, 'input.txt', 598],
        null,
        ['Part 2 test 1', part2, 'sampleData1.txt', 4],
        ['Part 2', part2, 'input.txt', 634],
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

async function part2(_data: string[]): Promise<number> {
    const data = _data.map(line => line.split(' ').map(Number));
    let count = 0;
    for (const line of data) {
        if (safe(line, true))
            count++;
    }
    return count;

}

function safe(data: number[], allowSingleError = false): boolean {
    let num;
    let dir;
    for (let i = 0; i < data.length; i++) {
        const n = data[i];

        if (num === undefined) {
            num = n;
            continue;
        }
        if (n === num)
            if (allowSingleError)
                return tryWithoutOne(data);
            else
                return false;
        if (dir === undefined) {
            dir = n > num;
        } else {
            if (dir !== n > num)
                if (allowSingleError)
                    return tryWithoutOne(data);
                else
                    return false;
        }

        if (Math.abs(n - num) > 3)
            if (allowSingleError)
                return tryWithoutOne(data);
            else
                return false;

        num = n;
    }
    return true;
}

function tryWithoutOne(arr: number[]) {
    for (let i = 0; i < arr.length; i++) {
        if (safe(removeItemAt(arr, i)))
            return true;
    }
    return false;
}

function removeItemAt<T>(arr: T[], at: number) {
    const temp = [...arr];
    temp.splice(at, 1);
    return temp;
}