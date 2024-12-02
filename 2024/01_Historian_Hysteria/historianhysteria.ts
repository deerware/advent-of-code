import log from '../../log'
import { colors } from '../../types'
import * as global from '../../global';

export default async function main() {
    log('Day 1: Historian Hysteria');

    await global.run('2024/01_Historian_Hysteria', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 11],
        ['Part 1', part1, 'input.txt', 1889772],
        null,
        ['Part 2 test 1', part2, 'sampleData2.txt', 31],
        ['Part 2', part2, 'input.txt', 23228917],
    ]);
}

async function leftRight(data: string[]): Promise<[number[], number[]]> {
    const left = [];
    const right = [];
    for (const line of data) {
        const curr = line.split(' ');
        left.push(parseInt(curr[0]));
        right.push(parseInt(curr[curr.length - 1]));
    }
    left.sort();
    right.sort();
    if (left.length !== right.length)
        throw new Error('Lengths do not match');

    return [left, right];
}

async function part1(data: string[]): Promise<number> {
    const [left, right] = await leftRight(data);

    let sum = 0;
    for (let i = 0; i < left.length; i++) {
        sum += Math.abs(left[i] - right[i]);
    }
    return sum;
}

async function part2(data: string[]): Promise<number> {
    const [left, right] = await leftRight(data);

    let similarity = 0;
    for (const num of left) {
        similarity += num * right.filter(r => r === num).length;
    }
    return similarity;
}