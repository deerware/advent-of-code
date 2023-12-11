import log from '../log'
import { colors } from '../types'
import * as global from '../global';

export default async function main() {
    log('');

    global.run('', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 0],
        ['Part 1', part1, 'input.txt', null],
        null,
        ['Part 2 test 1', part2, 'sampleData2.txt', 0],
        ['Part 2', part2, 'input.txt', null],
    ]);
}

async function part1(data: string[]): Promise<number> {
    return -Infinity;
}

async function part2(data: string[]): Promise<number> {
    return -Infinity;
}