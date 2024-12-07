import log from '../../log'
import { colors } from '../../types'
import * as global from '../../global';

export default async function bridgerepair() {
    log('Day 7: Bridge Repair');

    await global.run('2024/07_Bridge_Repair', [
        ['Part 1 test 1', part1, 'sampleData.txt', 3749],
        ['Part 1', part1, 'input.txt', null],
        null,
        ['Part 2 test 1', part2, 'sampleData.txt', 11387],
        ['Part 2', part2, 'input.txt', null],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    const data: { test: number, parts: number[] }[] = [];
    for (const line of _data) {
        const parts = line.split(': ');
        data.push({ test: parseInt(parts[0]), parts: parts[1].split(' ').map(Number) });
    }
    return data;
}

async function part1(data: Data): Promise<number> {
    let passing = 0;
    for (const d of data) {
        if (operatorsCombinations(d.parts.length - 1, (operators) => {
            let result = d.parts[0];
            for (let i = 0; i < operators.length; i++) {
                if (operators[i] === Operators.ADD)
                    result += d.parts[i + 1];

                if (operators[i] === Operators.MUL)
                    result *= d.parts[i + 1];
            }
            return result === d.test;
        }))
            passing += d.test;
    }
    return passing;
}

async function part2(data: Data): Promise<number> {
    return -Infinity;
}

enum Operators {
    ADD,
    MUL
}

function operatorsCombinations(count: number, callback: (operators: Operators[]) => boolean | void) {
    const max = Math.pow(2, count);

    for (let i = 0; i < max; i++) {
        const bin = dec2bin(i).padStart(count, '0');
        const operators = bin.split('').map((v) => v === '0' ? Operators.ADD : Operators.MUL);

        if (callback(operators) === true)
            return true;
    }

    return false;
}

function dec2bin(dec: number) {
    return (dec).toString(2);
}