import log from '../../log'
import { colors } from '../../types'
import * as global from '../../global';
import regex from '../../helpers/regex';

export default async function ceressearch() {
    log('Day 4: Ceres Search');

    await global.run('2024/04_Ceres_Search', [
        ['Part 1 test 1', part1, 'sampleData.txt', 18],
        ['Part 1 test 2', part1, 'sampleData1.txt', 18],
        ['Part 1', part1, 'input.txt', 2464],
        false,
        ['Part 2 test 1', part2, 'sampleData2.txt', 9],
        ['Part 2 test 2', part2, 'sampleData.txt', 9],
        ['Part 2', part2, 'input.txt', null],
    ]);
}

async function part1(data: string[]): Promise<number> {
    let sum = 0;
    for (let row = 0; row < data.length; row++) {
        for (let col = 0; col < data[row].length; col++) {
            if (data[row][col] === 'X') {
                const dir = scan1(data, row, col);
                if (dir.length > 0)
                    sum += dir.length;
            }
        }
    }
    return sum;
}

type DIR = 'up' | 'down' | 'left' | 'right' | 'up-left' | 'up-right' | 'down-left' | 'down-right';

function scan1(data: string[], row: number, col: number): DIR[] {
    const dir: DIR[] = [];

    // right
    if (data[row].substring(col, col + 4) === 'XMAS')
        dir.push('right');

    // left
    if (data[row].substring(col - 3, col + 1) === 'SAMX')
        dir.push('left');

    // down
    if (row <= data.length - 4)
        if (data[row + 1][col] === 'M' && data[row + 2][col] === 'A' && data[row + 3][col] === 'S')
            dir.push('down');

    // up
    if (row >= 3)
        if (data[row - 1][col] === 'M' && data[row - 2][col] === 'A' && data[row - 3][col] === 'S')
            dir.push('up');

    // left-up
    if (row >= 3 && col >= 3)
        if (data[row - 1][col - 1] === 'M' && data[row - 2][col - 2] === 'A' && data[row - 3][col - 3] === 'S')
            dir.push('up-left');

    // right-up
    if (row >= 3 && col <= data[row].length - 4)
        if (data[row - 1][col + 1] === 'M' && data[row - 2][col + 2] === 'A' && data[row - 3][col + 3] === 'S')
            dir.push('up-right');

    if (row <= data.length - 4 && col >= 3)
        if (data[row + 1][col - 1] === 'M' && data[row + 2][col - 2] === 'A' && data[row + 3][col - 3] === 'S')
            dir.push('down-left');

    // right-down
    if (row <= data.length - 4 && col <= data[row].length - 4)
        if (data[row + 1][col + 1] === 'M' && data[row + 2][col + 2] === 'A' && data[row + 3][col + 3] === 'S')
            dir.push('down-right');

    return dir;
}

async function part2(data: string[]): Promise<number> {
    let sum = 0;
    for (let row = 0; row < data.length; row++) {
        for (let col = 0; col < data[row].length; col++) {
            if (data[row][col] === 'A') {
                if (scan2(data, row, col))
                    sum++;
            }
        }
    }
    return sum;
}

function scan2(data: string[], row: number, col: number): boolean {
    return false;
}