import log from '../../log'
import { colors } from '../../types'
import * as global from '../../global';

export default async function main() {
    log('Day 12: Hot Springs');

    global.run('12_Hot_Springs', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 21],
        ['Part 1', part1, 'input.txt', 7251],
        null,
        ['Part 2 test 1', part2, 'sampleData1.txt', 525152],
        ['Part 2', part2, 'input.txt', null],
    ]);
}

async function part1(data: string[]): Promise<number> {
    const lines = parseData(data);
    let combinations = 0
    for (const line of lines) {
        combinations += getCombinations(line);
    }
    return combinations;
}

async function part2(data: string[]): Promise<number> {
    const lines = parseData(data, 5);
    let combinations = 0
    for (const line of lines) {
        combinations += getCombinations(line);
    }
    return combinations;
}

type Line = { data: string, control: number[], missing: number };

function parseData(data: string[], folds = 1) {
    const lines: Line[] = [];
    for (const line of data) {
        const newLine = {
            data: ((line.split(' ')[0] + '?').repeat(folds)),
            control: line.split(' ')[1].repeat(folds).split(',').map(n => parseInt(n)),
            missing: 0,
        };
        newLine.data = newLine.data.substring(0, newLine.data.length - 1)
        newLine.missing = newLine.control.reduce((a, b) => a + b, 0) - newLine.data.split('#').length + 1;
        lines.push(newLine);
    }
    return lines;
}

function getCombinations(line: Line) {
    const count = line.data.split('?').length - 1;
    let combinations = 0;
    log(`Getting combinations for line: ${line.data}`);
    const max = Math.pow(2, count);
    for (let i = 0; i < max; i++) {
        const key = i.toString(2).padStart(count, '0');

        if (key.split('1').length - 1 != line.missing)
            continue;

        let data = line.data;
        for (let j = 0; j < key.length; j++) {
            data = data.replace('?', key[j] == '0' ? '.' : '#');
        }
        if (validateCombination(data, line.control))
            combinations++;

        // if (i % 1000000 == 0)
        // log(`${i} / ${max} (${Math.round(100 / max * i)} %)`);
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