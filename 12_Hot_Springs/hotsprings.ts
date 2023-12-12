import log from '../log'
import { colors } from '../types'
import * as global from '../global';

export default async function main() {
    log('Day 12: Hot Springs');

    global.run('12_Hot_Springs', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 21],
        ['Part 1', part1, 'input.txt', 7251],
        null,
        ['Part 2 test 1', part2, 'sampleData2.txt', 0],
        ['Part 2', part2, 'input.txt', null],
    ]);
}

async function part1(data: string[]): Promise<number> {
    const lines = parseData(data);
    const combinations = [];
    for (const line of lines) {
        combinations.push(...getCombinations(line).filter(x => validateCombination(x, line.control)));
    }
    return combinations.length;
}

async function part2(data: string[]): Promise<number> {
    return -Infinity;
}

type Line = { data: string, control: number[] };

function parseData(data: string[]) {
    const lines: Line[] = [];
    for (const line of data) {
        lines.push({
            data: line.split(' ')[0],
            control: line.split(' ')[1].split(',').map(n => parseInt(n)),
        });
    }
    return lines;
}

function getCombinations(line: Line) {
    const count = line.data.split('?').length - 1;
    const combinations = [];
    for (let i = 0; i < Math.pow(2, count); i++) {
        const key = i.toString(2).padStart(count, '0');

        let data = line.data;
        for (let j = 0; j < key.length; j++) {
            data = data.replace('?', key[j] == '0' ? '.' : '#');
        }
        combinations.push(data);
    }
    return combinations;
}

function validateCombination(data: string, control: number[]) {
    const parts = data.split('.').filter(part => part.includes('#'));

    if (parts.length != control.length)
        return false;

    for (let i in control)
        if (parts[i].length != control[i])
            return false;

    return true;
}