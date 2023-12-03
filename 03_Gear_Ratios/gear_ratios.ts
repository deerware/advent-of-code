import fs from 'fs';
import log from '../log'
import { colors } from '../types'
import { loadLines, logResult, regexIndexOf } from '../global';

export default async function main() {
    const startTime = new Date();
    log("Day 3: Gear Ratios");

    if (logResult('Part 1 test', await part1(loadLines('03_Gear_Ratios/sampleData1.txt')), 4361))
        logResult('Part 1', await part1(loadLines('03_Gear_Ratios/input.txt')))

    log();

    if (logResult('Part 2 test', await part2(loadLines('03_Gear_Ratios/sampleData1.txt')), 467835))
        logResult('Part 2', await part2(loadLines('03_Gear_Ratios/input.txt')))

    log(colors.fg.gray + `Executed in ${(new Date().getTime() - startTime.getTime())}ms`);
}

async function part1(data: string[], symbols: [number, number, string, number[]][] = [], numbers: [number, number, string][] = []): Promise<number> {
    data.forEach((line, i) => {
        let j = -1;
        while (true) {
            j = regexIndexOf(line, /[^\d\.\s]/gm, j + 1);
            if (j === -1)
                break;

            symbols.push([i, j, line[j], []]);
        }
    });
    // log(symbols);

    data.forEach((line, i) => {
        let j = -1;
        while (true) {
            j = regexIndexOf(line, /\d+/gm, j + 1);
            if (j === -1)
                break;

            const match = line.substring(j).match(/\d+/)?.[0];
            if (!match)
                throw new Error('No match');

            numbers.push([i, j, match]);

            j += match.length - 1;
        }
    });
    // log(numbers);

    let sum = 0;
    numbers.forEach(number => {
        const valid = symbols.find(symbol => {
            if (symbol[0] === number[0])
                if (symbol[1] === number[1] - 1 || symbol[1] === number[1] + number[2].length) {
                    symbol[3].push(parseInt(number[2]));
                    return true;
                }

            if (symbol[0] == number[0] - 1 || symbol[0] == number[0] + 1)
                if (symbol[1] >= number[1] - 1)
                    if (symbol[1] <= number[1] + number[2].length) {
                        symbol[3].push(parseInt(number[2]));
                        return true;
                    }

            return false;
        }) ?? false;

        // log(`${number[0]}:${number[1]} ${number[2]} ${valid ? 'valid' : 'invalid'}`);

        if (valid)
            sum += parseInt(number[2]);
    });

    return sum;
}

async function part2(data: string[]): Promise<number> {
    const symbols: [number, number, string, number[]][] = [];
    const numbers: [number, number, string][] = [];
    part1(data, symbols, numbers);

    let sum = 0;
    symbols.filter(symbol => symbol[2] === '*' && symbol[3].length !== 1).forEach(symbol => {
        if (symbol[3].length !== 2)
            throw new Error('Count error');

        sum += symbol[3][0] * symbol[3][1];
    });

    return sum;
}