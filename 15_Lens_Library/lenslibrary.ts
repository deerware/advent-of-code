import log from '../log'
import { colors } from '../types'
import * as global from '../global';

export default async function main() {
    log('Day 15: Lens Library');

    global.run('15_Lens_Library', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 52],
        ['Part 1 test 2', part1, 'sampleData2.txt', 1320],
        ['Part 1', part1, 'input.txt', null],
        null,
        ['Part 2 test 1', part2, 'sampleData2.txt', 0],
        ['Part 2', part2, 'input.txt', null],
    ]);
}

async function part1(data: string[]): Promise<number> {
    if (data.length > 1)
        throw new Error('Invalid data input');

    let sum = 0;
    const parts = data[0].split(',');
    for (const part of parts) {
        sum += hash(part);
    }
    return sum;
}

async function part2(data: string[]): Promise<number> {
    if (data.length > 1)
        throw new Error('Invalid data input');
    return -Infinity;
}

function hash(text: string) {
    let currentValue = 0;
    for (let i = 0; i < text.length; i++) {
        currentValue = (currentValue + text.charCodeAt(i)) * 17 % 256
    }
    return currentValue;
}