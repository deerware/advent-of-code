import log from '../../log'
import { colors } from '../../types'
import * as global from '../../global';

export default async function bridgerepair() {
    log('Day 7: Bridge Repair');

    await global.run('2024/07_Bridge_Repair', [
        ['Part 1 test 1', part1, 'sampleData.txt', 3749],
        ['Part 1', part1, 'input.txt', 21572148763543],
        null,
        ['Part 2 test 1', part2, 'sampleData.txt', 11387],
        ['Part 2', part2, 'input.txt', 581941094529163],
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

enum PossibleOperators {
    PART1 = 2,
    PART2 = 3,
}

async function part1(data: Data): Promise<number> {
    return process(data, PossibleOperators.PART1);
}

async function part2(data: Data): Promise<number> {
    return process(data, PossibleOperators.PART2);
}

async function process(data: Data, possibOperators: PossibleOperators): Promise<number> {
    let passing = 0;
    for (const d of data) {
        if (operatorsCombinations(d.parts.length - 1, possibOperators, (operators) => {
            let result = d.parts[0];
            for (let i = 0; i < operators.length; i++) {
                if (operators[i] === Operators.ADD)
                    result += d.parts[i + 1];

                if (operators[i] === Operators.MUL)
                    result *= d.parts[i + 1];

                if (operators[i] === Operators.CONC)
                    result = parseInt(result.toString() + d.parts[i + 1].toString());
            }
            return result === d.test;
        }))
            passing += d.test;
    }
    return passing;
}

enum Operators {
    ADD,
    MUL,
    CONC,
}

function operatorsCombinations(count: number, operatorsN: 2 | 3, callback: (operators: Operators[]) => boolean | void) {
    const max = Math.pow(operatorsN, count);

    for (let i = 0; i < max; i++) {
        const bin = i.toString(operatorsN).padStart(count, '0');
        const operators = bin.split('').map((v) => v === '0' ? Operators.ADD : v === '1' ? Operators.MUL : Operators.CONC);

        if (callback(operators) === true)
            return true;
    }

    return false;
}